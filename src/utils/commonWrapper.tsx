import React from "react"
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom"
import { container } from "../inversify.config";
import RoutingService from './../services/RoutingService';

export function commonWrapper(Component: any) {
    
    return (props: any) => {
        const routeParams: Params<string>   = useParams();
        const doNavigate: NavigateFunction  = useNavigate();
        const navigate: (url:string)=> void = (url:string) : void => {
            
            let routingService:RoutingService = container.get(RoutingService);
            doNavigate(url);
            routingService.updateRoute(url);
        };
        return <Component navigate={navigate} routeParams={routeParams} {...props} />
    }
}