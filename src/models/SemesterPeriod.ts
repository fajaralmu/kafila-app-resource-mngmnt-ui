import BaseModel from "./BaseModel";
import Employee from "./Employee";

export default class SemesterPeriod extends BaseModel {
    semester: number = 1;
    year: string;

    active: boolean;

    direktur: Employee;
    bendahara: Employee;
    pengawasSekolah: Employee;
    headHRD: Employee;
    hearMR: Employee;
    headRnD: Employee;
    headLogistic: Employee;
    headPublicRelation: Employee;
    headLanguage: Employee;
    headPesantren: Employee;
    wakabidTahfiz: Employee;
    wakabidAsrama: Employee;

    //
    adminKiis: Employee;
    adminTahfiz: Employee;
    adminAsrama: Employee;

    //
    pjQurban: Employee;
    pjRamadhan: Employee;
    pjPromosiPSB: Employee;
    pjWebMedia: Employee;
    pjTamuFO: Employee;
    pjAlumni: Employee;
    pjUtsUas: Employee;
    pjEvaluasiPengembanganKurikulum: Employee;
    pjLabKomputer: Employee;
    pjLabIPA: Employee;
    pjLabBahasa: Employee;
    pjBinaPrestasi: Employee;
    pjPerpustakaan: Employee;
    pjBK: Employee;
    pjBahasaArab: Employee;
    pjBahasaInggris: Employee;
    pjUKS: Employee;
    pjOpkiis: Employee;
    pjDKM: Employee;
    pjKesiswaan: Employee;
    pjKurikulum: Employee;

    public static EmployeeFields = [
        'direktur', 'bendahara', 'pengawasSekolah', 'headHRD', 'hearMR', 'headRnD', 'headLogistic', 'headPublicRelation', 'headLanguage', 'headPesantren', 'wakabidTahfiz', 'wakabidAsrama', 
        'adminKiis', 'adminTahfiz', 'adminAsrama',
        'pjQurban', 'pjRamadhan', 'pjPromosiPSB', 'pjWebMedia', 'pjTamuFO', 'pjAlumni', 'pjUtsUas', 'pjEvaluasiPengembanganKurikulum', 'pjLabKomputer', 'pjLabIPA', 'pjLabBahasa', 'pjBinaPrestasi', 'pjPerpustakaan', 'pjBK', 'pjBahasaArab', 'pjBahasaInggris', 'pjUKS', 'pjOpkiis', 'pjDKM', 'pjKesiswaan', 'pjKurikulum'   ];
}