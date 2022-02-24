import React, { Component } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import BaseProps from "../../models/BaseProps";
import { BasePage } from "../BasePage";

class Props extends BaseProps {
    
    message:string
}
export class ErrorView extends BasePage<Props, any>
{
    constructor(props:Props)
    {
        super(props, false, "Error");
    }
    render(): React.ReactNode {
        return (
            <ViewTemplate title="Oops !">
                <div className="alert alert-danger mt-3">
                    <p>{this.props.message}</p>
                </div>    
            </ViewTemplate>
        )
    }
}