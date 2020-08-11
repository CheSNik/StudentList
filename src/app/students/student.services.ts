import { Injectable } from "@angular/core";
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Student } from './student';


@Injectable({
    providedIn: 'root'
})

export class StudentService {

    private studentstUrl = 'api/students/students.json'

constructor(private http: HttpClient) {  
}
    getStudents(): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(this.studentstUrl).pipe(
    map((data: any) => data.data ),
      catchError(() => { return throwError("Data has wrong format")})
);
    }

    private handleError(err: HttpErrorResponse) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
}
