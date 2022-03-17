import { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { ViewTemplate } from "../../../layout/ViewTemplate";
import { commonWrapper } from "../../../utils/commonWrapper";
import BaseProps from '../../../models/BaseProps';
import BaseMasterDataPage from "./BaseMasterDataPage";
import BaseMasterDataState from '../../../models/BaseMasterDataState';
import Student from "../../../models/Student";
import DataTableHeaderValue from "../../../models/DataTableHeaderValue";
import { getInputReadableDate } from "../../../utils/stringUtil";

class State extends BaseMasterDataState<Student>
{

}
class StudentsPage extends BaseMasterDataPage<Student, BaseProps, State>
{
    
    constructor(props: BaseProps) {
        super(props, "students", "Student Management");
        this.state = new State();
    }
    get defaultItem(): Student { return new Student() }
    getDataTableHeaderVals(): DataTableHeaderValue[] {
        return [
            new DataTableHeaderValue("nisKiis"),
            new DataTableHeaderValue("nisn"),
            new DataTableHeaderValue("user.fullName",),
            new DataTableHeaderValue("user.birthDate"),
            new DataTableHeaderValue("user.birthPlace"),
            new DataTableHeaderValue("address"),
            new DataTableHeaderValue("city"),
            new DataTableHeaderValue("province"),
            new DataTableHeaderValue("siblingNum"),
            new DataTableHeaderValue("siblingCount"),
            new DataTableHeaderValue("fatherName"),
            new DataTableHeaderValue("fatherBirthDate"),
            new DataTableHeaderValue("fatherBirthPlace"),
            new DataTableHeaderValue("fatherEducation"),
            new DataTableHeaderValue("fatherPhoneNumber"),
            new DataTableHeaderValue("fatherOccupation"),
            new DataTableHeaderValue("fatherAddress"),
            new DataTableHeaderValue("fatherIncome"),
            new DataTableHeaderValue("motherName"),
            new DataTableHeaderValue("motherBirthDate"),
            new DataTableHeaderValue("motherBirthPlace"),
            new DataTableHeaderValue("motherEducation"),
            new DataTableHeaderValue("motherPhoneNumber"),
            new DataTableHeaderValue("motherOccupation"),
            new DataTableHeaderValue("motherAddress"),
            new DataTableHeaderValue("motherIncome"),
            new DataTableHeaderValue("originSchool"),
            new DataTableHeaderValue("sttbNumber"),
            new DataTableHeaderValue("entranceDate"),
            new DataTableHeaderValue("entranceClass"),
            new DataTableHeaderValue("transferFrom"),
            new DataTableHeaderValue("transferReason"),
            new DataTableHeaderValue("entranceCertificateScore"),
            new DataTableHeaderValue("leaveSchool"),
            new DataTableHeaderValue("leaveReason"),
            new DataTableHeaderValue("educationFinished"),
            new DataTableHeaderValue("graduationDateMts"),
            new DataTableHeaderValue("certificateNumberMts"),
            new DataTableHeaderValue("seniorLevelSchool"),
            new DataTableHeaderValue("graduationDateMa"),
            new DataTableHeaderValue("certificateNumberMa"),
            new DataTableHeaderValue("graduationCeremonyDate"),
            new DataTableHeaderValue("highEducationUniv"),
            new DataTableHeaderValue("highEducationMajor"),
            new DataTableHeaderValue("workDate"),
            new DataTableHeaderValue("workCompany"),
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
                                    return (
                                        <tr key={"Student-" + item.id}>
                                            <td>{this.startingNumber + i}</td>
                                            <td>{item.nisKiis}</td>
                                            <td>{item.nisn}</td>
                                            <td>{item.user.fullName}</td>
                                            <td>{new Date(item.user.birthDate).toLocaleDateString()}</td>
                                            <td>{item.user.birthPlace}</td>
                                            <td>{item.address}</td>
                                            <td>{item.city}</td>
                                            <td>{item.province}</td>
                                            <td>{item.siblingNum}</td>
                                            <td>{item.siblingCount}</td>
                                            <td>{item.fatherName}</td>
                                            <td>{new Date(item.fatherBirthDate).toLocaleDateString()}</td>
                                            <td>{item.fatherBirthPlace}</td>
                                            <td>{item.fatherEducation}</td>
                                            <td>{item.fatherPhoneNumber}</td>
                                            <td>{item.fatherOccupation}</td>
                                            <td>{item.fatherAddress}</td>
                                            <td>{item.fatherIncome}</td>
                                            <td>{item.motherName}</td>
                                            <td>{new Date(item.motherBirthDate).toLocaleDateString()}</td>
                                            <td>{item.motherBirthPlace}</td>
                                            <td>{item.motherEducation}</td>
                                            <td>{item.motherPhoneNumber}</td>
                                            <td>{item.motherOccupation}</td>
                                            <td>{item.motherAddress}</td>
                                            <td>{item.motherIncome}</td>
                                            <td>{item.originSchool}</td>
                                            <td>{item.sttbNumber}</td>
                                            <td>{new Date(item.entranceDate).toLocaleDateString()}</td>
                                            <td>{item.entranceClass}</td>
                                            <td>{item.transferFrom}</td>
                                            <td>{item.transferReason}</td>
                                            <td>{item.entranceCertificateScore}</td>
                                            <td>{item.leaveSchool ? "True" : "False"}</td>
                                            <td>{item.leaveReason}</td>
                                            <td>{item.educationFinished ? "True" : "False"}</td>
                                            <td>{new Date(item.graduationDateMts).toLocaleDateString()}</td>
                                            <td>{item.certificateNumberMts}</td>
                                            <td>{item.seniorLevelSchool}</td>
                                            <td>{new Date(item.graduationDateMa).toLocaleDateString()}</td>
                                            <td>{item.certificateNumberMa}</td>
                                            <td>{new Date(item.graduationCeremonyDate).toLocaleDateString()}</td>
                                            <td>{item.highEducationUniv}</td>
                                            <td>{item.highEducationMajor}</td>
                                            <td>{new Date(item.workDate).toLocaleDateString()}</td>
                                            <td>{item.workCompany}</td>

                                            <td>
                                                {this.actionButton(item)}
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

export default commonWrapper(StudentsPage);

const FormEdit = (props:{
    item:Student, 
    onSubmit:(e:FormEvent) => any, 
    handleInputChange:(e:ChangeEvent)=>any
}) => {
    const item      = props.item;
    const onChange  = props.handleInputChange;
    return (
        <div className="formEditContainer">
            <form className="masterDataForm px-3 py-3 border rounded border-gray"  onSubmit={props.onSubmit}>
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
                <p>nisKiis</p>
                <input required placeholder="nisKiis" className="form-control" name="item.nisKiis" id="item.nisKiis" value={item.nisKiis} onChange={onChange}/>
                <p>nisn</p>
                <input required placeholder="nisn" className="form-control" name="item.nisn" id="item.nisn" value={item.nisn} onChange={onChange}/>
                <p>address</p>
                <textarea required placeholder="address" className="form-control" name="item.address" id="item.address" value={item.address} onChange={onChange}/>
                <p>city</p>
                <input required placeholder="city" className="form-control" name="item.city" id="item.city" value={item.city} onChange={onChange}/>
                <p>province</p>
                <input required placeholder="province" className="form-control" name="item.province" id="item.province" value={item.province} onChange={onChange}/>
                <p>siblingNum</p>
                <input type="number" placeholder="siblingNum" className="form-control" name="item.siblingNum" id="item.siblingNum" value={item.siblingNum} onChange={onChange}/>
                <p>siblingCount</p>
                <input type="number" placeholder="siblingCount" className="form-control" name="item.siblingCount" id="item.siblingCount" value={item.siblingCount} onChange={onChange}/>
                <p>fatherName</p>
                <input placeholder="fatherName" className="form-control" name="item.fatherName" id="item.fatherName" value={item.fatherName} onChange={onChange}/>
                <p>fatherBirthDate</p>
                <input placeholder="fatherBirthDate" className="form-control" name="item.fatherBirthDate" id="item.fatherBirthDate" type="date" value={getInputReadableDate(new Date(item.fatherBirthDate))} onChange={onChange}/>
                <p>fatherBirthPlace</p>
                <input placeholder="fatherBirthPlace" className="form-control" name="item.fatherBirthPlace" id="item.fatherBirthPlace" value={item.fatherBirthPlace} onChange={onChange}/>
                <p>fatherEducation</p>
                <input placeholder="fatherEducation" className="form-control" name="item.fatherEducation" id="item.fatherEducation" value={item.fatherEducation} onChange={onChange}/>
                <p>fatherPhoneNumber</p>
                <input placeholder="fatherPhoneNumber" className="form-control" name="item.fatherPhoneNumber" id="item.fatherPhoneNumber" value={item.fatherPhoneNumber} onChange={onChange}/>
                <p>fatherOccupation</p>
                <input placeholder="fatherOccupation" className="form-control" name="item.fatherOccupation" id="item.fatherOccupation" value={item.fatherOccupation} onChange={onChange}/>
                <p>fatherAddress</p>
                <textarea placeholder="fatherAddress" className="form-control" name="item.fatherAddress" id="item.fatherAddress" value={item.fatherAddress} onChange={onChange}/>
                <p>fatherIncome</p>
                <input type="number" placeholder="fatherIncome" className="form-control" name="item.fatherIncome" id="item.fatherIncome" value={item.fatherIncome} onChange={onChange}/>
                <p>motherName</p>
                <input placeholder="motherName" className="form-control" name="item.motherName" id="item.motherName" value={item.motherName} onChange={onChange}/>
                <p>motherBirthDate</p>
                <input placeholder="motherBirthDate" className="form-control" name="item.motherBirthDate" id="item.motherBirthDate" type="date" value={getInputReadableDate(new Date(item.motherBirthDate))} onChange={onChange}/>
                <p>motherBirthPlace</p>
                <input placeholder="motherBirthPlace" className="form-control" name="item.motherBirthPlace" id="item.motherBirthPlace" value={item.motherBirthPlace} onChange={onChange}/>
                <p>motherEducation</p>
                <input placeholder="motherEducation" className="form-control" name="item.motherEducation" id="item.motherEducation" value={item.motherEducation} onChange={onChange}/>
                <p>motherPhoneNumber</p>
                <input placeholder="motherPhoneNumber" className="form-control" name="item.motherPhoneNumber" id="item.motherPhoneNumber" value={item.motherPhoneNumber} onChange={onChange}/>
                <p>motherOccupation</p>
                <input placeholder="motherOccupation" className="form-control" name="item.motherOccupation" id="item.motherOccupation" value={item.motherOccupation} onChange={onChange}/>
                <p>motherAddress</p>
                <textarea placeholder="motherAddress" className="form-control" name="item.motherAddress" id="item.motherAddress" value={item.motherAddress} onChange={onChange}/>
                <p>motherIncome</p>
                <input type="number" placeholder="motherIncome" className="form-control" name="item.motherIncome" id="item.motherIncome" value={item.motherIncome} onChange={onChange}/>
                <p>originSchool</p>
                <input placeholder="originSchool" className="form-control" name="item.originSchool" id="item.originSchool" value={item.originSchool} onChange={onChange}/>
                <p>sttbNumber</p>
                <input placeholder="sttbNumber" className="form-control" name="item.sttbNumber" id="item.sttbNumber" value={item.sttbNumber} onChange={onChange}/>
                <p>entranceDate</p>
                <input placeholder="entranceDate" className="form-control" name="item.entranceDate" id="item.entranceDate" type="date" value={getInputReadableDate(new Date(item.entranceDate))} onChange={onChange}/>
                <p>entranceClass</p>
                <input placeholder="entranceClass" className="form-control" name="item.entranceClass" id="item.entranceClass" value={item.entranceClass} onChange={onChange}/>
                <p>transferFrom</p>
                <input placeholder="transferFrom" className="form-control" name="item.transferFrom" id="item.transferFrom" value={item.transferFrom} onChange={onChange}/>
                <p>transferReason</p>
                <input placeholder="transferReason" className="form-control" name="item.transferReason" id="item.transferReason" value={item.transferReason} onChange={onChange}/>
                <p>entranceCertificateScore</p>
                <input placeholder="entranceCertificateScore" className="form-control" name="item.entranceCertificateScore" id="item.entranceCertificateScore" value={item.entranceCertificateScore} onChange={onChange}/>
                
                <div className="form-check">
                    <input placeholder="leaveSchool" className="form-check-input" name="item.leaveSchool" id="item.leaveSchool" type="checkbox" checked={item.leaveSchool} onChange={onChange} />
                    <label className="form-check-label">
                        Leave School
                    </label>
                </div>
                
                <p>leaveReason</p>
                <textarea placeholder="leaveReason" className="form-control" name="item.leaveReason" id="item.leaveReason" value={item.leaveReason} onChange={onChange}/>
                <div className="form-check">
                    <input placeholder="educationFinished" className="form-check-input" name="item.educationFinished" id="item.educationFinished" type="checkbox" checked={item.educationFinished} onChange={onChange}/>    
                    <label className="form-check-label">
                        Education Finished
                    </label>
                </div>
                <p>graduationDateMts</p>
                <input placeholder="graduationDateMts" className="form-control" name="item.graduationDateMts" id="item.graduationDateMts" type="date" value={getInputReadableDate(new Date(item.graduationDateMts))} onChange={onChange}/>
                <p>certificateNumberMts</p>
                <input placeholder="certificateNumberMts" className="form-control" name="item.certificateNumberMts" id="item.certificateNumberMts" value={item.certificateNumberMts} onChange={onChange}/>
                <p>seniorLevelSchool</p>
                <input placeholder="seniorLevelSchool" className="form-control" name="item.seniorLevelSchool" id="item.seniorLevelSchool" value={item.seniorLevelSchool} onChange={onChange}/>
                <p>graduationDateMa</p>
                <input placeholder="graduationDateMa" className="form-control" name="item.graduationDateMa" id="item.graduationDateMa" type="date" value={getInputReadableDate(new Date(item.graduationDateMa))} onChange={onChange}/>
                <p>certificateNumberMa</p>
                <input placeholder="certificateNumberMa" className="form-control" name="item.certificateNumberMa" id="item.certificateNumberMa" value={item.certificateNumberMa} onChange={onChange}/>
                <p>graduationCeremonyDate</p>
                <input placeholder="graduationCeremonyDate" className="form-control" name="item.graduationCeremonyDate" id="item.graduationCeremonyDate" type="date" value={getInputReadableDate(new Date(item.graduationCeremonyDate))} onChange={onChange}/>
                <p>highEducationUniv</p>
                <input placeholder="highEducationUniv" className="form-control" name="item.highEducationUniv" id="item.highEducationUniv" value={item.highEducationUniv} onChange={onChange}/>
                <p>highEducationMajor</p>
                <input placeholder="highEducationMajor" className="form-control" name="item.highEducationMajor" id="item.highEducationMajor" value={item.highEducationMajor} onChange={onChange}/>
                <p>workDate</p>
                <input placeholder="workDate" className="form-control" name="item.workDate" id="item.workDate" type="date" value={getInputReadableDate(new Date(item.workDate))} onChange={onChange}/>
                <p>workCompany</p>
                <input placeholder="workCompany" className="form-control" name="item.workCompany" id="item.workCompany" value={item.workCompany} onChange={onChange}/>

                <p></p>
                <input className="btn btn-primary" value="Save" type="submit" />
            </form>
        </div>
    )
}
