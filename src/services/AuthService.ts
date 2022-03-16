import { inject, injectable } from "inversify";
import User from "../models/User";
import Settings from './../settings';
import WebResponse from './../models/WebResponse';
import axios, { AxiosError, AxiosResponse } from "axios";
import { removeLoginKeyCookie, setLoginKeyCookie, commonAuthorizedHeader, loginKeyCookieExist } from './../utils/restApiUtil';
import ApplicationProfile from './../models/ApplicationProfile';
import RestClient from './../apiClients/RestClient';
import RoutingService from './RoutingService';


const LOGIN_URL     = Settings.App.hosts.api + "/login";
const LOGOUT_URL    = Settings.App.hosts.api + "/api/user/logout";
const LOAD_USER_URL = Settings.App.hosts.api + "/api/user";
const LOAD_APP_URL  = Settings.App.hosts.api + "/api/public/index";
const UPDATE_PROFILE_URL  = Settings.App.hosts.api + "/api/user/update";

@injectable()
export default class AuthService {
     
    private _loggedUser:User | undefined;
    private _appProfile:ApplicationProfile | undefined;
    private _onUserUpdate:Map<string, (user:User | undefined) =>any> = new Map();
    private _onAppProfileUpdate:Map<string, (val:ApplicationProfile | undefined) =>any> = new Map();


    @inject(RestClient)
    private rest:RestClient;
    @inject(RoutingService)
    private routing:RoutingService;
 
    get loggedIn() { return this._loggedUser !== undefined; }

    get loggedUser() { 
        return this._loggedUser; 
    }
    get isAdmin() { 
        let result = this.loggedIn && this.loggedUser?.hasAuthorityType('ROLE_SUPERADMIN') 
        return result;
    }
    get appProfile()
    {
        return this._appProfile;
    }
    
    private set loggedUser(value:User | undefined) { 
        this._loggedUser = value; 
        this._onUserUpdate.forEach(action => action(value))
    }
    private set appProfile(value: ApplicationProfile | undefined) {
        this._appProfile = value;
        this._onAppProfileUpdate.forEach(action => action(value))
    }

    addOnUserUpdated = (key:string, action:(user:User|undefined) => any) => {
        this._onUserUpdate.set(key, action);
    }
    removeOnUserUpdated = (key:string) => {
        this._onUserUpdate.delete(key);
    }
    addOnAppProfileUpdated = (key:string, action:(val:ApplicationProfile|undefined) => any) => {
        this._onAppProfileUpdate.set(key, action);
    }
    removeOnAppProfileUpdated = (key:string) => {
        this._onAppProfileUpdate.delete(key);
    }

    loadApplication = () : Promise<ApplicationProfile> => {
        
        return new Promise<ApplicationProfile>((resolve, reject)=>{
            
            this.rest.getCommon<ApplicationProfile>(LOAD_APP_URL, {})
                .then((response)=>{
                    this.loadUser();
                    this._appProfile = response;
                    resolve(response);
                })
                .catch(reject);
        })
    }

    loadUser = () => {
        if (loginKeyCookieExist())
        {
            this.rest.getAuthorized<User>(LOAD_USER_URL)
                .then((response:User) => {
                    this.handleSuccessLogin(response)
                })
                .catch(console.error)
        }
    }

    updateProfile = (user:User) : Promise<User> => {
        return new Promise<User>((res, rej) => {
            this.rest.putAuthorized<User>(UPDATE_PROFILE_URL, user)
                .then(user => {
                    this.handleSuccessLogin(user);
                    res(user);
                })
                .catch(rej);
        })
             
    }

    login = (username: string, password: string): Promise<User> => {
        
        return new Promise<User>((resolve, reject) => {
            
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("transport_type", "rest");
            let parameters = [
                "username="+username,
                "password="+password,
                "transport_type=rest"
            ]
            axios.post(LOGIN_URL, parameters.join("&"), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response: AxiosResponse) => {

                const responseJson:WebResponse<User>    = response.data;
                const loginKey                          = response.headers['access-token'];
                
                this.handleSuccessLogin(responseJson.result, loginKey);
                resolve(responseJson.result);
            }).catch((err:AxiosError) =>{
                reject(err.response?.data ?? new Error(err.message))
            });
        });
    }

    handleSuccessLogin = (user:User, loginKey?:string) => {
        this.loggedUser = Object.assign(new User, user);
        if (loginKey)
        {
            setLoginKeyCookie(loginKey);
        }
        if (this.routing.redirectedRoute)
        {
            this.routing.navigate(this.routing.redirectedRoute);
        }
    }

    logout = () => {
        this.loggedUser = undefined;
        this.rest.postAuthorized(LOGOUT_URL, {}).then(response => {    
            removeLoginKeyCookie();
        }).catch(console.error);
    }
}