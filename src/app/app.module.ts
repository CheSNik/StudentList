import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { ProductListComponent } from './students/student-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'students', component: ProductListComponent },
      { path: '', redirectTo: 'students', pathMatch: 'full' },
      { path: '**', redirectTo: 'students', pathMatch: 'full' }
    ])

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
