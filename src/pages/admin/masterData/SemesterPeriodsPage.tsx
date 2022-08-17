import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import { commonWrapper } from "../../../utils/commonWrapper";
import BaseProps from '../../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import ActionButton from "../../../components/buttons/ActionButton";
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import SemesterPeriod from '../../../models/SemesterPeriod';
import Employee from '../../../models/Employee';
import MasterDataService from '../../../services/MasterDataService';
import { resolve } from "inversify-react";
import ControlledComponent from "../../ControlledComponent";
import { randomString } from '../../../utils/stringUtil';
import ToastService from '../../../services/ToastService';
import SelectEmployeeForm from "./SelectEmployeeForm";

class State extends BaseMasterDataState<SemesterPeriod> {

}
class SemesterPeriodsPage extends BaseMasterDataPage<SemesterPeriod, BaseProps, State> {

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
  setActive = (item: SemesterPeriod) => {
    this.patchAction(item, 'activate');
  }
  setEmployeeInCharge = (item: SemesterPeriod, field: string) => {
    this.dialog.showContent("Set " + field, <SetEmployeeForm field={field} item={item} update={this.update} />);
  }
  employeeCellFields = (item: any) => SemesterPeriod.EmployeeFields.map(field => {
    return (
      <td key={"emp-field-" + randomString(10)}>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <div className="col-3">
            <ActionButton
              iconClass="fas fa-user-edit"
              className="btn btn-sm btn-success me-3"
              onClick={() => this.setEmployeeInCharge(item, field)} />
          </div>
          <div className="col-8 no-wrap">{item[field]?.user.fullName.trim()}</div>
        </div>
      </td>
    )
  })

  render(): ReactNode {

    if (this.state.showForm && this.state.item) {
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
        {this.showFormButton}
        {result === undefined || items === undefined ?
          <i>Loading...</i> :
          <form onSubmit={this.loadFromForm} className="mt-5 pl-3 pr-3" style={{ overflow: 'auto' }}>
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
                        <div className="mx-2" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                          <ActionButton
                            onClick={() => this.setActive(item)}
                            iconClass="fas fa-calendar-check"
                            className="btn-text btn btn-sm text-primary me-1"
                            disabled={item.active === true} />
                          {this.actionButton(item)}
                        </div>
                      </td>
                      <td className="text-center">{item.semester}</td>
                      <td>{item.year}</td>
                      <td>
                        {item.active ? <b className="text-success">active</b> : <i>not active</i>}
                      </td>
                      {this.employeeCellFields(item)}
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


export default commonWrapper(SemesterPeriodsPage);

const FormEdit = (props: {
  item: SemesterPeriod,
  onSubmit: (e: FormEvent) => any,
  handleInputChange: (e: ChangeEvent) => any
}) => {
  const item = props.item;
  return (
    <div className="formEditContainer">
      <form className="masterDataForm px-3 py-3 border rounded border-gray" onSubmit={props.onSubmit}>
        <p>Semester</p>
        <select className="form-control" name="item.semester" id="item.semester" value={item.semester} onChange={props.handleInputChange} required>
          <option>1</option>
          <option>2</option>
        </select>
        <p>Year. <i>example: 2020-2021</i></p>
        <input className="form-control" name="item.year" id="item.year" value={item.year} onChange={props.handleInputChange} required />

        <p></p>
        <input className="btn btn-primary" value="Save" type="submit" />
      </form>
    </div>
  )
}
type SetEmployeeFormProps = { item: SemesterPeriod, field: string, update(item: SemesterPeriod): any };

class SetEmployeeForm extends ControlledComponent<SetEmployeeFormProps, any> {

  onSelect = (employee: Employee) => {
    const item: any = this.props.item;
    item[this.props.field] = employee;
    this.props.update(item);
  }
  
  render() {
     return (
      <SelectEmployeeForm
        onSelect={this.onSelect}
      />
     )
  }
}
