using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffPerformanceMeasure
    {
        public int StaffUsi { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public int Year { get; set; }
        public decimal DistrictMin { get; set; }
        public decimal DistrictMax { get; set; }
        public decimal DistrictAvg { get; set; }
        public decimal Score { get; set; }
        public DateTime MeasureDate { get; set; }
    }
}
