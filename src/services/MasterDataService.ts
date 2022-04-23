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
    list = <T extends BaseModel>(
        name: ModelNames, 
        page:number, 
        perPage:number,
        order:string|undefined = 'id',
        orderDesc?:boolean,
        filter?:string[] | string,
        fieldPaths?:string[] | string,
        displayFieldAliases?:string[] | string
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
        const url = `${API_URL}${name}?` +
                    `page=${page}&` +
                    `limit=${perPage}` + 
                    orderString +
                    (filter? filterToQuery(filter) : '' ) +
                    (fieldPaths? fieldPathsQuery(fieldPaths) : '') +
                    (displayFieldAliases? displayAliasesToQuery(displayFieldAliases) : '');
        return this.rest.getAuthorized(url);
    }
}
const displayAliasesToQuery = (displayFieldAliases?: string[] | string) => {
    return toQueryParam('displayFieldAliases', displayFieldAliases);
}
const fieldPathsQuery = (fieldPaths?: string[] | string) => {
    return toQueryParam('fieldPaths', fieldPaths);
}
const filterToQuery = (filter?: string[] | string) => {
    return toQueryParam('filter', filter);
}
const toQueryParam = (key:string, params?: string[] | string) => {
    if (!params || params.length == 0) {
        return '';
    }
    if (typeof params === 'string') {
        return `&${key}=${params}`;
    }
    const filters = [];
    for (let i = 0; i < params.length; i++) {
        const element = params[i];
        filters.push(`${key}=${element}`);
    }
    return '&' + filters.join('&');
}
