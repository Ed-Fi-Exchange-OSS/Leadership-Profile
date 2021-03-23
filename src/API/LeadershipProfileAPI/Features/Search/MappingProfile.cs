using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Search
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<StaffSearch, List.SearchResult>()
                .ForMember(d => d.StaffUsi, o => o.MapFrom(x => x.StaffUsi))
                .ForMember(d => d.StaffUniqueId, o => o.MapFrom(x => x.StaffUniqueId))
                .ForMember(d => d.FirstName, o => o.MapFrom(x => x.FirstName))
                .ForMember(d => d.MiddleName, o => o.MapFrom(x => x.MiddleName))
                .ForMember(d => d.LastSurName, o => o.MapFrom(x => x.LastSurname))
                .ForMember(d => d.FullName, o => o.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurname)))
                .ForMember(d => d.YearsOfService, o => o.MapFrom(x => x.YearsOfService))
                .ForMember(d => d.Assignment, o => o.MapFrom(x => x.Assignment))
                .ForMember(d => d.Certification, o => o.MapFrom(x => x.Certification))
                .ForMember(d => d.Degree, o => o.MapFrom(x => x.Degree))
                .ForMember(d => d.RatingCategory, o => o.MapFrom(x => x.RatingCategory))
                .ForMember(d => d.RatingSubCategory, o => o.MapFrom(x => x.RatingSubCategory))
                .ForMember(d => d.Rating, o => o.MapFrom(x => x.Rating));
        }

        private static string GetFullName(string firstName, string middleName, string lastName)
        {
            var fullName = firstName;

            if (!string.IsNullOrWhiteSpace(middleName))
            {
                fullName += " " + middleName;
            }

            fullName += " " + lastName;

            return fullName;
        }
    }
}
