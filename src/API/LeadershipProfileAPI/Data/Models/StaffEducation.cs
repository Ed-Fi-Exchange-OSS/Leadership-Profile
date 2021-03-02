using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Data.Models
{
    public class StaffEducation
    {
        /// <summary>PK</summary>
        public int StaffUsi { get; set; }

        /// <summary>PK</summary>
        public string TeacherPreparationProgramName { get; set; }

        public string StaffUniqueId { get; set; }
        public string DegreeType { get; set; }
        public string DegreeAwarded { get; set; }
        public string InstitutionAttended { get; set; }
        public string MajorOrSpecialization { get; set; }
        public string GPA { get; set; }
        public bool ProgramType { get; set; }
    }
}
