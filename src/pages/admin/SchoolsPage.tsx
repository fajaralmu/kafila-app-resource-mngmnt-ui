import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import { commonWrapper } from "../../utils/commonWrapper";
import BaseProps from '../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from '../../models/BaseMasterDataState';
import School from "../../models/School";
import PaginationButtons from "../../components/buttons/PaginationButtons";
import ActionButton from "../../components/buttons/ActionButton";
import { DataTableHeaderValue } from "../../utils/componentUtil";

class State extends BaseMasterDataState<School>
{

}
class SchoolsPage extends BaseMasterDataPage<School, BaseProps, State>
{
    
    constructor(props: BaseProps) {
        super(props, "schools", "School Management");
        this.state = new State();
    }
    get defaultItem(): School { return new School() }
    getDataTableHeaderVals(): DataTableHeaderValue[] {
        return [
            new DataTableHeaderValue("nis", "NIS"),
            new DataTableHeaderValue("name", "Name"),
            new DataTableHeaderValue("level", "Level"),
            new DataTableHeaderValue("code", "Code"),
            new DataTableHeaderValue("address", "Address"),
        ]
    }
    
    render(): ReactNode {

        if (this.state.showForm && this.state.item)  {
            return (
                <ViewTemplate title={this.title} back="/admin">
                    {this.closeFormButton}
                    <FormEdit item={this.state.item} handleInputChange={this.handleInputChange} onSubmit={this.formEditSubmit} />
                </ViewTemplate>
            );
        }
        
        const result = this.state.result;
        const items = result?.items;
        return (
            <ViewTemplate title={this.title} back="/admin">
                {result == undefined || items == undefined ?
                    <i>Loading...</i> :
                    <div className="mt-5 pl-3 pr-3" style={{overflow: 'auto'}}>
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
                                        <tr key={"School-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.nis}</td>
                                            <td>{item.name}</td>
                                            <td>{item.level}</td>
                                            <td>{item.code}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                {this.actionButton(item, false)}
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

export default commonWrapper(SchoolsPage);

const FormEdit = (props:{
    item:School, 
    onSubmit:(e:FormEvent) => any, 
    handleInputChange:(e:ChangeEvent)=>any
}) => {
    const item = props.item;
    return (
        <div className="mx-2 py-2">
            <form onSubmit={props.onSubmit}>
                <p>Nis</p>
                <input className="form-control" name="item.nis" id="item.nis" value={item.nis} onChange={props.handleInputChange} />
                <p>Name</p>
                <input className="form-control" name="item.name" id="item.name" value={item.name} onChange={props.handleInputChange} />
                <p>Code</p>
                <input disabled className="form-control" name="item.code" id="item.code" value={item.code} onChange={props.handleInputChange} />
                <p>Address</p>
                <textarea className="form-control" name="item.code" id="item.address" value={item.address} onChange={props.handleInputChange} />
                <p>Level</p>
                <select className="form-control" name="item.level" id="item.level" value={item.level} onChange={props.handleInputChange}>
                    <option>MA</option>
                    <option>MTS</option>
                </select>

                <p></p>
                <input className="btn btn-primary" value="Save" type="submit" />
            </form>
        </div>
    )
}
