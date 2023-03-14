export default interface CalendarEventReq {
  activity: 'ACTIVE' | 'NOT_ACTIVE';
  division: string;
  day: number;
  month: number;
  year: number;
  description: string;
  schoolId: number;
}
