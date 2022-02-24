export default class SubscriptionRequest
{
    constructor(origin:string, topic:string, action:(arg:any)=>any)
    {
        this.origin = origin;
        this.topic = topic;
        this.action = action;
    }
    origin:string;
    topic:string;
    action:(arg:any) => any;
}