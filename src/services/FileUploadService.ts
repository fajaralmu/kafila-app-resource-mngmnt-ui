import { inject, injectable } from "inversify";
import RestClient from "../apiClients/RestClient";
import Employee from "../models/Employee";
import Settings from "../settings";

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
        return this.rest.postAuthorized(url, formData);
    }
}