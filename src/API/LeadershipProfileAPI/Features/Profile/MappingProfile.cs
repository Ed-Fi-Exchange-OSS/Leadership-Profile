using System;
using LeadershipProfileAPI.Data.Models;

namespace LeadershipProfileAPI.Features.Profile
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {

            CreateMap<ProfileHeader, Get.Response>()
                .ForMember(dst => dst.Certificates, opt => opt.Ignore())
                .ForMember(dst => dst.PositionHistory, opt => opt.Ignore())
                .ForMember(dst => dst.ProfessionalDevelopment, opt => opt.Ignore())
                .ForMember(dst => dst.InterestedInNextRole, opt => opt.MapFrom(x => false))
                .ForMember(dst => dst.LastName, opt => opt.MapFrom(x => x.LastSurname))
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x.FirstName, x.MiddleName, x.LastSurname)))
                .ForMember(dst => dst.District, opt => opt.MapFrom(x => x.Location))
                .ForMember(dst => dst.Phone, opt => opt.MapFrom(x => x.Telephone))
                .ForMember(dst => dst.StartDate, opt => opt.Ignore())
                .ForMember(dst => dst.CurrentPosition, opt => opt.MapFrom(x => x.Position))
                .ForMember(dst => dst.Competencies, opt => opt.Ignore())
                .ForMember(dst => dst.Category, opt => opt.Ignore())
                .ForMember(dst => dst.SubCategory, opt => opt.Ignore())
                .ForMember(dst => dst.ScoresByPeriod, opt => opt.Ignore());

            CreateMap<ProfilePositionHistory, Get.PositionHistory>()
                .ForMember(dst => dst.SchoolName, opt => opt.MapFrom(x => x.School));

            CreateMap<ProfileCertification, Get.Certificate>()
                .ForMember(dst => dst.Type, opt => opt.MapFrom(x => x.CredentialType))
                .ForMember(dst => dst.ValidFromDate, opt => opt.MapFrom(x => x.IssuanceDate))
                .ForMember(dst => dst.ValidToDate, opt => opt.MapFrom(x => x.ExpirationDate));

            //CreateMap<ProfileCompetency, Get.CompetencyRatings>()
            //    .ForMember(dst => dst.Categories, opt => opt.MapFrom(x => x.Categories));

            //CreateMap<ProfileCategory, Get.Category>()
            //    .ForMember(dst => dst.CategoryTitle, opt => opt.MapFrom(x => x.CategoryTitle))
            //    .ForMember(dst => dst.SubCatCriteria, opt => opt.MapFrom(x => x.SubCategories));

            //CreateMap<ProfileSubCategory, Get.SubCategory>()
            //    .ForMember(dst => dst.SubCatNotes, opt => opt.MapFrom(x => x.SubCatNotes))
            //    .ForMember(dst => dst.SubCatTitle, opt => opt.MapFrom(x => x.SubCatTitle))
            //    .ForMember(dst => dst.ScoresByPeriod, opt => opt.MapFrom(x => x.ScoresByPeriod));

            //CreateMap<ProfileScoresByPeriod, Get.ScoresByPeriod>()
            //    .ForMember(dst => dst.DistrictAvg, opt => opt.MapFrom(x => x.DistrictAvg))
            //    .ForMember(dst => dst.DistrictMax, opt => opt.MapFrom(x => x.DistrictMax))
            //    .ForMember(dst => dst.DistrictMin, opt => opt.MapFrom(x => x.DistrictMin))
            //    .ForMember(dst => dst.Period, opt => opt.MapFrom(x => x.Period))
            //    .ForMember(dst => dst.StaffScore, opt => opt.MapFrom(x => x.StaffScore))
            //    .ForMember(dst => dst.StaffScoreNotes, opt => opt.MapFrom(x => x.StaffScoreNotes));

            CreateMap<StaffProfessionalDevelopment, Get.ProfessionalDevelopment>()
                .ForMember(dst => dst.AttendanceDate, opt => opt.MapFrom(x => x.AttendanceDate))
                .ForMember(dst => dst.ProfessionalDevelopmentTitle, opt => opt.MapFrom(x => x.ProfessionalDevelopmentTitle))
                .ForMember(dst => dst.Location, opt => opt.MapFrom(x => x.Location))
                .ForMember(dst => dst.AlignmentToLeadership, opt => opt.MapFrom(x => x.AlignmentToLeadership));
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
