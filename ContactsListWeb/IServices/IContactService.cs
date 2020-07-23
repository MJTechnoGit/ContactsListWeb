using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactsListWeb.IServices
{
    public interface IContactService
    {
        string FirstName { get; set; }
        string Surname { get; set; }
        DateTime DateOfBirth { get; set; }
        string Email { get; set; }
    }
}
