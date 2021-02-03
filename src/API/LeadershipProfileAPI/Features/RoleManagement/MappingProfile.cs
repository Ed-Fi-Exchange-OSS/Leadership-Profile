using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.RoleManagement
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ProfileList, List.TeacherRoleProfile>()
                .ForMember(dst => dst.Id, opt => opt.Ignore())
                .ForMember(dst => dst.FullName,
                    opt => opt.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurName)))
                .ForMember(dst => dst.Admin, opt => opt.Ignore())
                .ForMember(dst => dst.Username, opt => opt.Ignore());
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
