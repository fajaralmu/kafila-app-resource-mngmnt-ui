import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import { commonWrapper } from "../../utils/commonWrapper";
import BaseProps from '../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from '../../models/BaseMasterDataState';
import ActionButton from "../../components/buttons/ActionButton";
import { DataTableHeaderValue } from "../../utils/componentUtil";
import SemesterPeriod from './../../models/SemesterPeriod';
import Employee from './../../models/Employee';
import MasterDataService from './../../services/MasterDataService';
import { resolve } from "inversify-react";
import ControlledComponent from "../ControlledComponent";
import DialogService from './../../services/DialogService';
import { randomString } from './../../utils/stringUtil';

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
        const employeeFields = SemesterPeriod.EmployeeFields.map(field => {
            return new DataTableHeaderValue(`${field}.user.fullName`, field);
        })
        return [
            new DataTableHeaderValue("semester", "Semester"),
            new DataTableHeaderValue("year", "Year"),
            new DataTableHeaderValue("active", "Active"),
            ...employeeFields
        ]
    }
    setActive = (item:SemesterPeriod) => {
        this.patchAction(item, 'activate');
    }
    setEmployeeInCharge = (item:SemesterPeriod, field:string) => {
        this.dialog.showContent("Set " + field, <SetEmployeeForm field={field} item={item} update={this.update} />);
    }
    employeeCellFields = (item:any) => SemesterPeriod.EmployeeFields.map(field => {
        return (
            <td key={"emp-field-" + randomString(10)}>
                <ActionButton 
                    iconClass="fas fa-user-edit" 
                    className="btn btn-sm btn-text text-dark cickable" 
                    onClick={() => this.setEmployeeInCharge(item, field)} />
                
                <div className="no-wrap">{item[field]?.user.fullName.trim()}</div>
            </td>
        )
    })
    
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
                                    <th>Action</th>
                                    {this.getDataTableHeaderComponent()}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => {
                                    return (
                                        <tr key={"smt-period-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>
                                                <ActionButton disabled={item.active === true} onClick={() => this.setActive(item)} className="no-wrap btn btn-sm btn-info">
                                                    Set Active
                                                </ActionButton>
                                                {this.actionButton(item)}
                                            </td>
                                            <td>{item.semester}</td>
                                            <td>{item.year}</td>
                                            <td>
                                                {item.active ? <span className="badge badge-primary">Active</span> : null}
                                            </td>
                                            {this.employeeCellFields(item)}
                                            
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
type SetEmployeeFormProps = { item: SemesterPeriod, field:string, update:(item:SemesterPeriod) => any };
type SetEmployeeFormState = { searchEmployee:string, employees: Employee[], selectedEmployee: Employee | undefined };

class SetEmployeeForm extends ControlledComponent<SetEmployeeFormProps, SetEmployeeFormState> {
    
    @resolve(MasterDataService)
    private service:MasterDataService;

    constructor(props:SetEmployeeFormProps) {
        super(props);
        this.state = {
            searchEmployee: '',
            employees: [],
            selectedEmployee: undefined,
        }
    }

    search = (e:FormEvent) => {
        e.preventDefault();
        this.service.list<Employee>('employees', 0, 10, 'user.fullName', false, 'user.fullName:' + this.state.searchEmployee)
            .then((result) => {
                this.setState({ employees: result.items });
            })
            .catch(console.error);
    }
    closeDropdown = () => {
        this.setState({ employees: [] });
    }
    setSelectedEmployee = (e:Employee) => {
        this.setState({ selectedEmployee: e, searchEmployee: e.user.fullName }, this.closeDropdown);
    }
    submit = () => {
        if (!this.state.selectedEmployee) {
            alert("Invalid employee");
            return;
        }
        const item:any = this.props.item;
        item[this.props.field] = this.state.selectedEmployee;
        this.props.update(item);
    }

    render(): ReactNode {
        const {employees} = this.state;
        return (
            <div>
                <p>Select Employee</p>
                <form onSubmit={this.search} className="my-5 mx-5 pb-5">
                    <div className="input-group">
                        <input 
                            type="search"
                            className="form-control" 
                            name="searchEmployee" 
                            value={this.state.searchEmployee}
                            placeholder="Full Name"
                            onChange={this.handleInputChange} 
                            required />
                        <div className="input-group-append">
                            <input type="submit" className="btn btn-primary" value={"Search"}/>
                        </div>
                    </div>
                        
                    <div style={{position: 'absolute',width:'75%'}}>
                        { employees.length > 0 ?

                        <div className="bg-light border border-dark px-2 py-1 w-100" style={{position: 'relative'}}>
                            <ActionButton className="btn btn-text btn-sm" iconClass="fas fa-times" onClick={this.closeDropdown}>close</ActionButton>
                            <div style={{overflowY:'auto', height: '100px'}}>
                                <div className="no-wrap" style={{ width: 'max-content' }}>
                                    {employees.map(e => {
                                        return (
                                            <div key={"set-emp-"+e.id}>
                                                <a className="btn btn-text clickable" onClick={()=>this.setSelectedEmployee(e)}>
                                                    {e.user.fullName.trim()}, nisdm: {e.nisdm}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div> : null }
                    </div>
                    <button type="button" className="btn btn-success mt-3" onClick={this.submit}>
                        Save Changes
                    </button>
                </form>
            </div>
        )
    }
}
