export type DateRangeType = "day" | "this-week" | "this-month" | "week" | "month" | "custom";

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

export function getRangeForType(type: DateRangeType, opts?: { startDate?: Date; endDate?: Date }): { startDate: Date; endDate: Date } {
  const now = new Date();

  switch (type) {
    case "day": {
      return { startDate: startOfDay(now), endDate: endOfDay(now) };
    }

    case "this-week": {
      const today = now;
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
      const startDate = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset));
      const endDate = endOfDay(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6));
      return { startDate, endDate };
    }

    case "this-month": {
      const startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      const endDate = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
      return { startDate, endDate };
    }

    case "week": {
      // last 7 days including today
      const endDate = endOfDay(now);
      const startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
      return { startDate, endDate };
    }

    case "month": {
      // last 30 days including today
      const endDate = endOfDay(now);
      const startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29));
      return { startDate, endDate };
    }

    case "custom": {
      if (opts?.startDate && opts?.endDate) {
        return { startDate: startOfDay(opts.startDate), endDate: endOfDay(opts.endDate) };
      }
      // fallback to last 7 days
      const endDate = endOfDay(now);
      const startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
      return { startDate, endDate };
    }

    default:
      return { startDate: startOfDay(now), endDate: endOfDay(now) };
  }
}

export function getComparisonRange(type: DateRangeType, currentStart?: Date, currentEnd?: Date): { comparisonStartDate: Date; comparisonEndDate: Date } {
  const now = new Date();

  switch (type) {
    case "day": {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      return { comparisonStartDate: startOfDay(yesterday), comparisonEndDate: endOfDay(yesterday) };
    }

    case "this-week": {
      // previous calendar week (Mon-Sun)
      const today = now;
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const thisWeekMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);
      const lastWeekMonday = new Date(thisWeekMonday.getFullYear(), thisWeekMonday.getMonth(), thisWeekMonday.getDate() - 7);
      const lastWeekSunday = new Date(lastWeekMonday.getFullYear(), lastWeekMonday.getMonth(), lastWeekMonday.getDate() + 6);
      return { comparisonStartDate: startOfDay(lastWeekMonday), comparisonEndDate: endOfDay(lastWeekSunday) };
    }

    case "this-month": {
      // previous calendar month
      const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const prevMonthStart = new Date(firstOfThisMonth.getFullYear(), firstOfThisMonth.getMonth() - 1, 1);
      const prevMonthEnd = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth() + 1, 0);
      return { comparisonStartDate: startOfDay(prevMonthStart), comparisonEndDate: endOfDay(prevMonthEnd) };
    }

    case "week": {
      // previous 7-day window immediately before current 7-day window
      // If currentStart/currentEnd provided, shift by the same duration
      if (currentStart && currentEnd) {
        const duration = currentEnd.getTime() - currentStart.getTime();
        const compEnd = new Date(currentStart.getTime() - 1);
        const compStart = new Date(compEnd.getTime() - duration + 1);
        return { comparisonStartDate: startOfDay(compStart), comparisonEndDate: endOfDay(compEnd) };
      }
      // fallback: 8-14 days ago
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);
      return { comparisonStartDate: startOfDay(start), comparisonEndDate: endOfDay(end) };
    }

    case "month": {
      // previous 30-day window immediately before current 30-day window
      if (currentStart && currentEnd) {
        const duration = currentEnd.getTime() - currentStart.getTime();
        const compEnd = new Date(currentStart.getTime() - 1);
        const compStart = new Date(compEnd.getTime() - duration + 1);
        return { comparisonStartDate: startOfDay(compStart), comparisonEndDate: endOfDay(compEnd) };
      }
      // fallback: 30-59 days ago
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 59);
      return { comparisonStartDate: startOfDay(start), comparisonEndDate: endOfDay(end) };
    }

    case "custom": {
      if (currentStart && currentEnd) {
        const duration = currentEnd.getTime() - currentStart.getTime();
        const compStart = new Date(currentStart.getTime() - duration);
        const compEnd = new Date(currentEnd.getTime() - duration);
        return { comparisonStartDate: startOfDay(compStart), comparisonEndDate: endOfDay(compEnd) };
      }
      // fallback to yesterday
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      return { comparisonStartDate: startOfDay(yesterday), comparisonEndDate: endOfDay(yesterday) };
    }

    default:
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      return { comparisonStartDate: startOfDay(yesterday), comparisonEndDate: endOfDay(yesterday) };
  }
}
