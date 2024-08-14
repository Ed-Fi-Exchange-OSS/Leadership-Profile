namespace LeadershipProfile.Domain.Entities;
public class ActiveStaff
{
    public int StaffUsi { get; set; }
    public string? StaffUniqueId { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastSurname { get; set; }
    public decimal? Rating { get; set; }
    public decimal? YearsOfService { get; set; }
    public bool? RetirementEligibility { get; set; }
    public decimal? YearsToRetirement { get; set; }
    public int? Age { get; set; }
    public string? NameOfInstitution { get; set; }
    public string? SchoolCategory { get; set; }
    public string? PositionTitle { get; set; }

}
