using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class ProfileCompetency
    {
        public int CompetencyId { get; set; }
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public ICollection<ProfileCategory> Categories { get; set; }
    }
    public class ProfileCategory
    {
        public int CategoryId { get; set; }
        public string CategoryTitle { get; set; }
        public ICollection<ProfileSubCategory> SubCategories { get; set; }
        public int CompetencyId { get; set; }
    }
    public class ProfileSubCategory
    {
        public int SubCategoryId { get; set; }
        public string SubCatTitle { get; set; }
        public string SubCatNotes { get; set; }
        public ICollection<ProfileScoresByPeriod> ScoresByPeriod { get; set; }
        public int CategoryId { get; set; }
    }
    public class ProfileScoresByPeriod
    {
        public int ScoresByPeriodId { get; set; }
        public double DistrictMin { get; set; }
        public double DistrictMax { get; set; }
        public double DistrictAvg { get; set; }
        public double StaffScore { get; set; }
        public string StaffScoreNotes { get; set; }
        public string Period { get; set; }
        public int SubCategoryId { get; set; }
    }
}