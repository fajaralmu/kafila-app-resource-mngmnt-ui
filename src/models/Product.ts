import BaseModel from "./BaseModel";

export default class Product extends BaseModel
{
    name:string;
    image:string;
    description:string;
    price:number;
}