
import { Component, ReactNode } from 'react';
import Student from '../../../models/Student';
import ClassLevel from './../../../models/ClassLevel';
import ClassMember from './../../../models/ClassMember';
import { resolve } from 'inversify-react';
import RestClient from './../../../apiClients/RestClient';
import ClassMemberService from './../../../services/ClassMemberService';
import ControlledComponent from '../../ControlledComponent';
import ToastService from './../../../services/ToastService';
import MasterDataService from '../../../services/MasterDataService';
import ActionButton from '../../../components/buttons/ActionButton';
import DialogService from './../../../services/DialogService';

type Props = {
    item: ClassLevel,
}
type State = {
    members: ClassMember[],
    students: Student[],
    searchStudent?: string,
}

export default class ClassLevelMembersPage extends ControlledComponent<Props, State> {
    @resolve(ClassMemberService)
    private service: ClassMemberService;
    @resolve(MasterDataService)
    private masterData: MasterDataService;
    @resolve(ToastService)
    private toast: ToastService;
    @resolve(DialogService)
    private dialog: DialogService;

    constructor(props: Props) {
        super(props);
        this.state = {
            members: [],
            students: [],
            searchStudent: ""
        }
    }
    componentDidMount() {
        this.loadMembers();
    }
    loadMembers = () => {
        this.service.getMembers(this.props.item.id)
            .then(response => this.setState({ members: response }))
            .catch(console.error);
    }
    loadStudents = () => {
        const { searchStudent } = this.state;
        if (!searchStudent) {
            return;
        }
        this.masterData.list<Student>('students', 0, 10, 'user.fullName', false, 'user.fullName:' + searchStudent)
            .then(response => {
                if (response.items.length > 0) {
                    this.setState({ students: response.items });
                } else {
                    this.toast.showDanger("Student not found");
                }
            })
            .catch((e) => this.toast.showDanger(e.message));
    }
    closeStudentDropdown = () => this.setState({ students: [] });
    addStudent = async (student: Student) => {
        const ok = await this.dialog.showConfirm("Add New Student", `Add ${student.user.fullName} to this class?`);
        if (!ok) {
            return;
        }
        const member = new ClassMember();
        member.student = student;
        member.classLevel = this.props.item;

        this.masterData.post<ClassMember>('classmembers', member)
            .then(() => {
                this.toast.showInfo("Student has been added");
                this.setState({ searchStudent: '' }, this.loadMembers);
            })
            .catch((e:any) => this.toast.showDanger("Failed to add student: " + e.message))
            .finally(this.closeStudentDropdown);
    }
    deleteMember = async (member: ClassMember) => {
        const ok = await this.dialog.showConfirmDanger("Remove Student", `Do you want to remove ${member.student.user.fullName} from class?`);
        if (!ok) {
            return;
        }
        this.masterData.delete<ClassMember>('classmembers', member.id)
            .then(() => {
                this.toast.showInfo("Student has been removed");
                this.loadMembers();
            })
            .catch(console.error);
    }

    render(): ReactNode {
        const { students, searchStudent, members } = this.state;
        const { item } = this.props;
        return (
            <div>
                <h5>Members of {item.level}{item.letter} {item.school?.name}</h5>
                <p>Period: semester {item.semester}, year {item.year}</p>
                <form className='mb-3' onSubmit={(e) => {
                    e.preventDefault();
                    this.loadStudents();
                }}>
                    <p>Add Student</p>
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
                        
                    <div style={{ position: 'absolute',width:'75%' }}>
                        {students.length > 0 ?
                        <div className="bg-light border border-dark px-2 py-1 w-100" style={{position: 'relative'}}>
                            <ActionButton 
                                className="btn btn-text btn-sm" 
                                iconClass="fas fa-times" 
                                onClick={this.closeStudentDropdown}
                                children="Close"
                            />
                            <div style={{overflowY:'auto', height: '100px'}}>
                                <div className="no-wrap" style={{ width: 'max-content' }}>
                                    {students.map(e => {
                                        return (
                                            <div className='d-flex my-1' style={{ alignItems: 'center' }} key={"set-emp-"+e.id}>
                                                <ActionButton
                                                    iconClass='fas fa-plus-circle'
                                                    className='me-2 btn btn-info btn-sm btn-text' 
                                                    onClick={() => this.addStudent(e)}
                                                />
                                                <span>{e.nisKiis} - {e.user.fullName.trim()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div> : null }

                    </div>
                
                </form>
                <h5>Member List</h5>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <td>No</td>
                            <td>Nis Kiis</td>
                            <td>Name</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, i) => {
                            return (
                                <tr key={`member-${member.id}`}>
                                    <td>{i + 1}</td>
                                    <td>{member.student.nisKiis}</td>
                                    <td>{member.student.user.fullName}</td>
                                    <td>
                                        <ActionButton 
                                            className='btn btn-text text-danger' 
                                            onClick={() => this.deleteMember(member)}
                                            iconClass="fas fa-minus-circle"
                                        >
                                            Remove
                                        </ActionButton>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }


}