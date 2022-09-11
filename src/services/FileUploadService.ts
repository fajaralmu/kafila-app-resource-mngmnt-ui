import { inject, injectable } from "inversify";
import RestClient from "../apiClients/RestClient";
import Employee from "../models/Employee";
import Settings from "../settings";
import WebResponse from './../models/WebResponse';
import School from './../models/School';
import SemesterPeriod from './../models/SemesterPeriod';
import { Division } from "../constants/Division";

const API_URL = Settings.App.hosts.api +"/api/admin/management/uploads/";

@injectable()
export default class FileUploadService {
    @inject(RestClient)
    private rest:RestClient;
    
    uploadSignature = (employee: Employee, file: File) => {
        const url = `${API_URL}employee/signature`;
        const formData = new FormData();
        formData.append('id', employee.id.toString());
        formData.append('file', file);
        return this.rest.postAuthorized<WebResponse<string>>(url, formData);
    }
    uploadSchoolStamp = (sch: School, file: File) => {
        const url = `${API_URL}school/stamp`;
        const formData = new FormData();
        formData.append('id', sch.id.toString());
        formData.append('file', file);
        return this.rest.postAuthorized<WebResponse<string>>(url, formData);
    }
    uploadDivisionStamp = (period: SemesterPeriod, file: File, division: Division) => {
        const url = `${API_URL}division-stamp`;
        const formData = new FormData();
        formData.append('id', period.id.toString());
        formData.append('file', file);
        formData.append('division', division.toString());
        return this.rest.postAuthorized<WebResponse<string>>(url, formData);
    }
}