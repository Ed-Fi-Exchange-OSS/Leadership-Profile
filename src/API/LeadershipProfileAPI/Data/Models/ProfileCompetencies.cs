using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class ProfileCompetencies
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public ProfileCriteria[] ProfileCriterias { get; set; }
    }
    public class ProfileCriteria
    {
        public string CriteriaTitle { get; set; }
        public ProfileSubCriteria[] ProfileSubCriteria { get;set;}
    }
    public class ProfileSubCriteria
    {
        public string subCatTitle { get; set; }
        public string subCatNotes { get; set; }
        public double districtMin { get; set; }
        public double districtMax { get; set; }
        public double districtAvg { get; set; }
        public double staffScore { get; set; }
        public string staffScoreNotes { get; set; }
    }
}
