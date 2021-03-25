using System;
using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ProfileList, List.TeacherProfile>()
                .ForMember(dst => dst.Id, opt => opt.MapFrom(x => Guid.NewGuid())) // Create Guid until Staff.Id is available from the vw_LeadershipProfileList
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurName)))
                .ForMember(dst => dst.YearsOfService, opt => opt.MapFrom(x => x.YearsOfService.HasValue ? decimal.ToInt32(x.YearsOfService.Value) : 0))
                .ForMember(dst => dst.Email, opt => opt.MapFrom(x => x.Email))
                .ForMember(dst => dst.Telephone, opt => opt.MapFrom(x => x.Telephone));

            CreateMap<ProfileHeader, Get.Response>()
                .ForMember(dst => dst.Certificates, opt => opt.Ignore())
                .ForMember(dst => dst.Education, opt => opt.Ignore())
                .ForMember(dst => dst.PositionHistory, opt => opt.Ignore())
                .ForMember(dst => dst.ProfessionalDevelopment, opt => opt.Ignore())
                .ForMember(dst => dst.InterestedInNextRole, opt => opt.MapFrom(x => false))
                .ForMember(dst => dst.LastName, opt => opt.MapFrom(x => x.LastSurname))
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurname)))
                .ForMember(dst => dst.District, opt => opt.MapFrom(x => x.Location))
                .ForMember(dst => dst.Phone, opt => opt.MapFrom(x => x.Telephone))
                .ForMember(dst => dst.StartDate, opt => opt.Ignore())
                .ForMember(dst => dst.CurrentPosition, opt => opt.MapFrom(x => x.Position))
                .ForMember(dst => dst.PerformanceMeasures, opt => opt.Ignore());

            CreateMap<ProfilePositionHistory, Get.PositionHistory>()
                .ForMember(dst => dst.SchoolName, opt => opt.MapFrom(x => x.School));

            CreateMap<StaffCertificate, Get.Certificate>();

            CreateMap<StaffEducation, Get.TeacherEducation>()
                .ForMember(dst => dst.Institution, opt => opt.MapFrom(x => x.InstitutionAttended))
                .ForMember(dst => dst.Degree, opt => opt.MapFrom(x => x.DegreeAwarded))
                .ForMember(dst => dst.Specialization, opt => opt.MapFrom(x => x.MajorOrSpecialization));

            CreateMap<StaffProfessionalDevelopment, Get.ProfessionalDevelopment>();

            CreateMap<StaffPerformanceMeasure, Get.StaffMeasures>();
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
