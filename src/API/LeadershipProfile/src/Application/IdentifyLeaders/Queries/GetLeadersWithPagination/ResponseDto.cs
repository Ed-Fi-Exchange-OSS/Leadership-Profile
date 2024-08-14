namespace LeadershipProfile.Application.IdentifyLeaders.Queries.GetLeadersWithPagination;

public class ResponseDto
{
    public required List<LeaderBriefDto> Staff { get; set; }
    public int? StaffCount { get; set; }
    public required ChartDataDto[] ChartsData { get; set; }
}
