import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ContactService } from '../../services/ContactService';
import { Contact } from '../../model/Contact';

@Component({
  selector: 'app-get-contact',
  templateUrl: './get-contact.component.html'
  //styleUrls: ['./blog-post.component.scss']
})
export class GetContactComponent implements OnInit {
  contact$: Observable<Contact>;
  contactId: number;

  constructor(private contactService: ContactService, private avRoute: ActivatedRoute) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.contactId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.loadContact();
  }

  loadContact() {
    this.contact$ = this.contactService.getContact(this.contactId);
  }
}
