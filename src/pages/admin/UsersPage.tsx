import { ReactNode } from "react";
import ActionButton from "../../components/buttons/ActionButton";
import { ViewTemplate } from "../../layout/ViewTemplate";
import DataTableHeaderValue from "../../models/DataTableHeaderValue";
import User from "../../models/User";
import { commonWrapper } from "../../utils/commonWrapper";
import BaseMasterDataState from './../../models/BaseMasterDataState';
import BaseProps from './../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";


const ACTION_RESET_PASSWORD = 'resetPassword';

class State extends BaseMasterDataState<User>
{

}
class UsersPage extends BaseMasterDataPage<User, BaseProps, State>
{
    constructor(props: BaseProps) {
        super(props, "users", "User Management");
        this.state = new State();
    }
    get defaultItem(): User { return new User() }
    getDataTableHeaderVals = () => {
        return [
            new DataTableHeaderValue("email", "Email"),
            new DataTableHeaderValue("username", "Acct Name"),
            new DataTableHeaderValue("fullName", "Full Name"),
            new DataTableHeaderValue("displayName", "Display Name"),
            new DataTableHeaderValue("birthDate", "Date of Birth"),
            new DataTableHeaderValue("birthPlace", "Place of Birth"),
            new DataTableHeaderValue("gender", "Gender"),
            new DataTableHeaderValue("role", "Role", false),
            new DataTableHeaderValue("phoneNumber", "Phone"),
        ];
    }
    resetPassword = (item:User) => {
        this.patchAction(item, ACTION_RESET_PASSWORD);
    }
    render(): ReactNode {
        
        const result = this.state.result;
        const items = result?.items;
        return (
            <ViewTemplate title={this.title} back="/admin">
                {result === undefined || items === undefined ?
                    <i>Loading...</i> :
                    <form onSubmit={this.loadFromForm} className="mt-5 pl-3 pr-3" style={{overflow: 'auto'}}>
                        {this.paginationButton}
                        <table className="commonDataTable table table-striped">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    {this.getDataTableHeaderComponent()}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => {
                                    return (
                                        <tr key={"user-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.email}</td>
                                            <td>{item.username}</td>
                                            <td>{item.fullName}</td>
                                            <td>{item.displayName}</td>
                                            <td>{new Date(item.birthDate).toLocaleDateString()}</td>
                                            <td>{item.birthPlace}</td>
                                            <td>{item.gender}</td>
                                            <td>
                                                {item.authorities.map(a => <div className="badge bg-success  me-1">{a.name?.toLocaleLowerCase()}</div>)}
                                            </td>
                                            <td>{item.phoneNumber}</td>
                                            
                                            <td>
                                                <div 
                                                    className="d-flex" 
                                                    style={{flexWrap: 'nowrap', width: '150px'}}>
                                                    <ActionButton 
                                                        iconClass="fas fa-lock-open" 
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => this.resetPassword(item)}
                                                    >
                                                    </ActionButton>
                                                    {this.actionButton(item)}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            {this.tableFooter}
                        </table>
                    </form>}
            </ViewTemplate>
        )
    }
}

export default commonWrapper(UsersPage)