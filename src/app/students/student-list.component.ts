import { Component, OnInit} from '@angular/core';
import { StudentService } from './student.services';
import { Student } from './student';
import { stringify } from 'querystring';

@Component ({
  selector: 'students',
templateUrl: './student-list.component.html',
styleUrls: ['./student-list.component.css']
})

export class StudentListComponent implements OnInit{
    pageTitle: string = 'Students List:';
    errorMessage: string;
    studentsData: Student[] = [];
    colors = [{ status: "Max", color: "green" }, { status: "Min", color: "red" }, { status: "Default", color: "default" }]
    subjects = ["Math", "History", "Science", "English"];
    _reload = true;

    // This sets up from input and add to the []studentsData via addStudent() method
    studentName: string;
    math: string;
    history: string;
    science: string;
    english: string;
    
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
      let student = this.studentsData[_id-1];
      student.grades.forEach(grade => { 
        if (grade.split(" ",3)[2].toLocaleUpperCase()==='A')
          sum = sum+4;
        else if (grade.split(" ",3)[2].toLocaleUpperCase()==='B')
          sum +=3;
        else if (grade.split(" ",3)[2].toLocaleUpperCase()==='C')
          sum +=2;
        else if (grade.split(" ",3)[2].toLocaleUpperCase()==='D')
          sum +=1;
        
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

      addStudent() : void{
        this.studentsData.push({
          "_id": this.studentsData.length+1,
          "name": this.studentName,
          "grades": [this.math, this.history, this.science, this.english],
          "img" : "",
          "gender": "",
          "birthday" : "",
          "athlete": null,
          "grade" : 0
        })
        this.studentName='';
        this.math ='';
        this.history='';
        this.science='';
        this.english='';
        this.collectGPA();

        this.reload();
        
      }
      
}