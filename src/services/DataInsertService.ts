import { inject, injectable } from 'inversify';
import RestClient from '../apiClients/RestClient';
import Settings from '../settings';
const API_URL = Settings.App.hosts.api +'/api/admin/management/data/';

@injectable()
export default class DataInsertService {
    @inject(RestClient)
    private rest: RestClient;

    insertEmployeesBulk = (csv: File) => {
        const url = `${API_URL}bulk-insert-employees`;
        const formData = new FormData();
        formData.append('file', csv);
        return this.rest.postAuthorized<any>(url, formData);
    }
}