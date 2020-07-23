using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ContactsListWeb.IServices;

namespace ContactsListWeb.Services
{
    public class ContactService : IContactService
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
    }
}
