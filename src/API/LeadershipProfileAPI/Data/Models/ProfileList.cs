using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class ProfileList
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastSurName { get; set; }
        public string Location { get; set; }
        public string Institution { get; set; }
        public decimal? YearsOfService { get; set; }
        public string HighestDegree { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public string Telephone { get; set; }
        public string Major { get; set; }
    }
}
