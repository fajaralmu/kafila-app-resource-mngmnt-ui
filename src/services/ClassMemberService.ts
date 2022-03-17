import { inject, injectable } from "inversify";
import Settings from "../settings";
import RestClient from './../apiClients/RestClient';
import ClassMember from './../models/ClassMember';

const API_URL = Settings.App.hosts.api +"/api/admin/management/";

@injectable()
export default class ClassMemberService {
    @inject(RestClient)
    private rest: RestClient;

    getMembers = (classLevelId: number) => {
        return this.rest.getAuthorized<ClassMember[]>(`${API_URL}classlevels/${classLevelId}/members`);
    }
}