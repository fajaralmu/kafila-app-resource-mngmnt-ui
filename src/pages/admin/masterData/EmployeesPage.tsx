import { resolve } from "inversify-react";
import { ChangeEvent, Component, FormEvent, ReactNode, useState } from "react";
import ActionButton from "../../../components/buttons/ActionButton";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import BaseProps from '../../../models/BaseProps';
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import Employee, { Education } from "../../../models/Employee";
import School from "../../../models/School";
import Settings from "../../../settings";
import { commonWrapper } from "../../../utils/commonWrapper";
import { getInputReadableDate } from "../../../utils/stringUtil";
import ControlledComponent from "../../ControlledComponent";
import BaseMasterDataPage from "./BaseMasterDataPage";
import FileUploadService from './../../../services/FileUploadService';

class State extends BaseMasterDataState<Employee> {

}
class EmployeesPage extends BaseMasterDataPage<Employee, BaseProps, State> {
    @resolve(FileUploadService)
    private upload: FileUploadService;

    constructor(props: BaseProps) {
        super(props, "employees", "Employees Management");
        this.state = new State();
    }
    get defaultItem(): Employee { 
        const e = new Employee(); 
        return e;
    }
    
    getDataTableHeaderVals = () => {
        return [
            new DataTableHeaderValue("nisdm", "NISDM"),
            new DataTableHeaderValue("user.fullName", "Full Name"),
            new DataTableHeaderValue("user.email", "Email"),
            new DataTableHeaderValue("user.birthDate", "BirthDate"),
            new DataTableHeaderValue("user.gender", "Gender"),
            new DataTableHeaderValue(null, "Signature", false),
            new DataTableHeaderValue(null, "School", false),
            new DataTableHeaderValue(null, "Education", false),
        ]
    }
    removeEducation = (item:Employee, educationId:number) => {
        this.dialog.showConfirmDanger("Remove Education", "Dou you want to remove education data?")
            .then(ok => {
                if (ok) {
                    item.removeEducation(educationId);
                    this.update(item);
                }
            })
        
    }
    addEducation = (item:Employee) => {
        this.dialog.showContent("Add Education", <AddEducationForm item={item} update={(e) => this.submitAddEducation(item, e) }/>);
    }
    submitAddEducation = (item:Employee, education:Education) => {
        item.educations.push(education);
        this.update(item);
    }

