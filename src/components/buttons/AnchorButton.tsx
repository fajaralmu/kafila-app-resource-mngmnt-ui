import { Component, ReactNode } from "react";
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
export default class AnchorButton extends Component<Props, any>
{
    render(): ReactNode {
        if (this.props.show != undefined && this.props.show === false)
        {
            return null;
        }
        if (!this.props.to)
        {
            return (
                <a className={this.props.className} onClick={this.props.onClick}>
                    {this.props.iconClass?
                    <i className={this.props.iconClass+ " mr-3"}/> : null }
                    {this.props.children}
                </a>
            )
        }
        return (
            <Link to={this.props.to} className={this.props.className} onClick={this.props.onClick}>
                {this.props.iconClass?
                <i className={this.props.iconClass+ " mr-3"}/> : null }
                {this.props.children}
            </Link>
        )
    }
}