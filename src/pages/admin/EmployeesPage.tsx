import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../layout/ViewTemplate";
import { commonWrapper } from "../../utils/commonWrapper";
import BaseProps from '../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from '../../models/BaseMasterDataState';
import User from "../../models/User";
import PaginationButtons from "../../components/buttons/PaginationButtons";
import ActionButton from "../../components/buttons/ActionButton";
import Employee, { Education } from "../../models/Employee";
import { DataTableHeaderValue } from "../../utils/componentUtil";
import ControlledComponent from "../ControlledComponent";
import School from "../../models/School";
import { getInputReadableDate } from "../../utils/stringUtil";

class State extends BaseMasterDataState<Employee>
{

}
class EmployeesPage extends BaseMasterDataPage<Employee, BaseProps, State>
{
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
        this.service.list<School>('schools', 0, -1, undefined)
            .then(response=>{
                this.dialog.showContent("Add School", 
                <AddSchoolForm 
                    schools={response.items} 
                    update={(e) => this.submitAddSchool(item, e) }/>);
            })
            .catch(console.error);
        
    }
    submitAddSchool = (item:Employee, school:School) => {
        if(item.addSchool(school)) {
            this.update(item);
        }  
    }
    render(): ReactNode {
        if (this.state.showForm && this.state.item)
        {
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
                                        <tr key={"user-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.nisdm}</td>
                                            <td>{item.user.fullName}</td>
                                            <td>{item.user.email}</td>
                                            <td>{new Date(item.user.birthDate).toLocaleDateString()}</td>
                                            <td>{item.user.gender}</td>
                                            <td>{this.listToggler(
                                                    item.schools, 
                                                    item, 
                                                    (i) => `${i.name}`, 
                                                    this.addSchool, 
                                                    this.removeSchool)}
                                            </td>
                                            <td>
                                                {this.listToggler(
                                                    item.educations, 
                                                    item, 
                                                    (i) => `${i.type}: ${i.name}`, 
                                                    this.addEducation, 
                                                    this.removeEducation)}
                                            </td>
                                            
                                            <td>
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

export default commonWrapper(EmployeesPage)


const FormEdit = (props:{
    item:Employee, 
    onSubmit:(e:FormEvent) => any, 
    handleInputChange:(e:ChangeEvent)=>any
}) => {
    const item = props.item;
    const onChange = props.handleInputChange;
    return (
        <div className="mx-2 py-2">
            <form onSubmit={props.onSubmit}>
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
class AddEducationFormState {
    item:Education = new Education()
}
class AddEducationForm extends ControlledComponent<{item:Employee, update:(item:Education) => any}, AddEducationFormState>{
    constructor(props:any)
    {
        super(props);
        this.state = new AddEducationFormState();
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
    constructor(props:any)
    {
        super(props); 
        this.selectedSchool = this.props.schools[0];
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        this.props.update(this.selectedSchool);
        console.log("this.props: ", this.props);
        if (this.props.closeObserver)
        {
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