    removeSchool = (item:Employee, schoolId:number) => {
        this.dialog.showConfirmDanger("Remove School", "Dou you want to remove school data?")
            .then(ok => {
                if (ok) {
                    item.removeSchool(schoolId);
                    this.update(item);
                }
            })
        
    }
    addSchool = (item:Employee) => {
        this.service.get<Employee>('employees', item.id)
            .then(employee => {
                employee = Object.assign(new Employee(), employee);
                this.service.list<School>('schools', 0, -1, undefined)
                    .then(schoolsResponse => {
                        this.dialog.showContent("Add School", 
                        <AddSchoolForm 
                            schools={schoolsResponse.items} 
                            update={(e) => this.submitAddSchool(employee, e) }
                        />);
                    })
                    .catch(console.error);
                })
            .catch(console.error);
        
    }
    submitAddSchool = (item:Employee, school:School) => {
        if(item.addSchool(school)) {
            this.update(item);
        }  
    }
    showSignatureForm = (item: Employee) => {
        const closeObs = {
            obs: {
                close: () => {}
            }
        };
        const submit = (emp:Employee, file: File) => {
            this.upload.uploadSignature(emp, file)
                .then((response) => {
                    if (closeObs.obs.close) {
                        closeObs.obs.close();
                    }
                    this.toast.showSuccess('Signature has been uploaded');

                    // Force update to reload all signature image
                    this.forceUpdate();
                })
                .catch((e) => {
                    this.toast.showDanger('Failed to upload signature');
                    console.error(e);
                });
        }
        this.dialog.showContent(
            'Upload Signature',
            <FormUploadSignature employee={item} submit={submit} />,
            closeObs
        );
    }
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
                                    const { user, schools, educations } = item;
                                    return (
                                        <tr key={"user-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.nisdm}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.birthDate).toLocaleDateString()}</td>
                                            <td>{user.gender}</td>
                                            <td>
                                                <img
                                                    width={50}
                                                    height={50}
                                                    src={signaturePath(item.id)}
                                                />
                                                <div>
                                                    <ActionButton 
                                                        iconClass="fas fa-edit"
                                                        className="btn btn-dark btn-sm"
                                                        onClick={() => this.showSignatureForm(item)}
                                                    />
                                                </div>
                                            </td>
                                            <td>{this.listToggler(
                                                    schools, 
                                                    item, 
                                                    (school) => `${school.name}`, 
                                                    this.addSchool, 
                                                    this.removeSchool)}
                                            </td>
                                            <td>
                                                {this.listToggler(
                                                    educations, 
                                                    item, 
                                                    (ed) => `${ed.type}: ${ed.name}`, 
                                                    this.addEducation, 
                                                    this.removeEducation)}
                                            </td>
                                            
                                            <td>{this.actionButton(item)}</td>
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

const signaturePath = (id: any) => {
    return `${Settings.App.hosts.api}/files/employeesignature/${id}?v=${new Date().getTime()}`;
}

const FormUploadSignature = (props: { employee: Employee, submit: (employee: Employee, file: File) => any }) => {
    const [file, setFile] = useState<any>(null);
    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (file && file instanceof File) {
            props.submit(props.employee, file);
        }
    };
    const onChange = (e: ChangeEvent) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            setFile(input.files[0]);
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <p>Select file</p>
            <input required onChange={onChange} className="form-control" type="file" accept="image/png" />
            <p></p>
            <ActionButton className="btn btn-success" type="submit">Upload</ActionButton>
        </form>
    )
}

const FormEdit = (props:{
    item:Employee, 
    onSubmit:(e:FormEvent) => any, 
    handleInputChange:(e:ChangeEvent)=>any
}) => {
    const item = props.item;
    const onChange = props.handleInputChange;
    return (
        <div className="formEditContainer">
            <form className="masterDataForm px-3 py-3 border rounded border-gray"  onSubmit={props.onSubmit}>
                <p>NiSDM</p>
                <input className="form-control" id="item.nisdm" name="item.nisdm" value={item.nisdm} onChange={onChange} required/>
                <p>Full Name</p>
                <input className="form-control" id="item.user.fullName" name="item.user.fullName" value={item.user.fullName}  onChange={onChange} required/>
                <p>Email</p>
                <input className="form-control" id="item.user.email" name="item.user.email" type="email" value={item.user.email}  onChange={onChange} required/>
                <p>Gender</p>
                <select className="form-control" value={item.user.gender} id="item.user.gender" name="item.user.gender" onChange={onChange} required>
                    <option  >MALE</option>
                    <option  >FEMALE</option>
                </select>
                <p>Birth Date</p>
                <input type="date" className="form-control" id="item.user.birthDate" name="item.user.birthDate" value={getInputReadableDate(new Date(item.user.birthDate))} onChange={onChange} required/>
                <p>Birth Place</p>
                <input className="form-control" id="item.user.birthPlace" name="item.user.birthPlace" value={item.user.birthPlace} onChange={onChange} required/>
                
                <p>Phone Number</p>
                <input className="form-control" id="item.user.phoneNumber" name="item.user.phoneNumber" value={item.user.phoneNumber} onChange={onChange} required/>
                
                <p>No KK</p>
                <input className="form-control" id="item.noKk" name="item.noKk" value={item.noKk} onChange={onChange} required/>
                <p>No KTP</p>
                <input className="form-control" id="item.noKtp" name="item.noKtp" value={item.noKtp} onChange={onChange} required/>
                
                <p>Alamat Sesuai KTP</p>
                <input className="form-control" id="item.addressKtp" name="item.addressKtp" value={item.addressKtp} onChange={onChange} required/>
                <p>Alamat Domisili</p>
                <input className="form-control" id="item.addressOther" name="item.addressOther" value={item.addressOther}  onChange={onChange}/>
            
                <p>Nama Ibu</p>
                <input className="form-control" id="item.motherName" name="item.motherName" value={item.motherName}  onChange={onChange}/>
                <p>Nama Ayah</p>
                <input className="form-control" id="item.fatherName" name="item.fatherName" value={item.fatherName} onChange={onChange}/>
            
                <p>NPWP</p>
                <input className="form-control" id="item.npwp" name="item.npwp" value={item.npwp} onChange={onChange}/>
                <p>No Rekening BSI</p>
                <input className="form-control" id="item.bankAccountNumber" name="item.bankAccountNumber" value={item.bankAccountNumber} onChange={onChange}/>

                <p></p>
                <input className="btn btn-primary" value="Save" type="submit" />
            </form>
        </div>
    )
}
type AddEducationFormState = { item:Education }
class AddEducationForm extends ControlledComponent<{item:Employee, update:(item:Education) => any}, AddEducationFormState>{
    constructor(props:any) {
        super(props);
        this.state = {
            item: new Education()
        };
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        this.props.update(this.state.item);
    }

    render(): ReactNode {
        const item = this.state.item;
        const levels = ["S1", "S2", "S3", "D1", "D2", "D3",]
        return (
            <form onSubmit={this.onSubmit}>
                <p>Type</p>
                <select className="form-control" value={item.type} name="item.type" onChange={this.handleInputChange}>
                    {levels.map(i => <option key={"add-edu-lvl-"+i}>{i}</option>)}
                </select>
                <p>Name</p>
                <input className="form-control" value={item.name} name="item.name" onChange={this.handleInputChange}/>
                <p>Major</p>
                <input className="form-control" value={item.major} name="item.major" onChange={this.handleInputChange}/>
                <p>Title</p>
                <input className="form-control" value={item.title} name="item.title" onChange={this.handleInputChange}/>
                <p/>
                <input className="btn btn-primary" type="submit" value="Save"/>
            </form>
        )
    }
}
 
class AddSchoolForm extends Component<{schools:School[], update:(item:School) => any, closeObserver?:{close:()=>any}}, any>{
    selectedSchool:School;
    constructor(props:any) {
        super(props); 
        this.selectedSchool = this.props.schools[0];
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        this.props.update(this.selectedSchool);
        if (this.props.closeObserver) {
            this.props.closeObserver.close();
        }
    }

    render(): ReactNode {
        return (
            <form onSubmit={this.onSubmit}>
                <p>Type</p>
                <select className="form-control" >
                    {this.props.schools.map(i =>{
                        return <option onClick={(e) => {this.selectedSchool = i}} key={"add-school-"+i.code}>{i.name}</option>
                    })}
                </select>
                <p/>
                <input className="btn btn-primary" type="submit" value="Save"/>
            </form>
        )
    }
}

export default commonWrapper(EmployeesPage)
