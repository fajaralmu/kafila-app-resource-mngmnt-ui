
import BaseModel from './BaseModel';
import Student from './Student';
import ClassLevel from './ClassLevel';
export default class ClassMember extends BaseModel{
    student: Student = new Student();
    classLevel: ClassLevel = new ClassLevel();
}