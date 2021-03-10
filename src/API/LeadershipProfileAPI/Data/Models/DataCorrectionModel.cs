using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class DataCorrectionModel
    {
        public string StaffUniqueId { get; set; }
        public string UserFullName { get; set; }
        public string StaffEmail { get; set; }
        public string MessageSubject { get; set; }
        public string MessageDescription { get; set; }
    }
}
