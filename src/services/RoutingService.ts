import 'reflect-metadata'
import { injectable } from "inversify";
import { NavigateFunction } from "react-router-dom";

@injectable()
export default class RoutingService {
    private lastRedirectedRoute?:string;
    private navigateFunction:NavigateFunction | undefined;

    get redirectedRoute() { return this.lastRedirectedRoute }
    private readonly routeUpdateCallbacks:Map<string, (url:string)=>any> = new Map();

    constructor()
    {

    }

    setLastRedirectedRoute = (origin: string) => {
        this.lastRedirectedRoute = origin;
    }
    
    setNavigate = (navigate: NavigateFunction) => {
        this.navigateFunction = navigate;
    }
    navigate = (url:string) => {
        if (this.navigateFunction)  
            this.navigateFunction(url);
    }

    registerCallback = (origin:string, callback:(url:string)=>any) => {
        this.routeUpdateCallbacks.set(origin, callback);
    }
    deRegisterCallback = (origin:string) => {
        this.routeUpdateCallbacks.delete(origin);
    }
    updateRoute = (url:string) => {
        console.debug("Route changed via call to navigate: " + url);
        this.routeUpdateCallbacks.forEach((callback)=>{
            callback(url);
        })
    }
}