import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ViewTemplate } from "../../../../layout/ViewTemplate";
import BaseMasterDataState from '../../../../models/BaseMasterDataState';
import BaseProps from '../../../../models/BaseProps';
import ClassLevel from "../../../../models/ClassLevel";
import DataTableHeaderValue from "../../../../models/DataTableHeaderValue";
import { commonWrapper } from "../../../../utils/commonWrapper";
import School from '../../../../models/School';
import ActionButton from "../../../../components/buttons/ActionButton";
import ClassLevelMembersPage from '../ClassLevelMembersPage';
import BaseMasterDataPageV2 from './BaseMasterDataPageV2';
import BaseMasterDataStateV2 from './../../../../models/BaseMasterDataStateV2';
import ClassLevelRes from "../../../../models/res/ClassLevelRes";
import { resolve, useInjection } from "inversify-react";
import MasterDataService from './../../../../services/MasterDataService';
import AuthService from './../../../../services/AuthService';
import ApplicationProfile from './../../../../models/ApplicationProfile';

type Req = {
  id: number | undefined;
  letter: string;
  level: number;
  schoolId: number;
}
class State extends BaseMasterDataStateV2<Req, ClassLevelRes> {
  showEditMember = false;
  selectedEditMemberItem: ClassLevelRes | undefined = undefined;
}
class ClassLevelsPageV2 extends BaseMasterDataPageV2<Req, ClassLevelRes, BaseProps, State> {
  @resolve(MasterDataService)
  private serviceV1: MasterDataService;
  private schools: School[] = [];
  constructor(props: BaseProps) {
    super(props, 'classlevels', 'Class Level Management');
    this.state = new State();
  }
  get defaultItem(): Req {
    return {
      letter: 'A',
      level: 1,
      schoolId: 0,
      id: undefined,
    };
  }
  toReqModel(res: ClassLevelRes): Req {
    return {
      id: res.id,
      letter: res.letter,
      schoolId: res.schoolId,
      level: res.level,
    }
  }

  getDataTableHeaderVals() {
    return [
      new DataTableHeaderValue("level", "Level"),
      new DataTableHeaderValue("letter", "Letter"),
      new DataTableHeaderValue("school.name", "School"),
      new DataTableHeaderValue("semesterPeriod.semester", "Semester"),
      new DataTableHeaderValue("semesterPeriod.year", "Year"),
      new DataTableHeaderValue(null, "Member", false),
      new DataTableHeaderValue("semesterPeriod.active", "Semester Active", true, false),
    ]
  }

  edit = (item: Req) => {
    this.serviceV1.list<School>('schools', 0, -1)
      .then((response) => {
        this.schools = response.items ?? [];
        if (this.schools.length === 0) {
          this.dialog.showError('No School Record', 'Failed when getting school data');
          return;
        }
        this.setState({ item }, this.showForm);
      })
      .catch((e) => this.dialog.showError('Failed to Read School Data', e));
  }

  showInsertForm = () => this.edit(this.defaultItem);
  showEditMemberForm = (selectedItem: ClassLevelRes) => this.setState({ selectedEditMemberItem: selectedItem, showEditMember: true });
  closeEditMemberForm = () => {
    this.setState({ showEditMember: false, selectedEditMemberItem: undefined }, this.resetFormAndClose);
  }
  render() {
    const { selectedEditMemberItem: selectedItem, item, showForm, showEditMember, result } = this.state;
    if (showEditMember && selectedItem) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          <ActionButton onClick={this.closeEditMemberForm} iconClass="fas fa-times" className="btn btn-secondary btn-sm mx-2">
            Close form
          </ActionButton>
          <ClassLevelMembersPage item={selectedItem} />
        </ViewTemplate>
      )
    }
    if (showForm && item && this.schools.length > 0) {
      return (
        <ViewTemplate title={this.title} back="/admin">
          {this.closeFormButton}
          <FormEdit item={item} schools={this.schools} handleInputChange={this.handleInputChange} onSubmit={this.formEditSubmit} />
        </ViewTemplate>
      );
    }
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
                        <td>{item.schoolName}</td>
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

const FormEdit = (props: {
  item: Req,
  schools: School[],
  onSubmit: (e: FormEvent) => any,
  handleInputChange: (e: ChangeEvent) => any
}) => {
  const { item, schools, onSubmit, handleInputChange } = props;
  const authService = useInjection(AuthService);
  const setSchool = (school: School) => {
    item.schoolId = school.id;
  }
  const [profile, setProfile] = useState<ApplicationProfile | undefined>(undefined);
  
  useEffect(() => {
    item.schoolId = schools[0].id;
    loadProfile();
    return () => {};
  }, []);

  const loadProfile = () =>
    authService.loadOnlyProfile()
      .then(setProfile)
      .catch(() => { });
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
        <p>
          Semester:
          {profile && <i>{profile.semester} {profile.year}</i>}
          {!profile && <i>Please ensure that active period is set</i>}
        </p>
        <input className="btn btn-primary" value="Save" type="submit" />
      </form>
    </div>
  )
}

export default commonWrapper(ClassLevelsPageV2);
