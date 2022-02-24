 

export default interface DialogProps 
{
    onResolve?:(result:boolean) => any;
    onReject?:(result:any) => any;
}