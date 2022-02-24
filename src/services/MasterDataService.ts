import { inject, injectable } from "inversify";
import BaseModel from "../models/BaseModel";
import MasterDataResult from "../models/MasterDataResult";
import RestClient from './../apiClients/RestClient';
import Settings from './../settings';

let models : "products" | "users" | "packagings" ;

const API_URL = Settings.App.hosts.api +"/api/admin/";

@injectable()
export default class MasterDataService
{
    @inject(RestClient)
    private rest:RestClient;

    list = <T extends BaseModel>(
        name: typeof models, 
        page:number, 
        perPage:number): Promise<MasterDataResult<T>> => {
            
        const url = `${API_URL}${name}?page=${page}&limit=${perPage}`;
        return this.rest.getAuthorized(url);
    }
    get = <T extends BaseModel>(name: typeof models, id:number): Promise<T> => {
        
        const url = `${API_URL}${name}/${id}`;
        return this.rest.getAuthorized(url);
    }
    post = <T extends BaseModel>(name: typeof models, model:T): Promise<T> => {

        const url = `${API_URL}${name}`;
        return this.rest.postAuthorized(url, model);
    }
    put = <T extends BaseModel>(name: typeof models, id:number, model:T): Promise<T> => {

        const url = `${API_URL}${name}/${id}`;
        return this.rest.putAuthorized(url, model);
    }
    delete = <T extends BaseModel>(name: typeof models, id:number): Promise<T> => {

        const url = `${API_URL}${name}/${id}`;
        return this.rest.deleteAuthorized(url);
    }
}