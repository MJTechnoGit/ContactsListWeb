import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
//import { HomeComponent } from './home/home.component';
//import { CounterComponent } from './counter/counter.component';
//import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { ContactsAddEditComponent } from './edit-contact/edit-contact.component';
import { GetContactComponent } from './get-contact/get-contact.component';
import { GetContactsComponent } from './get-contacts/get-contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ContactsAddEditComponent,
    GetContactComponent,
    GetContactsComponent   
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,   
    RouterModule.forRoot([
      { path: '', component: GetContactsComponent, pathMatch: 'full' },
      { path: 'contacts/:id', component: GetContactComponent },
      { path: 'add', component: ContactsAddEditComponent },
      { path: 'contacts/edit/:id', component: ContactsAddEditComponent },
      { path: '**', redirectTo: '/'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
