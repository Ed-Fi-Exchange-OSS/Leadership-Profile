namespace LeadershipProfileAPI.Data.Models
{
    public class StaffSearch
    {
        public int StaffUsi { get; set; }
        public string StaffUniqueId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastSurname { get; set; }
        public string FullName { get; set; }
        public int? YearsOfService { get; set; }
        public string Certification { get; set; }
        public string Assignment { get; set; }
        public string Degree { get; set; }
        public string RatingCategory { get; set; }
        public string RatingSubCategory { get; set; }
        public decimal? Rating { get; set; }
        public string Institution { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string Major { get; set; }
    }
}
