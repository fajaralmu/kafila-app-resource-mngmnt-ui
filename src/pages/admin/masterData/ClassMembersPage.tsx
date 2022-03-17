import { resolve } from "inversify-react";
import { ChangeEvent, FormEvent, ReactNode } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import BaseProps from '../../../models/BaseProps';
import ClassLevel from '../../../models/ClassLevel';
import ClassMember from "../../../models/ClassMember";
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import Student from '../../../models/Student';
import MasterDataService from '../../../services/MasterDataService';
import ToastService from '../../../services/ToastService';
import { commonWrapper } from "../../../utils/commonWrapper";
import ControlledComponent from "../../ControlledComponent";
import ClassMemberService from './../../../services/ClassMemberService';
import BaseMasterDataPage from "./BaseMasterDataPage";

class State extends BaseMasterDataState<ClassMember> {

}
class ClassMembersPage extends BaseMasterDataPage<ClassMember, BaseProps, State> {    
    constructor(props: BaseProps) {
        super(props, "classmembers", "Class Member Management");
        this.state = new State();
    }
    get defaultItem(): ClassMember { return new ClassMember() }
    getDataTableHeaderVals(): DataTableHeaderValue[] {
        return [
            new DataTableHeaderValue("student.nisKiis", "Nis Kiis"),
            new DataTableHeaderValue("student.user.fullName", "Name"),
            new DataTableHeaderValue("classLevel.level", "Class"),
            new DataTableHeaderValue("classLevel.letter", "Letter"),
            new DataTableHeaderValue("classLevel.school.name", "School"),
            new DataTableHeaderValue("classLevel.semesterPeriod.semester", "Semester"),
            new DataTableHeaderValue("classLevel.semesterPeriod.year", "Year"),
            new DataTableHeaderValue("classLevel.semesterPeriod.active", "Semester Active", true, false),
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
        
        const { result } = this.state;
        const items = result?.items;
        return (
            <ViewTemplate title={this.title} back="/admin">
                {this.showFormButton}
                {result === undefined || items === undefined ?
                    <i>Loading...</i> :
                    <form onSubmit={this.loadFromForm} className="mt-5 pl-3 pr-3" style={{overflow: 'auto'}}>
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
                                    const { classLevel, student } = item;
                                    return (
                                        <tr key={"ClassMember-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{student.nisKiis}</td>
                                            <td>{student.user.fullName}</td>
                                            <td>{classLevel.level}</td>
                                            <td>{classLevel.letter}</td>
                                            <td>{classLevel.school.name}</td>
                                            <td>{classLevel.semester}</td>
                                            <td>{classLevel.year}</td>
                                            <td>
                                                {classLevel.semesterActive ? <b className="text-success">active</b> : <i>not active</i>}
                                            </td>
                                            <td>
                                                {classLevel.semesterActive ? this.actionButton(item) : null}
                                            </td>
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
    @resolve(ClassMemberService)
    private classMemberService: ClassMemberService;
    @resolve(ToastService)
    private toast: ToastService;

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
        this.classMemberService.getActiveClasses()
            .then(this.handleClassLoaded)
            .catch(() => this.toast.showDanger("Failed to load classes"));
    }

    handleClassLoaded = (classes: ClassLevel[]) => {
        if (!classes || classes.length === 0) {
            this.toast.showDanger("No class found this semester");
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
            .then(response => this.handleStudentLoaded(response.items))
            .catch((e) => this.toast.showDanger("Failed to load students"));
    }
    handleStudentLoaded = (items:Student[]) => {
        if (!items || items.length === 0) {
            this.toast.showDanger("No student containing name \"" + this.state.searchStudent + "\" was found");
            return;
        }
        this.setState({ students: items });
    }
    
    closeStudentDropdown = () => this.setState({ students: [] });
    setSelectedStudent = (item:Student) => {
        this.props.item.student = item;
        this.setState({ searchStudent: item.user.fullName }, this.closeStudentDropdown);
    }

    setSelectedClass = (item:ClassLevel) => {
        this.props.item.classLevel = item;
    }

    submitForm = (e:FormEvent) => {
        e.preventDefault();
        const { item } = this.props;
        if (!item.student || item.student.id < 1 || !item.classLevel || item.classLevel.id < 1) {
            this.toast.showDanger("Please select student and class correctly");
            return;
        }
        this.props.onSubmit(e);
    }

    render() {
        const { students, classes, searchStudent } = this.state;
        return (
            <div className="formEditContainer">
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
                            value={searchStudent}
                            placeholder="Full Name"
                            onChange={this.handleInputChange} 
                            required 
                        />
                        <div className="input-group-append">
                            <input type="submit" className="btn btn-primary" value={"Search"}/>
                        </div>
                    </div>
                        
                    <div style={{position: 'absolute',width:'75%'}}>
                        {students.length > 0 ?
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
                                                   {e.nisKiis} - {e.user.fullName.trim()}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div> : null }

                    </div>
                
                </form>
                <form onSubmit={this.submitForm}>
                    <p>Active Class Level</p>
                    <select className="form-control" >
                        {classes.map(item => {
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
