using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models.ProfileSearchRequest
{
    public class ProfileSearchRequestRatings
    {
        public int CategoryId { get; set; }
        public string SubCategory { get; set; }
        public float Score { get; set; }
    }
}
