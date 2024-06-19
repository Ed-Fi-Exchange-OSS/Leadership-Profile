namespace LeadershipProfile.Application.VacancyForecasts.Queries.GetVacancyForecasts;

public class VacancyForecast
{
    public required string StaffUniqueId { get; set; }
    public required String FullName { get; set; }
    public int? Age { get; set; }
    public required string NameOfInstitution { get; set; }
    public required string SchoolLevel { get; set; }
    public required string Gender { get; set; }
    public required string Race { get; set; }
    public required string VacancyCause { get; set; }
    public int SchoolYear { get; set; }
    public required string PositionTitle { get; set; }
    public Double OverallScore { get; set; }
}
