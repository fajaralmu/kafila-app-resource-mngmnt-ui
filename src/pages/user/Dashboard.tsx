import { ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import BaseProps from "../../models/BaseProps";
import BaseState from "../../models/BaseState";
import { commonWrapper } from "../../utils/commonWrapper";
import { BasePage } from "../BasePage";

class Dashboard extends BasePage<BaseProps, BaseState> {
    constructor(props:any)
    {
        super(props, true, "Dashboard");
    }
    render(): ReactNode {
        
        return (
            <ViewTemplate title="Dashboard">
                <div className="alert alert-success">Hello, {this.authService.loggedUser?.displayName}</div>
            </ViewTemplate>
        );
    }
}

export default commonWrapper(Dashboard);