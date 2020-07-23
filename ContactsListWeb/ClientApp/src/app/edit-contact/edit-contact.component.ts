import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/ContactService';
import { Contact } from '../../model/contact';
import * as moment from "moment";

@Component({
  selector: 'app-contact-add-edit',
  templateUrl: './edit-contact.component.html'  
})
export class ContactsAddEditComponent implements OnInit {
  form: FormGroup;
  actionType: string;
  formFirstName: string;
  formSurname: string;
  contactId: number;
  formDateOfBirth: string;
  formEmail: string;
  errorMessage: string;
  existingContact: Contact;
  existingDOB: any;
  errors: any;

  constructor(private contactService: ContactService, private formBuilder: FormBuilder, private avRoute: ActivatedRoute, private router: Router) {
    const idParam = 'id';
    this.actionType = 'Add';
    this.formFirstName = 'firstName';
    this.formSurname = 'surname';
    this.formDateOfBirth = 'dateOfBirth'
    this.formEmail = 'email'
    if (this.avRoute.snapshot.params[idParam]) {
      this.contactId = this.avRoute.snapshot.params[idParam];
    }

    this.form = this.formBuilder.group(
      {
        contactId: 0,
        firstName: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        dateOfBirth: ['',[Validators.required]],
        email: ['', [Validators.required]]        
      }
    )
  }

  ngOnInit() {

    if (this.contactId > 0) {
      this.actionType = 'Edit';   

      this.contactService.getContact(this.contactId)
        .subscribe(data => (
          this.existingContact = data,         
          this.form.controls[this.formFirstName].setValue(data.FirstName),          
          this.form.controls[this.formSurname].setValue(data.Surname),
          this.existingDOB = moment(data.DateOfBirth, "DD/MM/YYYY").toLocaleString(),
          //console.log(this.existingDOB),          
          this.form.controls[this.formDateOfBirth].setValue(this.existingDOB),
          this.form.controls[this.formEmail].setValue(data.Email)
        ));
     
    }
  }

  save() {
    if (!this.form.valid) {
      return;
    }

    if (this.actionType === 'Add') {
      let contact: Contact = {      
        DateOfBirth: this.form.get(this.formDateOfBirth).value,
        Email: this.form.get(this.formEmail).value,
        FirstName: this.form.get(this.formFirstName).value,
        Surname: this.form.get(this.formSurname).value
      };

      this.contactService.saveContact(contact)
        .subscribe((data) => {
          this.router.navigate(['/Contacts', data.ContactId]);
        });
    }

    if (this.actionType === 'Edit') {
      let contact: Contact = {
        ContactId: this.existingContact.ContactId,
        DateOfBirth: this.form.get(this.formDateOfBirth).value,
        FirstName: this.form.get(this.formFirstName).value,
        Surname: this.form.get(this.formSurname).value,
        Email: this.form.get(this.formEmail).value
      };
      this.contactService.updateContact(contact.ContactId, contact)
        .subscribe((data) => {
          this.router.navigate([this.router.url]);
          
        },
        error => {
          this.errors = error;
          
          console.log("Test this error sections gets hit...");
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  get firstName() { return this.form.get(this.formFirstName); }
  get surname() { return this.form.get(this.formSurname); }
  get email() { return this.form.get(this.formEmail); }
  get dateOfBirth() { return this.form.get(this.formDateOfBirth); }
}
