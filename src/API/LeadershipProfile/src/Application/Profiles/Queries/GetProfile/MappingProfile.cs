using System;
using LeadershipProfile.Domain.Entities;


namespace LeadershipProfile.Application.Profiles.Queries.GetProfile;

    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {

            CreateMap<ProfileHeader, Response>()
                .ForMember(dst => dst.Certificates, opt => opt.Ignore())
                .ForMember(dst => dst.PositionHistory, opt => opt.Ignore())
                .ForMember(dst => dst.ProfessionalDevelopment, opt => opt.Ignore())
                .ForMember(dst => dst.InterestedInNextRole, opt => opt.MapFrom(x => false))
                .ForMember(dst => dst.LastName, opt => opt.MapFrom(x => x.LastSurname))
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x.FirstName ?? "", x.MiddleName ?? "", x.LastSurname ?? "")))
                .ForMember(dst => dst.District, opt => opt.MapFrom(x => x.Location))
                .ForMember(dst => dst.Phone, opt => opt.MapFrom(x => x.Telephone))
                .ForMember(dst => dst.CurrentPosition, opt => opt.MapFrom(x => x.Position))
                .ForMember(dst => dst.Evaluations, opt => opt.Ignore());

            CreateMap<ProfilePositionHistory, PositionHistory>()
                .ForMember(dst => dst.SchoolName, opt => opt.MapFrom(x => x.School));

            CreateMap<ProfileCertification, Certificate>()
                .ForMember(dst => dst.Type, opt => opt.MapFrom(x => x.CredentialType))
                .ForMember(dst => dst.ValidFromDate, opt => opt.MapFrom(x => x.IssuanceDate))
                .ForMember(dst => dst.ValidToDate, opt => opt.MapFrom(x => x.ExpirationDate));

            CreateMap<StaffProfessionalDevelopment, ProfessionalDevelopment>()
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
