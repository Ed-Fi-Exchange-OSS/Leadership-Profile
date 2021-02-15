using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Features.Profile
{
    public static class Get
    {
        public class Query : IRequest<Response>
        {
            public string Id { get; set; }
        }

        public class Response
        {
            [JsonPropertyName("staffUniqueId")] public string StaffUniqueId { get; set; } = "12345";
            [JsonPropertyName("firstName")] public string FirstName { get; set; } = "First name";
            [JsonPropertyName("middleName")] public string MiddleName { get; set; } = "Middle";
            [JsonPropertyName("lastSurname")] public string LastName { get; set; } = "Last name";
            [JsonPropertyName("fullName")] public string FullName { get; set; } = "First Middle Last";
            public string CurrentPosition { get; set; } = "Default Position";
            public string District { get; set; } = "Default School District";
            public string School { get; set; } = "Default High School";
            public int YearsOfService { get; set; }
            public string Phone { get; set; } = "+12320103203";
            public string Email { get; set; } = "default@email.com";
            public DateTime? StartDate { get; set; }
            public bool InterestedInNextRole { get; set; }
            public TeacherEducation[] Education { get; set; }
            public PositionHistory[] PositionHistory { get; set; }
            public Certificate[] Certificates { get; set; }
            public ProfessionalDevelopment[] ProfessionalDevelopment { get; set; }
            public CompetencyRatings CompetencyCategories { get; set; }
        }

        public class CompetencyRatings
        {
            public Category[] Categories {get;set;}
        }
        public class Category
        {
            public string CategoryTitle { get; set; }
            public SubCriteria[] SubCatCriteria { get; set; }
        }
        public class SubCriteria
        {
            public string SubCatTitle { get; set; } = "Default Sub Category";
            public string SubCatNotes { get; set; } = "Default Note";
            public double DistrictMin { get; set; } = 0;
            public double DistrictMax { get; set; } = 0;
            public double DistrictAvg { get; set; } = 0;
            public double StaffScore { get; set; } = 0;
            public string StaffScoreNotes { get; set; } = "Default Note";
        }

        public class PositionHistory
        {
            public string Role { get; set; } = "Default Role";
            public string SchoolName { get; set; } = "Default School";
            public DateTime StartDate { get; set; }
            public DateTime? EndDate { get; set; }
        }

        public class Certificate
        {
            public string Description { get; set; } = "Default Certificate";
            public string Type { get; set; } = "Default Type";
            public DateTime ValidFromDate { get; set; }
            public DateTime ValidToDate { get; set; }
        }

        public class ProfessionalDevelopment
        {
            public string CourseName { get; set; } = "Default Course Name";
            public DateTime Date { get; set; }
            public string Location { get; set; } = "Default Location";
            public string AlignmentToLeadership { get; set; } = "Default Alignment";
        }

        public class TeacherEducation
        {
            public string Institution { get; set; } = "Default Institution";
            public string Degree { get; set; } = "Default Degree";
            public DateTime? GraduationDate { get; set; }
            public string Specialization { get; set; } = "Default Specialization";
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _ctx;
            private readonly IMapper _mapper;

            public QueryHandler(EdFiDbContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var profileHeader = await _ctx.ProfileHeader.FirstOrDefaultAsync(x => x.StaffUniqueId == request.Id, cancellationToken);

                if (profileHeader == null)
                {
                    return null;
                }

                var response = _mapper.Map<Response>(profileHeader);

                var positionHistory = await _ctx.ProfilePositionHistory.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider).ToArrayAsync(cancellationToken);

                response.PositionHistory = positionHistory;

                var certificates = await _ctx.ProfileCertification.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<Certificate>(_mapper.ConfigurationProvider).ToArrayAsync(cancellationToken);

                response.Certificates = certificates;

                var education = await _ctx.ProfileEducation.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<TeacherEducation>(_mapper.ConfigurationProvider).ToArrayAsync(cancellationToken);

                response.Education = education;

                var development = await _ctx.ProfileProfessionalDevelopment.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider).ToArrayAsync(cancellationToken);

                response.ProfessionalDevelopment = development;

                // Un comment when View is ready
                //var competency = await _ctx.ProfileCompetencies.Where(x => x.StaffUniqueId == request.Id)
                //    .ProjectTo<CompetencyRatings>(_mapper.ConfigurationProvider).ToArrayAsync(cancellationToken);


                var competency = new Get.CompetencyRatings();

                competency.Categories = new Get.Category[3];

                competency.Categories[0] = new Get.Category();
                competency.Categories[0].CategoryTitle = "Passion for Results";
                competency.Categories[0].SubCatCriteria = new Get.SubCriteria[5];

                competency.Categories[0].SubCatCriteria[0] = new Get.SubCriteria();
                competency.Categories[0].SubCatCriteria[0].SubCatTitle = "Achievement Oriented";
                competency.Categories[0].SubCatCriteria[0].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[0].SubCatCriteria[0].StaffScore = 4.0;
                competency.Categories[0].SubCatCriteria[0].DistrictAvg = 4.0;
                competency.Categories[0].SubCatCriteria[0].DistrictMax = 5.0;

                competency.Categories[0].SubCatCriteria[1] = new Get.SubCriteria();
                competency.Categories[0].SubCatCriteria[1].SubCatTitle = "Leading for Equitable Outcomes";
                competency.Categories[0].SubCatCriteria[1].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[0].SubCatCriteria[1].StaffScore = 4.25;
                competency.Categories[0].SubCatCriteria[1].DistrictAvg = 4.0;
                competency.Categories[0].SubCatCriteria[1].DistrictMax = 5.0;

                competency.Categories[0].SubCatCriteria[2] = new Get.SubCriteria();
                competency.Categories[0].SubCatCriteria[2].SubCatTitle = "Visionary Leadership";
                competency.Categories[0].SubCatCriteria[2].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[0].SubCatCriteria[2].StaffScore = 3.25;
                competency.Categories[0].SubCatCriteria[2].DistrictAvg = 4.0;
                competency.Categories[0].SubCatCriteria[2].DistrictMax = 5.0;

                competency.Categories[0].SubCatCriteria[3] = new Get.SubCriteria();
                competency.Categories[0].SubCatCriteria[3].SubCatTitle = "subCatTitle 4";
                competency.Categories[0].SubCatCriteria[3].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[0].SubCatCriteria[3].StaffScore = 4.25;
                competency.Categories[0].SubCatCriteria[3].DistrictAvg = 4.0;
                competency.Categories[0].SubCatCriteria[3].DistrictMax = 5.0;

                competency.Categories[0].SubCatCriteria[4] = new Get.SubCriteria();
                competency.Categories[0].SubCatCriteria[4].SubCatTitle = "subCatTitle 5";
                competency.Categories[0].SubCatCriteria[4].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[0].SubCatCriteria[4].StaffScore = 4.25;
                competency.Categories[0].SubCatCriteria[4].DistrictAvg = 4.0;
                competency.Categories[0].SubCatCriteria[4].DistrictMax = 5.0;



                competency.Categories[1] = new Get.Category();
                competency.Categories[1].CategoryTitle = "Commitment to Growth";
                competency.Categories[1].SubCatCriteria = new Get.SubCriteria[5];

                competency.Categories[1].SubCatCriteria[0] = new Get.SubCriteria();
                competency.Categories[1].SubCatCriteria[0].SubCatTitle = "Capacity Development";
                competency.Categories[1].SubCatCriteria[0].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[1].SubCatCriteria[0].StaffScore = 4.25;
                competency.Categories[1].SubCatCriteria[0].DistrictAvg = 4.0;
                competency.Categories[1].SubCatCriteria[0].DistrictMax = 5.0;
                
                competency.Categories[1].SubCatCriteria[1] = new Get.SubCriteria();
                competency.Categories[1].SubCatCriteria[1].SubCatTitle = "Values-Driven, Data Informed";
                competency.Categories[1].SubCatCriteria[1].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[1].SubCatCriteria[1].StaffScore = 4.25;
                competency.Categories[1].SubCatCriteria[1].DistrictAvg = 4.0;
                competency.Categories[1].SubCatCriteria[1].DistrictMax = 5.0;

                competency.Categories[1].SubCatCriteria[2] = new Get.SubCriteria();
                competency.Categories[1].SubCatCriteria[2].SubCatTitle = " ";
                competency.Categories[1].SubCatCriteria[2].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[1].SubCatCriteria[2].StaffScore = 4.25;
                competency.Categories[1].SubCatCriteria[2].DistrictAvg = 4.0;
                competency.Categories[1].SubCatCriteria[2].DistrictMax = 5.0;

                competency.Categories[1].SubCatCriteria[3] = new Get.SubCriteria();
                competency.Categories[1].SubCatCriteria[3].SubCatTitle = " ";
                competency.Categories[1].SubCatCriteria[3].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[1].SubCatCriteria[3].StaffScore = 4.25;
                competency.Categories[1].SubCatCriteria[3].DistrictAvg = 4.0;
                competency.Categories[1].SubCatCriteria[3].DistrictMax = 5.0;

                competency.Categories[1].SubCatCriteria[4] = new Get.SubCriteria();
                competency.Categories[1].SubCatCriteria[4].SubCatTitle = " ";
                competency.Categories[1].SubCatCriteria[4].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[1].SubCatCriteria[4].StaffScore = 4.25;
                competency.Categories[1].SubCatCriteria[4].DistrictAvg = 4.0;
                competency.Categories[1].SubCatCriteria[4].DistrictMax = 5.0;



                competency.Categories[2] = new Get.Category();
                competency.Categories[2].CategoryTitle = "Heart for Otherss";
                competency.Categories[2].SubCatCriteria = new Get.SubCriteria[5];

                competency.Categories[2].SubCatCriteria[0] = new Get.SubCriteria();
                competency.Categories[2].SubCatCriteria[0].SubCatTitle = "Recognition of Others";
                competency.Categories[2].SubCatCriteria[0].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[2].SubCatCriteria[0].StaffScore = 4.25;
                competency.Categories[2].SubCatCriteria[0].DistrictAvg = 4.0;
                competency.Categories[2].SubCatCriteria[0].DistrictMax = 5.0;

                competency.Categories[2].SubCatCriteria[1] = new Get.SubCriteria();
                competency.Categories[2].SubCatCriteria[1].SubCatTitle = "Collaborative Relationships";
                competency.Categories[2].SubCatCriteria[1].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[2].SubCatCriteria[1].StaffScore = 4.25;
                competency.Categories[2].SubCatCriteria[1].DistrictAvg = 4.0;
                competency.Categories[2].SubCatCriteria[1].DistrictMax = 5.0;

                competency.Categories[2].SubCatCriteria[2] = new Get.SubCriteria();
                competency.Categories[2].SubCatCriteria[2].SubCatTitle = "Effective Communication";
                competency.Categories[2].SubCatCriteria[2].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[2].SubCatCriteria[2].StaffScore = 4.25;
                competency.Categories[2].SubCatCriteria[2].DistrictAvg = 4.0;
                competency.Categories[2].SubCatCriteria[2].DistrictMax = 5.0;

                competency.Categories[2].SubCatCriteria[3] = new Get.SubCriteria();
                competency.Categories[2].SubCatCriteria[3].SubCatTitle = " ";
                competency.Categories[2].SubCatCriteria[3].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[2].SubCatCriteria[3].StaffScore = 4.25;
                competency.Categories[2].SubCatCriteria[3].DistrictAvg = 4.0;
                competency.Categories[2].SubCatCriteria[3].DistrictMax = 5.0;

                competency.Categories[2].SubCatCriteria[4] = new Get.SubCriteria();
                competency.Categories[2].SubCatCriteria[4].SubCatTitle = " ";
                competency.Categories[2].SubCatCriteria[4].SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
                competency.Categories[2].SubCatCriteria[4].StaffScore = 4.25;
                competency.Categories[2].SubCatCriteria[4].DistrictAvg = 4.0;
                competency.Categories[2].SubCatCriteria[4].DistrictMax = 5.0;

                response.CompetencyCategories = competency;

                return response;
            }
        }
    }
}
