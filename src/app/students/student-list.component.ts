import { Component, OnInit} from '@angular/core';
import { StudentService } from './student.services';
import { Student } from './student';
import { stringify } from 'querystring';
import { NgForm } from '@angular/forms';

@Component ({
  selector: 'students',
templateUrl: './student-list.component.html',
styleUrls: ['./student-list.component.css']
})

export class StudentListComponent implements OnInit{
    pageTitle: string = 'Internship Coding Challenge by RipeMetrics';
    errorMessage: string;
    studentsData: Student[] = [];
    colors = [{ status: "Max", color: "#81F781" }, { status: "Min", color: "#FA5858" }, { status: "Default", color: "default" }]
    subjects = ["Math", "History", "Science", "English"];
    _reload = true;
    form: NgForm;

    // This sets up from input and add to the []studentsData via addStudent() method
    studentName: string = null;
    math: string = null;
    history: string = null;
    science: string = null;
    english: string = null;
    
    private arrGPA: number[] = [];
    
    
      constructor(private studentService: StudentService) {    
      }

      ngOnInit(){
        this.studentService.getStudents().subscribe({
          next: res => {this.studentsData = res;
            this.collectGPA();          
        },
          error: err => this.errorMessage = err,
        });
      }

      private reload() {
          setTimeout(() => this._reload = false);
          setTimeout(() => this._reload = true);
      }

      collectGPA() : void{
        this.arrGPA.splice(0,this.arrGPA.length)
        for (let i=1; i<=this.studentsData.length;i++)
        {
          this.arrGPA.push(this.calculateGPA(i));
        }
      }

      calculateGPA(_id: number) : number {
      let sum=0;
      let increment=0;
      let student = this.studentsData[_id-1];
      student.grades.forEach(item => { 
          switch(item.split(" ",3)[2]){
            case 'A': increment=4;break;
            case 'B': increment=3;break;
            case 'C': increment=2;break;
            case 'D': increment=1;break;
            default : increment=0;
          }
          sum+=increment;
        });
      return sum/this.subjects.length;
    }

      getColor(_id) {
        let status = "Default";
        if(this.isMaxGPA(_id)) status = "Max";
        if(this.isMinGPA(_id)) status = "Min";

        return this.colors.filter(item => item.status === status)[0].color 
     }

     getGrade(student : Student, subject: string): string {
      let result = null;  
      student.grades.forEach(item => {
          if(item.split(" ",1)[0] === subject)
          result= item.split(" ",3)[2];
        });
      return result;
     }

      isMaxGPA(i) : boolean{
        if(this.arrGPA[i-1]===Math.max(...this.arrGPA))
          return true ;
        
      }

      isMinGPA(i) : boolean{
        if(this.arrGPA[i-1]===Math.min(...this.arrGPA))
          return true;
      }

      addStudent(isFormValid: boolean) : void{

        if(isFormValid){
          this.studentsData.push({
            "_id": this.studentsData.length+1,
            "name": this.studentName,
            "grades": ["Math - "+this.math, "History - "+this.history, "Science - "+this.science, "English - "+this.english],
            "img" : "",
            "gender": "",
            "birthday" : "",
            "athlete": null,
            "grade" : 0
          })
          this.collectGPA();
          this.reload();
          this.resetForm();
        }

      }

      resetForm(){
        setTimeout(() => {
          this.studentName = null,
          this.math = null;
          this.history = null;
          this.science = null;
          this.english = null;
        }, 100);
      }
      
      
}