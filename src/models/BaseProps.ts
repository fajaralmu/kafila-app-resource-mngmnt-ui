 
import { NavigateFunction, Params } from "react-router-dom";

export default class BaseProps
{
    navigate?:NavigateFunction;
    routeParams?: Params<string>; 
}