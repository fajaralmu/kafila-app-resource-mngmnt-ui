import React, { Component } from "react";

class Props
{
    children:any;
    title?:string;
    attributes?:any;
    titleAlign?:undefined |'center' | 'left' | 'right';
}
export class ViewTemplate extends Component<Props, any>
{
    render(): React.ReactNode {
        
        return (
            <div  {...this.props.attributes} className="container-fluid baseView" >
                {this.props.title && this.props.title.trim() != "" ? 
                    <h2 style={{textAlign: this.props.titleAlign}}>{this.props.title}</h2> : null}
                {this.props.children}
            </div>
        )
    }
}