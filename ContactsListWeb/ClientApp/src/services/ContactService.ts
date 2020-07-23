import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../src/environments/environment';
import { Contact } from '../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  appUrl: string;
  apiUrl: string;
  dataService: HttpClient;
  vm: any;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };

  constructor(private http: HttpClient) {
    this.appUrl = environment.appUrl;
    this.apiUrl = 'api/Contacts/';
    this.dataService = http;
    this.vm = this;
  }  
  
  getContacts(): Observable<Contact[]> {
    return this.dataService.get<Contact[]>(this.appUrl + this.apiUrl)
      .pipe(retry(1), catchError(this.errorHandler)
    );
  }

  getContact(contactId: number): Observable<Contact> {
    return this.dataService.get<Contact>(this.appUrl + this.apiUrl + contactId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  saveContact(contact): Observable<Contact> {
    return this.dataService.post<Contact>(this.appUrl + this.apiUrl, JSON.stringify(contact), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateContact(contactId: number, contact): Observable<Contact> {
    return this.dataService.put<Contact>(this.appUrl + this.apiUrl + contactId, JSON.stringify(contact), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  //deleteBlogPost(postId: number): Observable<BlogPost> {
  //  return this.dataService.delete<BlogPost>(this.myAppUrl + this.myApiUrl + postId)
  //    .pipe(
  //      retry(1),
  //      catchError(this.errorHandler)
  //    );
  //}



  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
