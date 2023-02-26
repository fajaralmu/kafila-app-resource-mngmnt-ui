import BaseState from './BaseState';
import MasterDataResult from './MasterDataResult';

export default class BaseMasterDataStateV2<Req, Res> extends BaseState {
    result: MasterDataResult<Res> = new MasterDataResult<Res>();
    item: Req | undefined;
    showForm: boolean = false;
    filter: any = {};
}