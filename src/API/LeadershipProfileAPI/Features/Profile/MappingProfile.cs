using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ProfileList, List.TeacherProfile>()
                .ForMember(dst => dst.Id, opt => opt.Ignore())
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => string.Join(" ", x.FirstName, x.MiddleName, x.LastSurName)));
        }
    }
}
