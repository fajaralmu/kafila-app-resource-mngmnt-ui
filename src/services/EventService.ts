import { injectable } from "inversify";

@injectable()
export default class EventService
{
    // private _onProductSearchKeyUpdate:Map<string, (key:string) => any> = new Map();

    // triggerProductSearchUpdate = (key:string) => {
    //     this._onProductSearchKeyUpdate.forEach(action => action(key));
    // }

    // addOnProductSearchUpdate = (key:string, action:(key:string)=>any) => {
    //     this._onProductSearchKeyUpdate.set(key, action);
    // }
    // removeOnProductSearchUpdate = (key:string) => {
    //     this._onProductSearchKeyUpdate.delete(key);
    // }
}