﻿using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ProfileList, List.TeacherProfile>()
                .ForMember(dst => dst.Id, opt => opt.Ignore())
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurName)))
                .ForMember(dst => dst.YearsOfService, opt => opt.MapFrom(x => x.YearsOfService.HasValue ? decimal.ToInt32(x.YearsOfService.Value) : 0));

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
                .ForMember(dst => dst.CompetencyCategories, opt => opt.Ignore());

            CreateMap<ProfilePositionHistory, Get.PositionHistory>()
                .ForMember(dst => dst.SchoolName, opt => opt.MapFrom(x => x.School));

            CreateMap<ProfileCertification, Get.Certificate>()
                .ForMember(dst => dst.Type, opt => opt.MapFrom(x => x.CredentialType))
                .ForMember(dst => dst.ValidFromDate, opt => opt.MapFrom(x => x.IssuanceDate))
                .ForMember(dst => dst.ValidToDate, opt => opt.MapFrom(x => x.ExpirationDate));

            CreateMap<ProfileEducation, Get.TeacherEducation>()
                .ForMember(dst => dst.Institution, opt => opt.Ignore())
                .ForMember(dst => dst.Degree, opt => opt.MapFrom(x => x.MajorSpecialization))
                .ForMember(dst => dst.Specialization, opt => opt.MapFrom(x => x.MinorSpecialization))
                .ForMember(dst => dst.GraduationDate, opt => opt.MapFrom(x => x.EndDate));

            CreateMap<ProfileProfessionalDevelopment, Get.ProfessionalDevelopment>()
                .ForMember(dst => dst.CourseName, opt => opt.MapFrom(x => x.ProfessionalDevelopmentTitle))
                .ForMember(dst => dst.Date, opt => opt.MapFrom(x => x.AttendanceDate))
                .ForMember(dst => dst.Location, opt => opt.Ignore())
                .ForMember(dst => dst.AlignmentToLeadership, opt => opt.Ignore());

            CreateMap<ProfileCompetencies, Get.CompetencyRatings>()
                .ForMember(dst => dst.Categories, opt => opt.MapFrom(x => x.ProfileCriterias));

            CreateMap<ProfileCriteria, Get.Category>()
                .ForMember(dst => dst.CategoryTitle, opt => opt.MapFrom(x => x.CriteriaTitle))
                .ForMember(dst => dst.SubCatCriteria, opt => opt.MapFrom(x => x.ProfileSubCriteria));

            CreateMap<ProfileSubCriteria, Get.SubCriteria>()
                .ForMember(dst => dst.DistrictAvg, opt => opt.MapFrom(x => x.districtAvg))
                .ForMember(dst => dst.DistrictMax, opt => opt.MapFrom(x => x.districtMax))
                .ForMember(dst => dst.DistrictMin, opt => opt.MapFrom(x => x.districtMin))
                .ForMember(dst => dst.StaffScore, opt => opt.MapFrom(x => x.staffScore))
                .ForMember(dst => dst.StaffScoreNotes, opt => opt.MapFrom(x => x.staffScoreNotes))
                .ForMember(dst => dst.SubCatNotes, opt => opt.MapFrom(x => x.subCatNotes))
                .ForMember(dst => dst.SubCatTitle, opt => opt.MapFrom(x => x.subCatTitle));
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
