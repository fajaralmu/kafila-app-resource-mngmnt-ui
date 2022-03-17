import BaseModel from "./BaseModel";
import School from "./School";
import User from "./User";

export default class Employee extends BaseModel {
    nisdm: string; 
    profileImage: string; 
    user: User = new User();
 
    noKk: string; 
    noKtp: string; 
    addressKtp: string; 
    addressOther: string;
 
    motherName: string; 
    fatherName: string;
 
    npwp: string; 
    bankAccountNumber: string;
 
	educations: Education[] = [];
	schools: School[] = [];
 
    photoScan: string; 
    kkScan: string; 
    npwpScan: string; 
    bankAccountScan: string;

    signatureFile: string;

    active: boolean;

    removeEducation = (id:number) => { 
        for (let i = 0; i < this.educations.length; i++) {
            const element = this.educations[i];
            if (element.id === id)
            {
                this.educations.splice(i, 1);
                break;
            }
        }
    }
    addSchool = (school:School) => {
        for (let i = 0; i < this.schools.length; i++) {
            const element = this.schools[i];
            if (element.id === school.id)
            {
                console.warn("duplicate school id: " + school.id);
                return false;
            }
        }

        this.schools.push(school);
        return true;
    }
    removeSchool = (id:number) => { 
        for (let i = 0; i < this.schools.length; i++) {
            const element = this.schools[i];
            if (element.id === id)
            {
                this.schools.splice(i, 1);
                break;
            }
        }
    }
}

export class Education  extends BaseModel {
    type: string = "S1"; 
    name: string; 
    major: string;
    title: string;
    certificateScan: string;
}