namespace LeadershipProfile.Domain.Entities;
public class Staff
{
    public int StaffUSI { get; set; }
    public Guid Id { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string? StaffUniqueId { get; set; }
    public string? TpdmUsername { get; set; }
}
