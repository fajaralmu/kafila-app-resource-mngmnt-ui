import { ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import { commonWrapper } from "../../utils/commonWrapper";
import BaseProps from './../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from './../../models/BaseMasterDataState';
import User from "../../models/User";
import PaginationButtons from "../../components/buttons/PaginationButtons";
import ActionButton from "../../components/buttons/ActionButton";

class State extends BaseMasterDataState<User>
{

}
class UsersPage extends BaseMasterDataPage<User, BaseProps, State>
{
    state: Readonly<State> = new State();
    constructor(props: BaseProps) {
        super(props, "users", "User Management")
    }
    get defaultItem(): User { return new User() }
    
    render(): ReactNode {
        
        const result = this.state.result;
        const items = result?.items;
        return (
            <ViewTemplate title={this.title} back="/admin">
                {result == undefined || items == undefined ?
                    <i>Loading...</i> :
                    <div className="mt-5 pl-3 pr-3" style={{overflow: 'auto'}}>
                        <PaginationButtons 
                            limit={result.limit} 
                            totalData={result.totalData} 
                            activePage={result.page} 
                            onClick={this.load} />
                        <table className="commonDataTable table table-striped">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Email</th>
                                    <th>Acct Name</th>
                                    <th>Full Name</th>
                                    <th>Display Name</th>
                                    <th>Date of Birth</th>
                                    <th>Place of Birth</th>
                                    <th>Gender</th>
                                    <th>Role</th>
                                    <th>Phone</th>

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
                                            <td>{new Date(item.birthDate).toLocaleString()}</td>
                                            <td>{item.birthPlace}</td>
                                            <td>{item.gender}</td>
                                            <td>
                                                <ol>
                                                    {item.authorities.map(a => <li>{a.name}</li>)}
                                                </ol></td>
                                            <td>{item.phoneNumber}</td>
                                            
                                            <td>
                                                <ActionButton iconClass="fas fa-redo" className="btn btn-warning btn-sm">
                                                    password
                                                </ActionButton>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>}
            </ViewTemplate>
        )
    }
}

export default commonWrapper(UsersPage)