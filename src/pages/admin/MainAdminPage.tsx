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
         
    }
    render(): ReactNode {
        
        return (
            <ViewTemplate title="Admin Area">
                {managementPages.map(m=>
                <AnchorButton className="btn btn-light mr-3" to={m.url} iconClass={m.iconClass} >
                    {m.label}
                </AnchorButton>)}
            </ViewTemplate>
        )
    }
}

const managementPages = [
    {
        url:'/admin/users',
        label:'Users',
        iconClass:'fas fa-user-circle'
    },
    {
        url:'/admin/schools',
        label:'Schools',
        iconClass:'fas fa-school'
    },
    {
        url:'/admin/employees',
        label:'Employees',
        iconClass:'fas fa-users'
    },
    {
        url:'/admin/semesterperiods',
        label:'Semester',
        iconClass:'fas fa-calendar-alt'
    },
    {
        url:'/admin/classlevels',
        label:'Class Level',
        iconClass:'fas fa-chalkboard-teacher'
    }
]

export default commonWrapper(MainAdminPage);