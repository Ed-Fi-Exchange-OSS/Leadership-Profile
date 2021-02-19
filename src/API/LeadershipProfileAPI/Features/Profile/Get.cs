using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
            public ICollection<TeacherEducation> Education { get; set; }
            public ICollection<PositionHistory> PositionHistory { get; set; }
            public ICollection<Certificate> Certificates { get; set; }
            public ICollection<ProfessionalDevelopment> ProfessionalDevelopment { get; set; }
            public ICollection<CompetencyRatings> Competencies { get; set; }
            public ICollection<Category> Category { get; set; }
            public ICollection<SubCategory> SubCategory { get; set; }
            public ICollection<ScoresByPeriod> ScoresByPeriod { get; set; }

        }

        public class CompetencyRatings
        {
            public ICollection<Category> Categories {get;set;}
        }
        public class Category
        {
            public string CategoryTitle { get; set; }
            public ICollection<SubCategory> SubCatCriteria { get; set; }
        }
        public class SubCategory
        {
            public string SubCatTitle { get; set; } = "Default Sub Category";
            public string SubCatNotes { get; set; } = "Default Note";       
            public ICollection<ScoresByPeriod> ScoresByPeriod { get; set; }
        }
        public class ScoresByPeriod
        {
            public string Period { get; set; } = "Default Period";
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
                    .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.PositionHistory = positionHistory;

                var certificates = await _ctx.ProfileCertification.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<Certificate>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Certificates = certificates;

                var education = await _ctx.ProfileEducation.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<TeacherEducation>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Education = education;

                var development = await _ctx.ProfileProfessionalDevelopment.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.ProfessionalDevelopment = development;

                var competencies = await _ctx.ProfileCompetency.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<CompetencyRatings>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                var criteria = await _ctx.ProfileCategory
                    .ProjectTo<Category>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                var subcriteria = await _ctx.ProfileSubCategory
                    .ProjectTo<SubCategory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                var scores = await _ctx.ProfileScoresByPeriod
                    .ProjectTo<ScoresByPeriod>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Competencies = competencies;
                response.Category = criteria;
                response.SubCategory = subcriteria;
                response.ScoresByPeriod = scores;

                return response;
            }
        }
    }
}
