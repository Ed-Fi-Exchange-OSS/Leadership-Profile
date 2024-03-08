using System.Text.Json.Serialization;
using LeadershipProfile.Domain.Entities;

namespace LeadershipProfile.Application.Search.Queries;

public class SearchResultDto
{
            public string? StaffUniqueId { get; set; }
            public string? FirstName { get; set; }
            [JsonPropertyName("lastSurname")] public string? LastSurName { get; set; }
            public string? FullName { get; set; }
            public decimal YearsOfService { get; set; }
            public string? Assignment { get; set; }
            public string? Degree { get; set; }
            public string? Institution { get; set; } = "Default Institution";
            public bool InterestedInNextRole { get; set; } = false;


    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<StaffSearch, SearchResultDto>();
        }
    }
}
