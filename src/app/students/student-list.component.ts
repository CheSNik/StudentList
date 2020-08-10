import { Component, OnInit} from '@angular/core';
import { ProductService } from './student.services';

@Component ({
  selector: 'pm-products',
templateUrl: './student-list.component.html',
styleUrls: ['./student-list.component.css']
})

export class ProductListComponent implements OnInit{
    pageTitle: string = 'Students List:';
    errorMessage: string;
    studentsData: any;
    colors = [{ status: "Max", color: "green" }, { status: "Min", color: "red" }, { status: "Default", color: "default" }]
    public _reload = true;

    // This sets up from input and add to the []studentsData via addStudent() method
    studentName: string;
    math: string;
    history: string;
    science: string;
    english: string;
    
    private _arrGPA: number[] = [];
    get arrGPA(): number[] {
      return this._arrGPA;
    }
    set arrGPA(value: number[]) {
      this._arrGPA.push();
    }
    
      constructor(private productService: ProductService) {    
      }

      ngOnInit(){
        this.productService.getProducts().subscribe({
          next: res => {this.studentsData = res;
            this.studentsData= JSON.parse(JSON.stringify(res));
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
        for (let i=1; i<=this.studentsData.data.length;i++)
        {
          this.arrGPA.push(this.calculateGPA(i));
        }
      }

      calculateGPA(_id: number) : number {
      let counter =0;
      let sum=0;
      this.studentsData.data[_id-1].grades.forEach(element => { 
        if (element.substring(element.length-1, element.length).toLocaleUpperCase()==='A'){
          sum = sum+4;
          counter++;
        }
        else if (element.substring(element.length-1, element.length).toLocaleUpperCase()==='B'){
          sum = sum+3;
          counter++;
        }
        else if (element.substring(element.length-1, element.length).toLocaleUpperCase()==='C'){
          sum = sum+2;
          counter++;
        }
        else if (element.substring(element.length-1, element.length).toLocaleUpperCase()==='D'){
          sum = sum+1;
          counter++;
        }
        else if (element.substring(element.length-1, element.length).toLocaleUpperCase()==='F'){
          sum = sum+0;
          counter++;
        }
    });
      return sum/counter;
      }

      getColor(_id) {
        let status = "Default";
        if(this.isMaxGPA(_id)) status = "Max";
        if(this.isMinGPA(_id)) status = "Min";

        return this.colors.filter(item => item.status === status)[0].color 
     }

      isMaxGPA(i) : boolean{
        if(this.arrGPA[i-1]===Math.max(...this.arrGPA)){
          return true ;
        }
        else {
          return false ;
        }
      }

      isMinGPA(i) : boolean{
        if(this.arrGPA[i-1]===Math.min(...this.arrGPA)){
          return true ;
        }
        else {
          return false ;
        }
      }

      addStudent() : void{
        this.studentsData.data.push({
          "_id": this.studentsData.data.length+1,
          "name": this.studentName,
          "grades": [this.math, this.history, this.science, this.english],
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