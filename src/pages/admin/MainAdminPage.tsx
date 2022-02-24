import { ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import BaseState from "../../models/BaseState";
import { commonWrapper } from "../../utils/commonWrapper";
import { BasePage } from "../BasePage";
import BaseProps from './../../models/BaseProps';
import AnchorButton from './../../components/buttons/AnchorButton';

class State extends BaseState
{

}
class MainAdminPage extends BasePage<BaseProps, State>
{
    state: Readonly<State> = new State();
    constructor(props:BaseProps)
    {
        super(props, true, "Admin Area");
    }
    componentDidMount(): void {
        this.forceUpdate();
    }
    componentDidUpdate(): void {
        if (!this.authService.loggedIn || this.authService.isAdmin)
        {
            this.gotoHomePage();
            console.log("not admin!");
        }
    }
    render(): ReactNode {
        
        return (
            <ViewTemplate title="Admin Area">
                <AnchorButton className="btn btn-light mr-3" to="/admin/users" iconClass="fas fa-users" >
                    User Management
                </AnchorButton>
                <AnchorButton className="btn btn-light mr-3" to="/admin/products" iconClass="fas fa-shopping-cart" >
                    Product Management
                </AnchorButton>
            </ViewTemplate>
        )
    }
}

export default commonWrapper(MainAdminPage);