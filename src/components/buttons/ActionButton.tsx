import { Component, ReactNode } from "react";

interface Props 
{
    show?:boolean;
    iconClass?:string;
    children?:any;
    className?:string;
    onClick?:(e:any)=>any;
    disabled?:boolean;
}
export default class ActionButton extends Component<Props, any>
{
    render(): ReactNode {
        if (this.props.show != undefined && this.props.show === false)
        {
            return null;
        }
        const disabledProps:any = this.props.disabled === true ? {disabled:'disabled'} : {};
        return (
            <button className={this.props.className} onClick={this.props.onClick} {...disabledProps}>
                {this.props.iconClass?
                <i className={this.props.iconClass+ (this.props.children? " mr-3" : "")}/> : null }
                {this.props.children}
            </button>
        )
    }
}