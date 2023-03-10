import { resolve } from "inversify-react";
import Settings from "../settings";
import RestClient from './../apiClients/RestClient';
import CalendarEventRes from './../models/res/CalendarEventRes';
import CalendarEventReq from './../models/req/CalendarEventReq';

const API_URL = Settings.App.hosts.api + '/api/admin/calendar-events/';

export default class CalendarEventService {
  @resolve(RestClient)
  private rest: RestClient;

  getDivisions = () => {
    return this.rest.getAuthorized<string[]>(`${API_URL}divisions`);
  }
  getActivityTypes = () => {
    return this.rest.getAuthorized<string[]>(`${API_URL}activity-types`);
  }
  getEvents = (month: number, year: number, schoolId: number, division: string) => {
    const url = `${API_URL}month/${month}/year/${year}/school/${schoolId}/division/${division}`;
    return this.rest.getAuthorized<CalendarEventRes[]>(url);
  }
  insert = (req: CalendarEventReq) => {
    return this.rest.postAuthorized<CalendarEventRes>(API_URL, req);
  };
  update = (id: number, req: CalendarEventReq) => {
    return this.rest.putAuthorized<CalendarEventRes>(`${API_URL}${id}`, req);
  }
  delete = (id: number) => {
    return this.rest.deleteAuthorized<CalendarEventRes>(`${API_URL}${id}`);
  }
}