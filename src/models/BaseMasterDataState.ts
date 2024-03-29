import BaseState from './BaseState';
import MasterDataResult from './MasterDataResult';

export default class BaseMasterDataState<T> extends BaseState {
    result:MasterDataResult<T> = new MasterDataResult<T>();
    item:T | undefined;
    showForm:boolean = false;
    filter: any = {};
}