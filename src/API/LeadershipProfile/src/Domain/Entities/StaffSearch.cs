namespace LeadershipProfile.Domain.Entities;
public class StaffSearch
{
    public int StaffUsi { get; set; }
    public string? StaffUniqueId { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastSurname { get; set; }
    public string? FullName { get; set; }
    public decimal? YearsOfService { get; set; }
    public string? Assignment { get; set; }
    public bool IsActive { get; set; }
    public string? Degree { get; set; }
    public string? Institution { get; set; }
    public string? Email { get; set; }
    public string? Telephone { get; set; }
    public bool? InterestedInNextRole { get; set; } = false;

}
