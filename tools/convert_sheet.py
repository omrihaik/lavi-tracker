#!/usr/bin/env python3
"""I-03: turn a CSV export of the tracking Sheet into structured events.
Run locally. Input and output stay in data/, which git ignores. No real data belongs in this file."""
import csv, json, re, sys, collections
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

TZ = ZoneInfo('Asia/Jerusalem')
SLEEP = {'נרדם', 'נרדם במנשא', 'נרדם עליי'}
WAKE = {'התעורר', 'ניסיתי להעביר אותו והתעורר'}
FEED = {'אכל', 'אוכל', 'האכלה'}
WAKE_FEED = {'התעורר האכלה', 'התעורר ואכל'}
PUTDOWN = {'השכבה', 'ניסיון השכבה נוסף', 'ניסיון להרדים', 'ניסיון הרדמה', 'הרדמה', 'הוחזר למיטה'}
ACTIVITY = {'פעילות', 'משחק'}
OUT_OF_SCOPE = {'מקלחת', 'החלפת חיתול קקי', 'סיום אוכל'}  # bath and diapers are out of scope; feed end is not an event
HARD_WORDS = ('קשה', 'בכי', 'לא הצליח')


def parse_date(s):
    s = s.strip()
    if m := re.fullmatch(r'(\d{1,2})\.(\d{1,2})', s):
        return datetime(2026, int(m[2]), int(m[1]))
    if m := re.fullmatch(r'(\d{1,2})/(\d{1,2})/(\d{4})', s):
        return datetime(int(m[3]), int(m[1]), int(m[2]))
    return None


def parse_time(s):
    m = re.fullmatch(r'(\d{1,2}):(\d{2})(?::\d{2})?', s.strip())
    return (int(m[1]), int(m[2])) if m else None


def parse_feed(note):
    m = re.search(r'\d{2,3}(?!\s*ד)', note) if not re.search(r'\d:\d', note) else None
    ml = int(m[0]) if m and 30 <= int(m[0]) <= 250 else None
    return ml, ('hard' if any(w in note for w in HARD_WORDS) else None)


def minutes_of(r):
    t = parse_time(r[1])
    return t[0] * 60 + t[1] if t else None


def resolve_clock(minutes, previous, next_raw, label_changed):
    """Decide what a time that runs backwards means. Returns (minutes, day_step), or None if unclear."""
    if minutes >= previous - 60:  # in order, or a small correction
        return minutes, 0
    pm = minutes + 720
    if label_changed and previous - minutes >= 360:  # the Sheet's date moved on, and so did the clock
        return minutes, 1
    if next_raw is not None and next_raw >= previous:  # both neighbours agree, so only this row can be off
        return (pm, 0) if previous <= pm <= next_raw else None
    # The next row may continue the evening, also typed without the 12 hours, or may be after midnight.
    fits_next = next_raw is None or next_raw >= pm or next_raw + 720 >= pm or next_raw < 360
    if previous <= pm <= 1439 and fits_next:  # typed "8:00" for 20:00
        return pm, 0
    if previous - minutes >= 360:  # the clock really passed midnight
        return minutes, 1
    return None


def convert(path):
    rows = list(csv.reader(open(path, encoding='utf8')))[1:]
    numbered = [(n, r) for n, r in enumerate(rows, start=2) if len(r) > 2 and r[2].strip()]
    events, report = [], collections.defaultdict(list)
    day, last_minutes, seen_label = None, -1, ''
    for i, (n, r) in enumerate(numbered):
        label = ' '.join(r[2].split())
        note = r[3].strip() if len(r) > 3 else ''
        explicit = parse_date(r[0]) if r[0].strip() else None
        previous_label, seen_label = seen_label, r[0].strip()
        if label in OUT_OF_SCOPE:
            report['out_of_scope'].append((n, label))
            continue
        minutes = minutes_of(r)
        if minutes is None:  # no time: nothing to place on the timeline
            report['no_time'].append((n, label))
            continue
        if day is None or (explicit and explicit > day):
            # A later date in the Sheet is trusted. An earlier or equal one isn't: it was often copied down.
            day, last_minutes = explicit, minutes
        else:
            next_raw = next((m for _, x in numbered[i + 1:i + 4] if (m := minutes_of(x)) is not None), None)
            resolved = resolve_clock(minutes, last_minutes, next_raw, r[0].strip() != previous_label)
            if resolved is None:
                report['unclear_time'].append((n, label, r[1]))
                continue
            if resolved[0] != minutes:
                report['pm_fixed'].append((n, r[1]))
            minutes, step = resolved
            if step:
                day += timedelta(days=1)
                report['date_inferred'].append((n, day.strftime('%Y-%m-%d')))
            last_minutes = minutes
        if explicit and (day - explicit).days > 1:
            report['ahead_of_sheet'].append((n, r[0], day.strftime('%Y-%m-%d')))
        at = day.replace(hour=minutes // 60, minute=minutes % 60, tzinfo=TZ)
        ms = int(at.timestamp() * 1000)
        base_e = {'id': f'sheet-{n}', 'at': ms, 'source': 'sheet'}
        if label in SLEEP:
            events.append({**base_e, 'type': 'sleep_start'})
        elif label in WAKE:
            events.append({**base_e, 'type': 'sleep_end'})
        elif label in FEED or label in WAKE_FEED:
            if label in WAKE_FEED:
                events.append({**base_e, 'id': f'sheet-{n}-wake', 'at': ms - 1, 'type': 'sleep_end'})
            ml, rating = parse_feed(note)
            e = {**base_e, 'type': 'feed'}
            if ml: e['ml'] = ml
            if rating: e['rating'] = rating
            if note and not ml: report['feed_note_without_amount'].append((n, note[:40]))
            events.append(e)
        elif label in PUTDOWN:
            e = {**base_e, 'type': 'putdown'}
            events.append(e)
        elif label in ACTIVITY:
            events.append({**base_e, 'type': 'activity', 'activity': 'unspecified'})
        elif 'בכי' in label and 'השכבה' in label:
            events.append({**base_e, 'type': 'putdown', 'crying': True})
        else:
            report['unmapped'].append((n, label))

    # A feeding while he is marked asleep means he woke up: the same rule as the app (FR-3).
    events.sort(key=lambda e: e['at'])
    out, asleep, auto = [], False, 0
    for e in events:
        if e['type'] == 'feed' and asleep:
            out.append({'id': e['id'] + '-autowake', 'at': e['at'] - 1, 'source': 'sheet', 'type': 'sleep_end', 'auto': True})
            asleep, auto = False, auto + 1
        if e['type'] == 'sleep_start': asleep = True
        if e['type'] == 'sleep_end': asleep = False
        out.append(e)
    report['auto_wake'] = auto
    return out, report


if __name__ == '__main__':
    events, report = convert(sys.argv[1])
    json.dump(events, open(sys.argv[2], 'w'), ensure_ascii=False)
    print(len(events), 'events')
