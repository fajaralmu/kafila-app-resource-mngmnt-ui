import { resolve } from "inversify-react";
import React, { ChangeEvent, FormEvent } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import DefaultDialogObserver from "../../../components/dialog/DefaultDialogObserver";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import BaseProps from '../../../models/BaseProps';
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import Employee from '../../../models/Employee';
import SemesterPeriod from '../../../models/SemesterPeriod';
import { commonWrapper } from "../../../utils/commonWrapper";
import ControlledComponent from "../../ControlledComponent";
import BaseMasterDataPage from "./BaseMasterDataPage";
import SelectEmployeeForm from "./SelectEmployeeForm";
import FileUploadService from './../../../services/FileUploadService';
import UploadFileForm from "./UploadFileForm";
import Settings from "../../../settings";
import { Division } from "../../../constants/Division";

class State extends BaseMasterDataState<SemesterPeriod> {

}
class SemesterPeriodsPage extends BaseMasterDataPage<SemesterPeriod, BaseProps, State> {
  @resolve(FileUploadService)
  private upload: FileUploadService;
  constructor(props: BaseProps) {
    super(props, "semesterperiods", "Semester Management");
    this.state = new State();
  }
  get defaultItem() { return new SemesterPeriod() }
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
    this.dialog.showContent(`Set ${field}`, <SetEmployeeForm field={field} item={item} update={this.update} />);
  }
  employeeCellFields = (item: SemesterPeriod) => SemesterPeriod.EmployeeFields.map(field => {
    return (
      <td key={`emp-field-${item.id}.${field}`}>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <div className="col-3">
            <ActionButton
              iconClass="fas fa-user-edit"
              className="btn btn-sm btn-success me-3"
              onClick={() => this.setEmployeeInCharge(item, field)}
            />
          </div>
          <div className="col-8 no-wrap">{(item as any)[field]?.user.fullName.trim()}</div>
        </div>
      </td>
    );
  })
  showStampUploadForm = (item: SemesterPeriod, division: Division) => {
    const dialogObs = DefaultDialogObserver.create();
    const uploadStamp = (file: File) => {
      this.upload.uploadDivisionStamp(item, file, division)
        .then(() => {
          this.toast.showSuccess(`Stamp: ${division} has been uploaded`);
          dialogObs.close();
          this.forceUpdate();
        })
        .catch((e) => {
          this.toast.showDanger(`Failed to upload ${division} stamp`);
          console.error(e);
        });
    }
    this.dialog.showContent(
      `Upload Stamp: ${division}`,
      <UploadFileForm submit={uploadStamp} />,
      dialogObs
    );
  }
  render() {
    const { result, showForm, item } = this.state;

    if (showForm && item) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          {this.closeFormButton}
          <FormEdit item={item} handleInputChange={this.handleInputChange} onSubmit={this.formEditSubmit} />
        </ViewTemplate>
      );
    }
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
                  <th>Stamp</th>
                  {this.getDataTableHeaderComponent()}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  return (
                    <tr key={`smt-period-${item.id}`}>
                      <td>{this.startingNumber + i}</td>
                      <td>
                        <div className="mx-2 d-flex" style={{ flexWrap: 'nowrap' }}>
                          <ActionButton
                            onClick={item.active ? () => { } : () => this.setActive(item)}
                            iconClass={item.active === true ? 'fas fa-check-circle' : 'fas fa-circle'}
                            className={`btn-text btn btn-sm ${item.active ? 'text-success' : 'text-secondary'} me-1`}
                          />
                          {!item.active && this.actionButton(item)}
                          {item.active && <span>Active</span>}
                        </div>
                      </td>
                      <td className="d-flex" style={{ gap: 5 }}>
                        <StampInput item={item} division={Division.Asrama} showForm={this.showStampUploadForm} />
                        <StampInput item={item} division={Division.Tahfiz} showForm={this.showStampUploadForm} />
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

const StampInput = (props: { item: SemesterPeriod, division: Division, showForm(item: SemesterPeriod, div: Division): any }) => {
  const { item, division } = props;
  return (
    <div className="text-center">
      <img
        width={50}
        height={50}
        className="border border-dark mb-1"
        src={stampPath(item, division)}
      />
      <div style={{ whiteSpace: 'pre' }}>
        <ActionButton
          iconClass="fas fa-edit"
          className="btn btn-dark btn-sm"
          onClick={() => props.showForm(item, division)}
          children={division}
        />
      </div>
    </div>
  );
};

const stampPath = (item: SemesterPeriod, division: Division) => {
  return `${Settings.App.hosts.api}/files/division-stamp/period/${item.id}?division=${division}&v=${new Date().getTime()}`;
}

const FormEdit = (props: {
  item: SemesterPeriod,
  onSubmit: (e: FormEvent) => any,
  handleInputChange: (e: ChangeEvent) => any
}) => {
  const { item } = props;
  return (
    <div className="formEditContainer">
      <form className="masterDataForm px-3 py-3 border rounded border-gray" onSubmit={props.onSubmit}>
        <p>Semester</p>
        <select className="form-control" name="item.semester" id="item.semester" value={item.semester} onChange={props.handleInputChange} required>
          <option>1</option>
          <option>2</option>
        </select>
        <p>Year. <i>example: 2020-2021</i></p>
        <input
          className="form-control"
          name="item.year"
          id="item.year"
          value={item.year}
          onChange={props.handleInputChange}
          required
        />
        <p />
        <input className="btn btn-primary" value="Save" type="submit" />
      </form>
    </div>
  )
}
type SetEmployeeProps = { item: SemesterPeriod, field: string, update(item: SemesterPeriod): any };

class SetEmployeeForm extends ControlledComponent<SetEmployeeProps, any> {

  onSelect = (employee: Employee) => {
    const { item } = this.props as any;
    item[this.props.field] = employee;
    this.props.update(item);
  }

  render() {
    return <SelectEmployeeForm onSelect={this.onSelect} />
  }
}

export default commonWrapper(SemesterPeriodsPage);
