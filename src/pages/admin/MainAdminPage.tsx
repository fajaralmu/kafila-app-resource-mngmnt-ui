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
                <div className="row">
                    {managementPages.map(m=>
                        <div key={"mngmnt-menu-"+m.url} className="col-md-3 mb-2">
                            <AnchorButton className="btn btn-light px-5 py-5 w-100" to={m.url} iconClass={m.iconClass} >
                                {m.label}
                            </AnchorButton>
                        </div>
                    )}
                </div>
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
        label:'Semesters',
        iconClass:'fas fa-calendar-alt'
    },
    {
        url:'/admin/classlevels',
        label:'Classes',
        iconClass:'fas fa-chalkboard-teacher'
    },
    {
        url:'/admin/students',
        label:'Students',
        iconClass:'fas fa-user-graduate'
    },
    {
        url:'/admin/classmembers',
        label:'Class Members',
        iconClass:'fas fa-user-friends'
    }
]

export default commonWrapper(MainAdminPage);