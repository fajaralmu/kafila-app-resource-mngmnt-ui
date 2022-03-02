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
import SemesterPeriod from './../../models/SemesterPeriod';

class State extends BaseMasterDataState<SemesterPeriod>
{

}
class SemesterPeriodsPage extends BaseMasterDataPage<SemesterPeriod, BaseProps, State>
{
    
    constructor(props: BaseProps) {
        super(props, "semesterperiods", "Semester Management");
        this.state = new State();
    }
    get defaultItem(): SemesterPeriod { return new SemesterPeriod() }
    getDataTableHeaderVals(): DataTableHeaderValue[] {
        return [
            new DataTableHeaderValue("semester", "Semester"),
            new DataTableHeaderValue("year", "Year"),
            new DataTableHeaderValue("active", "Active"),
        ]
    }
    setActive = (item:SemesterPeriod) => {
        this.patchAction(item, 'activate');
    }
    
    render(): ReactNode {

        if (this.state.showForm && this.state.item) {
            return (
                <ViewTemplate title={this.title} back="/admin">
                    <ActionButton onClick={this.resetFormAndClose} iconClass="fas fa-times" className="btn btn-secondary btn-sm mx-2">
                        Close form
                    </ActionButton>
                    <FormEdit item={this.state.item} handleInputChange={this.handleInputChange} onSubmit={this.formEditSubmit} />
                </ViewTemplate>
            );
        }
        
        const result = this.state.result;
        const items = result?.items;
        return (
            <ViewTemplate title={this.title} back="/admin">
                <ActionButton onClick={this.showInsertForm} iconClass="fas fa-plus" className="btn btn-primary btn-sm mx-2">
                    Insert new data
                </ActionButton>
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
                                            <td>{item.semester}</td>
                                            <td>{item.year}</td>
                                            <td>
                                                {item.active ? <span className="badge badge-primary">Active</span> : null}
                                            </td>
                                            <td>
                                                <ActionButton onClick={() => this.setActive(item)} className="btn btn-sm btn-info">
                                                    Set Active
                                                </ActionButton>
                                                {this.actionButton(item)}
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

export default commonWrapper(SemesterPeriodsPage);

const FormEdit = (props:{
    item:SemesterPeriod, 
    onSubmit:(e:FormEvent) => any, 
    handleInputChange:(e:ChangeEvent)=>any
}) => {
    const item = props.item;
    return (
        <div className="mx-2 py-2">
            <form onSubmit={props.onSubmit}>
                <p>Semester</p>
                <select className="form-control" name="item.semester" id="item.semester" value={item.semester} onChange={props.handleInputChange} required>
                    <option>1</option>
                    <option>2</option>
                </select>
                <p>Year. <i>example: 2020-2021</i></p>
                <input className="form-control" name="item.year" id="item.year" value={item.year} onChange={props.handleInputChange} required/>
                
                <p></p>
                <input className="btn btn-primary" value="Save" type="submit" />
            </form>
        </div>
    )
}
