using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffAdmin
    {
        public Guid Id { get; set; }
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastSurName { get; set; }
        public string Location { get; set; }
        public string TpdmUsername { get; set; }
        public bool IsAdmin { get; set; }
    }
}
