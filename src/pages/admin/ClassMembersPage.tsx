import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import BaseMasterDataState from '../../models/BaseMasterDataState';
import BaseProps from '../../models/BaseProps';
import ClassMember from "../../models/ClassMember";
import { commonWrapper } from "../../utils/commonWrapper";
import { DataTableHeaderValue } from "../../utils/componentUtil";
import BaseMasterDataPage from "./BaseMasterDataPage";
import Student from './../../models/Student';
import ClassLevel from './../../models/ClassLevel';
import { resolve } from "inversify-react";
import MasterDataService from './../../services/MasterDataService';
import RestClient from "../../apiClients/RestClient";
import ControlledComponent from "../ControlledComponent";
import DialogService from './../../services/DialogService';
import ActionButton from "../../components/buttons/ActionButton";
import Settings from "../../settings";

class State extends BaseMasterDataState<ClassMember>
{

}
class ClassMembersPage extends BaseMasterDataPage<ClassMember, BaseProps, State>
{
    
    constructor(props: BaseProps) {
        super(props, "classmembers", "Class Member Management");
        this.state = new State();
    }
    get defaultItem(): ClassMember { return new ClassMember() }
    getDataTableHeaderVals(): DataTableHeaderValue[] {
        return [
            new DataTableHeaderValue("student.user.fullName", "Name"),
            new DataTableHeaderValue("classLevel.level", "Class"),
            new DataTableHeaderValue("classLevel.letter", "Letter"),
            new DataTableHeaderValue("classLevel.school.name", "School"),
            new DataTableHeaderValue("classLevel.semesterPeriod.semester", "Semester"),
            new DataTableHeaderValue("classLevel.semesterPeriod.year", "Year"),
            new DataTableHeaderValue("classLevel.active", "Semester Active", false),
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
                {this.showFormButton}
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
                                        <tr key={"ClassMember-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.student.user.fullName}</td>
                                            <td>{item.classLevel.level}</td>
                                            <td>{item.classLevel.letter}</td>
                                            <td>{item.classLevel.school.name}</td>
                                            <td>{item.classLevel.semester}</td>
                                            <td>{item.classLevel.year}</td>
                                            <td>
                                                {item.classLevel.semesterActive ? <b className="text-success">active</b> : <i>not active</i>}
                                            </td>
                                            <td>
                                                {item.classLevel.semesterActive ? this.actionButton(item) : null}
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

export default commonWrapper(ClassMembersPage);
type FormEditProps = {
    item:ClassMember, 
    onSubmit:(e: FormEvent) => any, 
    handleInputChange:(e:ChangeEvent)=>any
};
type FormEditState = {
    students: Student[];
    classes: ClassLevel[];

    searchStudent?: string;
}
class FormEdit extends ControlledComponent<FormEditProps, FormEditState> {
    @resolve(MasterDataService)
    private masterDataService: MasterDataService;
    @resolve(RestClient)
    private rest: RestClient;
    @resolve(DialogService)
    private dialog: DialogService;

    constructor(props:FormEditProps) {
        super(props);
        this.state = {
            students: [],
            classes: [],
            searchStudent: props.item?.student?.user?.fullName
        };
    }

    componentDidMount() { this.loadClasses(); }

    loadClasses = () => {
        const URL_GET_ACTIVE_CLASSES = Settings.App.hosts.api +"/api/admin/management/classlevels/active";
        this.rest.getAuthorized<ClassLevel[]>(URL_GET_ACTIVE_CLASSES)
            .then(this.handleClassLoaded)
            .catch(err => this.dialog.showError("Failed to Load Classes", err));
    }

    handleClassLoaded = (classes: ClassLevel[]) => {
        if (!classes || classes.length == 0) {
            return;
        }
        this.props.item.classLevel = classes[0];
        this.setState({ classes: classes });
    }

    loadStudents = () => {
        const search = this.state.searchStudent;
        if (!search) {
            return;
        }
        this.masterDataService.list<Student>('students', 0, 10, 'user.fullName', false, 'user.fullName:' + search)
            .then(response => {
                this.setState({ students: response.items })
            })
            .catch((e) => this.dialog.showError("Failed to Load Students", e));
    }
    
    closeStudentDropdown = () => this.setState({ students: [] });
    setSelectedStudent = (item:Student) => {
        this.props.item.student = item;
        this.setState({ searchStudent: item.user.fullName }, this.closeStudentDropdown);
    }

    setSelectedClass = (item:ClassLevel) => {
        this.props.item.classLevel = item;
    }

    render() {
        const props = this.props;
        const item = props.item;
        const students = this.state.students;
        return (
            <div className="mx-2 py-2">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    this.loadStudents();
                }}>
                    <p>Student</p>
                    <div className="input-group">
                        <input 
                            type="search"
                            className="form-control" 
                            name="searchStudent" 
                            value={this.state.searchStudent}
                            placeholder="Full Name"
                            onChange={this.handleInputChange} 
                            required />
                        <div className="input-group-append">
                            <input type="submit" className="btn btn-primary" value={"Search"}/>
                        </div>
                    </div>
                        
                    <div style={{position: 'absolute',width:'75%'}}>
                        { students.length > 0 ?

                        <div className="bg-light border border-dark px-2 py-1 w-100" style={{position: 'relative'}}>
                            <ActionButton className="btn btn-text btn-sm" iconClass="fas fa-times" onClick={this.closeStudentDropdown}>
                                close
                            </ActionButton>
                            <div style={{overflowY:'auto', height: '100px'}}>
                                <div className="no-wrap" style={{ width: 'max-content' }}>
                                    {students.map(e => {
                                        return (
                                            <div key={"set-emp-"+e.id}>
                                                <a className="btn btn-text clickable" onClick={()=>this.setSelectedStudent(e)}>
                                                    {e.user.fullName.trim()}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div> : null }

                    </div>
                
                </form>
                <form onSubmit={props.onSubmit}>
                    <p>Active Class Level</p>
                    <select className="form-control" >
                        {this.state.classes.map(item => {
                            return (
                                <option key={"select-class-"+item.id} onClick={(e) => this.setSelectedClass(item)}>
                                    {item.level}{item.letter} - {item.school.name}
                                </option>
                            )
                        })}
                    </select>
                    <p></p>
                    <input type="submit" className="btn btn-success" value="Save" />
                </form>
            </div>
        )
    }
}
