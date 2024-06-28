using LeadershipProfile.Domain.Entities;

namespace LeadershipProfile.Application.IdentifyLeaders.Queries.GetLeadersWithPagination;

public class LeaderBriefDto
{
       public string? StaffUniqueId {get; set;}
    // [Key]
    public String? FullName { get; set; }
    public string? NameOfInstitution { get; set; }
    public Double SchoolYear { get; set; }
    public string? SchoolLevel { get; set; }
    public string? Job { get; set; }
    public string? PositionTitle { get; set; }
    public string? EmployeeID { get; set; }
    public DateTime StartDate { get; set; }
    public string? VacancyCause { get; set; }
    public string? TotalYearsOfExperience { get; set; }
    public string? Gender { get; set; }
    public string? Race { get; set; }
    public Double OverallScore { get; set; }
    public Double Domain1 { get; set; }
    public Double Domain2 { get; set; }
    public Double Domain3 { get; set; }
    public Double Domain4 { get; set; }
    public Double Domain5 { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<LeaderSearch, LeaderBriefDto>();
        }
    }
}
