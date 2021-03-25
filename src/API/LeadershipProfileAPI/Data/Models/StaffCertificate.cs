using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffCertificate
    {
        /// <summary>PK</summary>
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string Description { get; set; }
        public string CredentialType { get; set; }
        public DateTime IssuanceDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}