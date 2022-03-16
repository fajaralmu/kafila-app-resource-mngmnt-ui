import { Link } from 'react-router-dom';

interface Props 
{
    show?:boolean;
    iconClass?:string;
    children?:any;
    className?:string;
    onClick?:(e:any)=>any;
    to?:string;
}
const AnchorButton = (props:Props) => {
    if (props.show !== undefined && props.show === false)
    {
        return null;
    }
    if (!props.to)
    {
        return (
            <a className={props.className} onClick={props.onClick}>
                {props.iconClass?
                <i className={props.iconClass+ (props.children? " me-3" : "")}/> : null }
                {props.children}
            </a>
        )
    }
    return (
        <Link to={props.to} className={props.className} onClick={props.onClick}>
            {props.iconClass?
            <i className={props.iconClass+ (props.children? " me-3" : "")}/> : null }
            {props.children}
        </Link>
    )

}

export default AnchorButton;