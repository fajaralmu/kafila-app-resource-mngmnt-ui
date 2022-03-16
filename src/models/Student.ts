
import BaseModel from './BaseModel';
import User from './User';
export default class Student extends BaseModel {
    nisKiis: string;
    nisn: string;

    user: User = new User();

    address: string;

    city: string;
    province: string;

    /**
     * ===========================
     * Family
     * ===========================
     */

    siblingNum: number;
    siblingCount: number;
    // father
    fatherName: string;
    fatherBirthDate: Date;
    fatherBirthPlace: string;
    fatherEducation: string;
    fatherPhoneNumber: string;
    fatherOccupation: string;
    fatherAddress: string;
    fatherIncome: number;

    // mother
    motherName: string;
    motherBirthDate: Date;
    motherBirthPlace: string;
    motherEducation: string;
    motherPhoneNumber: string;
    motherOccupation: string;
    motherAddress: string;
    motherIncome: number;

    /**
     * ===========================
     * Academic
     * ===========================
     */
    originSchool: string;
    sttbNumber: string;
    entranceDate: Date;
    entranceClass: string;
    transferFrom: string;
    transferReason: string;
    entranceCertificateScore: string;
    leaveSchool: boolean;
    leaveReason: string;

    educationFinished: boolean;

    graduationDateMts: Date;
    certificateNumberMts: string;
    seniorLevelSchool: string;

    graduationDateMa: Date;
    certificateNumberMa: string;

    /**
     * =========================
     * Alumni
     * =========================
     */
    graduationCeremonyDate: Date;
    highEducationUniv: string;
    highEducationMajor: string;
    workDate: Date;
    workCompany: string;


}