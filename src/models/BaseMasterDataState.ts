import BaseModel from "./BaseModel";
import BaseState from "./BaseState";
import MasterDataResult from './MasterDataResult';

export default class BaseMasterDataState<T extends BaseModel> extends BaseState
{
    result:MasterDataResult<T> = new MasterDataResult<T>();
    item:T | undefined;
    showForm:boolean = false;
}