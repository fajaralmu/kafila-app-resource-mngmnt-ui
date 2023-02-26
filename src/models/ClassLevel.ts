
import BaseModel from './BaseModel';
import School from './School';
export default class ClassLevel extends BaseModel {
  level: number = 1;
  letter: string = "A";
  description: string = "";
  school: School;

  semester: number = 1;
  year: string = "";
  semesterActive: boolean;
  memberCount: number = 0;
}