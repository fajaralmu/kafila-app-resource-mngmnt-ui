
import BaseModel from './BaseModel';
export default class MasterDataResult<T extends BaseModel>
{
    totalData: number = 0;
    page: number = 0;
    limit: number = 10;
    items: T[] = [];
    order?: string;
    orderDesc?: boolean;
}