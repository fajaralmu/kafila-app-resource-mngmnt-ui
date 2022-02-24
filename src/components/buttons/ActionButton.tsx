import { Component, ReactNode } from "react";

interface Props 
{
    show?:boolean;
    iconClass?:string;
    children?:any;
    className?:string;
    onClick?:(e:any)=>any;
}
export default class ActionButton extends Component<Props, any>
{
    render(): ReactNode {
        if (this.props.show != undefined && this.props.show === false)
        {
            return null;
        }
        return (
            <button className={this.props.className} onClick={this.props.onClick}>
                {this.props.iconClass?
                <i className={this.props.iconClass+ " mr-3"}/> : null }
                {this.props.children}
            </button>
        )
    }
}