
interface Props 
{
    show?:boolean;
    iconClass?:string;
    children?:any;
    className?:string;
    onClick?:(e:any)=>any;
    disabled?:boolean;
}
const ActionButton = (props:Props) => {
    if (props.show != undefined && props.show === false)
    {
        return null;
    }
    const disabledProps:any = props.disabled === true ? {disabled:'disabled'} : {};
    return (
        <button className={props.className} onClick={props.onClick} {...disabledProps}>
            {props.iconClass?
            <i className={props.iconClass+ (props.children? " mr-3" : "")}/> : null }
            {props.children}
        </button>
    )
}

export default ActionButton;