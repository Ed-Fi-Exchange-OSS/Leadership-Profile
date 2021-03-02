using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.UserClaims
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<StaffAdmin, List.TeacherRoleProfile>()
                .ForMember(d => d.Id, o => o.MapFrom(x => x.Id))
                .ForMember(d => d.StaffUsi, o => o.MapFrom(x => x.StaffUsi))
                .ForMember(d => d.StaffUniqueId, o => o.MapFrom(x => x.StaffUniqueId))
                .ForMember(d => d.FirstName, o => o.MapFrom(x => x.FirstName))
                .ForMember(d => d.MiddleName, o => o.MapFrom(x => x.MiddleName))
                .ForMember(d => d.LastSurName, o => o.MapFrom(x => x.LastSurName))
                .ForMember(d => d.Location, o => o.MapFrom(x => x.Location))
                .ForMember(d => d.FullName, o => o.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurName)))
                .ForMember(d => d.IsAdmin, o => o.MapFrom(x => x.IsAdmin))
                .ForMember(d => d.Username, o => o.MapFrom(x => x.TpdmUsername));
        }

        private static string GetFullName(string firstName, string middleName, string lastName)
        {
            return $"{firstName}{(!string.IsNullOrWhiteSpace(middleName) ? $" {middleName} " : string.Empty)}{lastName}";
        }
    }
}
