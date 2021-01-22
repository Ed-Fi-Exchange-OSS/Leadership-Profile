using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ProfileList, List.TeacherProfile>()
                .ForMember(dst => dst.Id, opt => opt.Ignore())
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x)))
                .ForMember(dst => dst.YearsOfService, opt => opt.MapFrom(x => x.YearsOfService.HasValue ? decimal.ToInt32(x.YearsOfService.Value) : 0));
        }

        private static string GetFullName(ProfileList pl)
        {
            var fullName = pl.FirstName;

            if (!string.IsNullOrWhiteSpace(pl.MiddleName))
            {
                fullName += " " + pl.MiddleName;
            }

            fullName += " " + pl.LastSurName;

            return fullName;
        }
    }
}
