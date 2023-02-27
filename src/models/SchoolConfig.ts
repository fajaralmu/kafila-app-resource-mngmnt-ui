
import BaseModel from './BaseModel';
import SemesterPeriod from './SemesterPeriod';
import School from './School';
import Employee from './Employee';
export default class SchoolConfig extends BaseModel {
  period: SemesterPeriod;
  school: School;
  admin: Employee;
  headMaster: Employee;
  headTahfiz: Employee;
}