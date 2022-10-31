import { ChangeEvent, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import BaseProps from '../../../models/BaseProps';
import ClassLevel from "../../../models/ClassLevel";
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import { commonWrapper } from "../../../utils/commonWrapper";
import School from '../../../models/School';
import BaseMasterDataPage from "./BaseMasterDataPage";
import ActionButton from "../../../components/buttons/ActionButton";
import ClassLevelMembersPage from './ClassLevelMembersPage';

class State extends BaseMasterDataState<ClassLevel> {
  showEditMember: boolean
}
class ClassLevelsPage extends BaseMasterDataPage<ClassLevel, BaseProps, State> {
  schools: School[] = [];
  constructor(props: BaseProps) {
    super(props, "classlevels", "Class Level Management");
    this.state = new State();
  }
  get defaultItem() { return new ClassLevel() }
  getDataTableHeaderVals() {
    return [
      new DataTableHeaderValue("level", "Level"),
      new DataTableHeaderValue("letter", "Letter"),
      new DataTableHeaderValue("school.name", "School"),
      new DataTableHeaderValue("description", "Description"),
      new DataTableHeaderValue("semesterPeriod.semester", "Semester"),
      new DataTableHeaderValue("semesterPeriod.year", "Year"),
      new DataTableHeaderValue(null, "Member", false),
      new DataTableHeaderValue("semesterPeriod.active", "Semester Active", true, false),
    ]
  }

  edit = (model: ClassLevel) => {
    this.service.list<School>('schools', 0, -1)
      .then((response) => {
        this.schools = response.items ?? [];
        if (this.schools.length === 0) {
          this.dialog.showError("No School Record", "Failed when getting school data");
          return;
        }
        if (!model.school) {
          model.school = this.schools[0];
        }
        this.setState({ item: model }, this.showForm);
      })
      .catch((e) => this.dialog.showError("Failed to Read School Data", e));
  }

  showInsertForm = () => this.edit(this.defaultItem);
  showEditMemberForm = (item: ClassLevel) => this.setState({ item: item, showEditMember: true });
  closeEditMemberForm = () => {
    this.setState({ showEditMember: false }, this.resetFormAndClose);
  }
  render() {
    if (this.state.showEditMember && this.state.item) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          <ActionButton onClick={this.closeEditMemberForm} iconClass="fas fa-times" className="btn btn-secondary btn-sm mx-2">
            Close form
          </ActionButton>
          <ClassLevelMembersPage item={this.state.item} />
        </ViewTemplate>
      )
    }
    if (this.state.showForm && this.state.item && this.schools.length > 0) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          {this.closeFormButton}
          <FormEdit item={this.state.item} schools={this.schools} handleInputChange={this.handleInputChange} onSubmit={this.formEditSubmit} />
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
          <div className="mt-5 pl-3 pr-3" style={{ overflow: 'auto' }}>
            {this.paginationButton}
            <form onSubmit={this.loadFromForm}>
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
                      <tr key={"ClassLevel-" + item.id}>
                        <td>{this.startingNumber + i}</td>
                        <td>{item.level}</td>
                        <td>{item.letter}</td>
                        <td>{item.school.name}</td>
                        <td>{item.description}</td>
                        <td>{item.semester}</td>
                        <td>{item.year}</td>
                        <td>
                          {item.memberCount}
                          <ActionButton
                            className="btn btn-text btn-sm"
                            iconClass="fas fa-edit"
                            onClick={() => this.showEditMemberForm(item)}
                          />
                        </td>
                        <td>{item.semesterActive ?
                          <b className="text-success">active</b> : <i>not active</i>}
                        </td>
                        <td>
                          {item.semesterActive ? this.actionButton(item) : null}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                {this.tableFooter}
              </table>
            </form>
          </div>}
      </ViewTemplate>
    )
  }
}

export default commonWrapper(ClassLevelsPage);

const FormEdit = (props: {
  item: ClassLevel,
  schools: School[],
  onSubmit: (e: FormEvent) => any,
  handleInputChange: (e: ChangeEvent) => any
}) => {
  const { item, onSubmit, handleInputChange } = props;
  const setSchool = (school: School) => {
    item.school = school;
  }
  return (
    <div className="formEditContainer">
      <form className="masterDataForm px-3 py-3 border rounded border-gray" onSubmit={onSubmit}>
        <p>Level</p>
        <input className="form-control" name="item.level" id="item.level" value={item.level} type="number" required onChange={handleInputChange} />
        <p>Letter</p>
        <input className="form-control" name="item.letter" id="item.letter" value={item.letter} onChange={handleInputChange} required />
        <p>School</p>
        <select className="form-control" required>
          {props.schools.map((school) => {
            return (
              <option key={"select-class-school-" + school.id} onClick={() => setSchool(school)}>
                {school.name}
              </option>
            )
          })}
        </select>
        <p>Semester</p>
        <input className="form-control" name="item.semester" id="item.semester" value={item.semester} type="number" required onChange={props.handleInputChange} />
        <p>Year</p>
        <input className="form-control" name="item.year" id="item.year" value={item.year} onChange={props.handleInputChange} required />

        <p></p>
        <input className="btn btn-primary" value="Save" type="submit" />
      </form>
    </div>
  )
}
