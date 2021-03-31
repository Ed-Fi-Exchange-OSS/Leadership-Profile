using System;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffCertificate
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string Description { get; set; }
        public string CredentialType { get; set; }
        public DateTime IssuanceDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}