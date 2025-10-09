import { useEffect, useMemo, useState } from 'react';
import { intervalConfig } from '../constants/config';

function parseTimeString(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  return { hours: isNaN(h) ? 0 : h, minutes: isNaN(m) ? 0 : m };
}

export default function useIntervalWindows() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalConfig.TIMER_INTERVAL || 1000);
    return () => clearInterval(t);
  }, []);

  const { startDate, endDate, started, ended, minutesToStart } = useMemo(() => {
    const { hours, minutes } = parseTimeString(intervalConfig.START_TIME);
    const start = new Date(); start.setHours(hours, minutes, 0, 0);
    const duration = (intervalConfig.DURATION_MINUTES || 15);
    const end = new Date(start); end.setMinutes(start.getMinutes() + duration);

    // if start is in the past for today, leave as is (we consider same-day intervals)
    const started = now >= start;
    const ended = now >= end;
    const minutesToStart = Math.ceil((start - now) / 60000);

    return { startDate: start, endDate: end, started, ended, minutesToStart };
  }, [now]);

  const withinReceiveWindow = useMemo(() => {
    const minutesBefore = intervalConfig.MINUTES_BEFORE_INTERVAL || 5;
    return minutesToStart <= minutesBefore && minutesToStart >= 0;
  }, [minutesToStart]);

  return { now, startDate, endDate, started, ended, minutesToStart, withinReceiveWindow };
}
