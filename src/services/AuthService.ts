import { inject, injectable } from "inversify";
import User from "../models/User";
import Settings from './../settings';
import WebResponse from './../models/WebResponse';
import axios, { AxiosError, AxiosResponse } from "axios";
import { removeLoginKeyCookie, setLoginKeyCookie, commonAuthorizedHeader, loginKeyCookieExist } from './../utils/restApiUtil';
import ApplicationProfile from './../models/ApplicationProfile';
import RestClient from './../apiClients/RestClient';


const LOGIN_URL     = Settings.App.hosts.api + "/login";
const LOGOUT_URL    = Settings.App.hosts.api + "/api/user/logout";
const LOAD_USER_URL = Settings.App.hosts.api + "/api/user";
const LOAD_APP_URL  = Settings.App.hosts.api + "/api/public/index";

@injectable()
export default class AuthService {
     
    private _loggedUser:User | undefined;
    private _appProfile:ApplicationProfile | undefined;
    private _onUserUpdate:Map<string, (user:User | undefined) =>any> = new Map();

    @inject(RestClient)
    private rest:RestClient;
 
    get loggedIn() { return this._loggedUser != undefined; }

    get loggedUser() { 
        return this._loggedUser; 
    }
    get isAdmin() { return this.loggedIn && this.loggedUser?.hasAuthorityType('ROLE_SUPERADMIN') }
    get appProfile()
    {
        return this._appProfile;
    }
    
    private set loggedUser(value:User | undefined) { 
        console.log("SET LOGGED USER: ", value);
        this._loggedUser = value; 
        this._onUserUpdate.forEach(action => action(value))
    }

    addOnUserUpdated = (key:string, action:(user:User|undefined) => any) => {
        this._onUserUpdate.set(key, action);
    }
    removeOnUserUpdated = (key:string) => {
        this._onUserUpdate.delete(key);
    }

    loadApplication = () : Promise<ApplicationProfile> => {
        
        return new Promise<ApplicationProfile>((resolve, reject)=>{
            
            this.rest.getCommon<WebResponse<ApplicationProfile>>(LOAD_APP_URL, {})
                .then((response)=>{
                    this.loadUser();
                    this._appProfile = response.result;
                    resolve(response.result);
                })
                .catch(reject);
        })
    }

    loadUser = () => {
        if (loginKeyCookieExist())
        {
            this.rest.getAuthorized<User>(LOAD_USER_URL)
                .then((response:User) => {
                    console.log("RESPONSE LOAD USER", response);
                    this.handleSuccessLogin(response)
                })
                .catch(console.error)
        }
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
    }

    logout = () => {
        this.loggedUser = undefined;
        this.rest.postAuthorized(LOGOUT_URL, {}).then(response => {    
            removeLoginKeyCookie();
        }).catch(console.error);
    }
}