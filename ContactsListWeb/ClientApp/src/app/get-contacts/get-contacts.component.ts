import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ContactService } from '../../services/ContactService';
import { Contact } from '../../model/contact';

@Component({
  selector: 'app-get-contacts',
  templateUrl: './get-contacts.component.html'
  //styleUrls: ['./get-contact.component.scss']
})
export class GetContactsComponent implements OnInit {

  contacts$: Observable<Contact[]>;
  contactId: number;

  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    this.loadBlogPosts();
  }

  loadBlogPosts() {
    this.contacts$ = this.contactService.getContacts();
  }
}





