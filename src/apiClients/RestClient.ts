import axios, { AxiosError, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { commonAuthorizedHeader, setLoginKeyCookie } from "../utils/restApiUtil";

const SUCCESS_CODE = "00";

@injectable()
export default class RestClient
{
    postAuthorized = <T>(url:string, body:any, contentType='application/json') : Promise<T> => {
        return this.postCommon(url, body, commonAuthorizedHeader(contentType), true);
    }
    deleteAuthorized = <T>(url:string, contentType='application/json') : Promise<T> => {
        return this.deleteCommon(url, commonAuthorizedHeader(contentType), true);
    }
    putAuthorized = <T>(url:string, body:any, contentType='application/json') : Promise<T> => {
        return this.putCommon(url, body, commonAuthorizedHeader(contentType), true);
    }
    patchAuthorized = <T>(url:string, body:any, contentType='application/json') : Promise<T> => {
        return this.patchCommon(url, body, commonAuthorizedHeader(contentType), true);
    }
    postCommon = <T>(url:string, body:any, headers:any, expectRefreshToken = false) : Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            
           
            axios.post(url, body, {
                headers: { ...headers }
            }).then((response: AxiosResponse) => {
                if (!response.data)
                {
                    reject(new Error("Invalid response data"));
                    return;
                }
                if (response.data.code != SUCCESS_CODE) {
                    reject(response.data);
                    return;
                }
                if (expectRefreshToken)
                {
                    this.updateLoginKeyCookie(response);
                }
                resolve(response.data.result);
            }).catch((err:AxiosError) =>{
                reject(err.response?.data ?? new Error(err.message))
            });
        });
    }

    updateLoginKeyCookie = (response:AxiosResponse) => {
        if (response.headers["access-token"] && response.headers["access-token"] != "")
        {
            setLoginKeyCookie(response.headers['access-token']);
        }
    }
    putCommon = <T>(url:string, body:any, headers:any, expectRefreshToken = false) : Promise<T> => {
        return new Promise<T>((resolve, reject) => {
           
            axios.put(url, body, {
                headers: { ...headers }
            }).then((response: AxiosResponse) => {
                if (!response.data)
                {
                    reject(new Error("Invalid response data"));
                    return;
                }
                if (response.data.code != SUCCESS_CODE) {
                    reject(response.data);
                    return;
                }
                if (expectRefreshToken)
                {
                    this.updateLoginKeyCookie(response);
                }
                resolve(response.data.result);
            }).catch((err:AxiosError) =>{
                reject(err.response?.data ?? new Error(err.message))
            });
        });
    }
    patchCommon = <T>(url:string, body:any, headers:any, expectRefreshToken = false) : Promise<T> => {
        return new Promise<T>((resolve, reject) => {
           
            axios.patch(url, body, {
                headers: { ...headers }
            }).then((response: AxiosResponse) => {
                if (!response.data)
                {
                    reject(new Error("Invalid response data"));
                    return;
                }
                if (response.data.code != SUCCESS_CODE) {
                    reject(response.data);
                    return;
                }
                if (expectRefreshToken)
                {
                    this.updateLoginKeyCookie(response);
                }
                resolve(response.data.result);
            }).catch((err:AxiosError) =>{
                reject(err.response?.data ?? new Error(err.message))
            });
        });
    }
    private deleteCommon = <T>(url:string, headers:any, expectRefreshToken = false) : Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            
           
            axios.delete(url,{
                headers: { ...headers }
            }).then((response: AxiosResponse) => {
                if (!response.data)
                {
                    reject(new Error("Invalid response data"));
                    return;
                }
                if (response.data.code != SUCCESS_CODE) {
                    reject(response.data);
                    return;
                }
                if (expectRefreshToken)
                {
                    this.updateLoginKeyCookie(response);
                }
                resolve(response.data.result);
            }).catch((err:AxiosError) =>{
                reject(err.response?.data ?? new Error(err.message))
            });
        });
    }

    getAuthorized = <T>(url:string) : Promise<T> => {
        return this.getCommon(url, commonAuthorizedHeader(), true);
    }
    getCommon = <T>(url:string, headers:any, expectRefreshToken = false) : Promise<T> => {
        return new Promise<T>((resolve, reject)=>{
            
            axios.get(url, { headers: {
                ...headers
            } })
                .then((response:AxiosResponse)=>{
                    if (!response.data) {
                        reject(new Error("Invalid response data"));
                        return;
                    }
                    if (response.data.code != SUCCESS_CODE) {
                        reject(response.data);
                        return;
                    }
                    if (expectRefreshToken)
                    {
                        this.updateLoginKeyCookie(response);
                    }
                    resolve(response.data.result);
                })
                .catch((err:AxiosError)=>{
                    reject(err.response?.data ?? new Error(err.message))
                });
        })
    }
}