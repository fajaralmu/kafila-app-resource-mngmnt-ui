import { inject, injectable } from 'inversify';
import ModelNames from '../constants/ModelNames';
import BaseModel from '../models/BaseModel';
import MasterDataResult from '../models/MasterDataResult';
import RestClient from '../apiClients/RestClient';
import Settings from '../settings';

const API_URL = Settings.App.hosts.api + '/api/admin/management/';
const version = 'v2';

@injectable()
export default class MasterDataServiceV2 {
  @inject(RestClient)
  private rest: RestClient;

  get = <Res>(name: ModelNames, id: number) => {
    const url = `${API_URL}${name}/${version}/${id}`;
    return this.rest.getAuthorized<Res>(url);
  }
  post = <Req, Res>(name: ModelNames, model: Req) => {
    delete (model as any)['id'];
    const url = `${API_URL}${name}/${version}`;
    return this.rest.postAuthorized<Res>(url, model);
  }
  put = <Req, Res>(name: ModelNames, id: number, model: Req) => {
    const url = `${API_URL}${name}/${version}/${id}`;
    return this.rest.putAuthorized<Res>(url, model);
  }
  delete = <Res>(name: ModelNames, id: number) => {

    const url = `${API_URL}${name}/${version}/${id}`;
    return this.rest.deleteAuthorized<Res>(url);
  }
  list = <Res>(
    name: ModelNames,
    page: number,
    perPage: number,
    order: string | undefined = 'id',
    orderDesc?: boolean,
    filter?: string[] | string,
    fieldPaths?: string[] | string,
    displayFieldAliases?: string[] | string
  ) => {
    let orderString = '';
    if (order) {
      orderString = '&order=' + order;
      if (orderDesc === true) {
        orderString += '&orderDesc=true'
      }
    }
    const url = `${API_URL}${name}/${version}?` +
      `page=${page}&` +
      `limit=${perPage}` +
      orderString +
      (filter ? filterToQuery(filter) : '') +
      (fieldPaths ? fieldPathsQuery(fieldPaths) : '') +
      (displayFieldAliases ? displayAliasesToQuery(displayFieldAliases) : '');
    return this.rest.getAuthorized<MasterDataResult<Res>>(url);
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
const toQueryParam = (key: string, params?: string[] | string) => {
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
