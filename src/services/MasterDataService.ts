import { inject, injectable } from "inversify";
import ModelNames from "../constants/ModelNames";
import BaseModel from "../models/BaseModel";
import MasterDataResult from "../models/MasterDataResult";
import RestClient from './../apiClients/RestClient';
import Settings from './../settings';


const API_URL = Settings.App.hosts.api +"/api/admin/management/";

@injectable()
export default class MasterDataService {
    @inject(RestClient)
    private rest:RestClient;

    list = <T extends BaseModel>(
        name: ModelNames, 
        page:number, 
        perPage:number,
        order:string|undefined = 'id',
        orderDesc?:boolean,
        filter?:string[] | string
    ): Promise<MasterDataResult<T>> => {
        let orderString = '';
        if (order)
        {
            orderString = '&order='+order;
            if (orderDesc === true)
            {
                orderString += '&orderDesc=true'
            }
        }
        const url = `${API_URL}${name}?page=${page}&limit=${perPage}` + orderString + (filter? filterQueryParam(filter) : '' );
        return this.rest.getAuthorized(url);
    }
    get = <T extends BaseModel>(name: ModelNames, id:number): Promise<T> => {
        
        const url = `${API_URL}${name}/${id}`;
        return this.rest.getAuthorized(url);
    }
    post = <T extends BaseModel>(name: ModelNames, model:T): Promise<T> => {

        const url = `${API_URL}${name}`;
        return this.rest.postAuthorized(url, model);
    }
    put = <T extends BaseModel>(name: ModelNames, id:number, model:T): Promise<T> => {

        const url = `${API_URL}${name}/${id}`;
        return this.rest.putAuthorized(url, model);
    }
    patchAction = <T extends BaseModel>(name: ModelNames, id:number, action:string): Promise<T> => {

        const url = `${API_URL}${name}/${id}?action=${action}`;
        return this.rest.patchAuthorized(url, {});
    }
    delete = <T extends BaseModel>(name: ModelNames, id:number): Promise<T> => {

        const url = `${API_URL}${name}/${id}`;
        return this.rest.deleteAuthorized(url);
    }
}

const filterQueryParam = (filter?: string[] | string) => {
    if (!filter || filter.length == 0) {
        return '';
    }
    if (typeof filter === 'string') {
        return `&filter=${filter}`;
    }
    const filters = [];
    for (let i = 0; i < filter.length; i++) {
        const element = filter[i];
        filters.push(`filter=${element}`);
    }
    return '&' + filters.join('&');
}
