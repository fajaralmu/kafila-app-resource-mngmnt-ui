
import { resolve } from "inversify-react";
import React, { Component } from "react";
import ActionButton from "../components/buttons/ActionButton";
import RoutingService from './../services/RoutingService';

class Props
{
    children:any;
    title?:string;
    attributes?:any;
    titleAlign?:undefined |'center' | 'left' | 'right';
    back?:string;
}
export class ViewTemplate extends Component<Props, any>
{
    @resolve(RoutingService)
    private routing:RoutingService;
    goBack = () => {
        if (this.props.back)
        {
            this.routing.navigate(this.props.back);
        }
    }
    render(): React.ReactNode {
        
        return (
            <div  {...this.props.attributes} className="container-fluid baseView" >
                {this.props.title && this.props.title.trim() !== "" ? 
                    <h2 style={{textAlign: this.props.titleAlign}}>{this.props.title}</h2> : null}
                {this.props.back?
                <ActionButton onClick={this.goBack} className="btn btn-dark btn-sm my-2" iconClass="fas fa-arrow-left">
                    Back
                </ActionButton> : null}
                {this.props.children}
            </div>
        )
    }
}