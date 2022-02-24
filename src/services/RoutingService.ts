import { injectable } from "inversify";

@injectable()
export default class RoutingService
{
    private readonly routeUpdateCallbacks:Map<string, (url:string)=>any> = new Map();

    constructor()
    {

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