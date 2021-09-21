namespace LeadershipProfileAPI.Data.Models
{
    public class ProfileEvaluationObjective
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public int SchoolYear { get; set; }
        public int EvalNumber { get; set; }
        public string ObjectiveTitle { get; set; }
        public decimal Rating { get; set; }
    }

    public class ProfileEvaluationElement
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public int SchoolYear { get; set; }
        public int EvalNumber { get; set; }
        public string ElementTitle { get; set; }
        public string ObjectiveTitle { get; set; }
        public decimal Rating { get; set; }
    }
}
