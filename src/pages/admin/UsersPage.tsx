import { ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import { commonWrapper } from "../../utils/commonWrapper";
import BaseProps from './../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from './../../models/BaseMasterDataState';
import User from "../../models/User";
import PaginationButtons from "../../components/buttons/PaginationButtons";

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
            <ViewTemplate title={this.title}>
                {result == undefined || items == undefined ?
                    <i>Loading...</i> :
                    <div className="mt-5 pl-3 pr-3">
                        <PaginationButtons 
                            limit={result.limit} 
                            totalData={result.totalData} 
                            activePage={result.page} 
                            onClick={this.load} />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Display Name</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => {
                                    return (
                                        <tr key={"user-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.email}</td>
                                            <td>{item.name}</td>
                                            <td>{item.displayName}</td>
                                            <td>{item.phoneNumber}</td>
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