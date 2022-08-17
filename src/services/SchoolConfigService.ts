import { inject, injectable } from "inversify";
import RestClient from '../apiClients/RestClient';
import Settings from "../settings";
import SchoolConfig from './../models/SchoolConfig';

const API_URL = Settings.App.hosts.api +"/api/admin/management/";

@injectable()
export default class SchoolConfigService {
    @inject(RestClient)
    private rest: RestClient;

    getConfig = (schoolId: number) => {
        return this.rest.getAuthorized<SchoolConfig>(`${API_URL}schools-config/school/${schoolId}`);
    }
    update = (config: SchoolConfig) => {
        return this.rest.putAuthorized<SchoolConfig>(`${API_URL}schools-config/${config.id}`, config);
    }
}