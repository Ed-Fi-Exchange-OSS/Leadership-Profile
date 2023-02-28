using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Vacancy
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<StaffSearch, List.SearchResult>()
                .ForMember(d => d.FullName, o => o.MapFrom(x => GetFullName(x.FirstName, null, x.LastSurname)));
        }

        private static string GetFullName(string firstName, string middleName, string lastName)
        {
            return $"{firstName}{(!string.IsNullOrWhiteSpace(middleName) ? $" {middleName} " : " ")}{lastName}";
        }
    }
}
