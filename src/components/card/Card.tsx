import React, { Component } from "react";
interface Props {
    children: any,
    title: string,
    headerClassNames?: string,
    bodyClassNames?: string,
    attributes?:any
}
export class Card extends Component<Props, any>
{
    render(): React.ReactNode {
        return (
            <div {...this.props.attributes} className="card">
                <div className={"card-header " + this.props.headerClassNames}>
                    {this.props.title}
                </div>
                <div className={"card-body " + this.props.bodyClassNames}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}