using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using IdentityServer4.Extensions;

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
            public IEnumerable<PositionHistory> PositionHistory { get; set; }
            public IEnumerable<Certificate> Certificates { get; set; }
            public IEnumerable<ProfessionalDevelopment> ProfessionalDevelopment { get; set; }
            public IEnumerable<PerformanceEvaluation> Evaluations { get; set; }

        }
        public class PerformanceEvaluation
        {
            public string Title { get; set; }
            public Dictionary<int, IEnumerable<PerformanceRating>> RatingsByYear { get; set; }
        }
        public class PerformanceRating
        {
            public string Category { get; set; }
            public double Score { get; set; }
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
            public DateTime AttendanceDate { get; set; }
            public string ProfessionalDevelopmentTitle { get; set; }
            public string Location { get; set; }
            public string AlignmentToLeadership { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly IMapper _mapper;

            public QueryHandler(EdFiDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var profileHeader = await _dbContext.ProfileHeader.FirstOrDefaultAsync(x => x.StaffUniqueId == request.Id, cancellationToken);

                if (profileHeader == null)
                {
                    return null;
                }

                var response = _mapper.Map<Response>(profileHeader);

                var positionHistory = await _dbContext.ProfilePositionHistory.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.PositionHistory = positionHistory;

                var certificates = await _dbContext.ProfileCertification.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<Certificate>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Certificates = certificates;

                response.ProfessionalDevelopment = await _dbContext.StaffProfessionalDevelopments
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.Evaluations = GenerateMockData();

                return response;
            }


            private IEnumerable<PerformanceEvaluation> GenerateMockData()
            {
                var overAllPerformanceRating2020 = new List<PerformanceRating>
                {
                    new PerformanceRating() { Category =  "Overall", Score = 3.0 },
                    new PerformanceRating() { Category =  "Forever Learner", Score = 3.2 },
                    new PerformanceRating() { Category =  "Promise 2 Purpose Investor", Score = 2.9 },
                    new PerformanceRating() { Category =  "Student Focused", Score = 4.5 },
                    new PerformanceRating() { Category =  "Technical Skills", Score = 4.2 },
                };

                var overAllPerformanceRating2021 = new List<PerformanceRating>
                {
                    new PerformanceRating() { Category =  "Overall", Score = 4.0 },
                    new PerformanceRating() { Category =  "Forever Learner", Score = 4.2 },
                    new PerformanceRating() { Category =  "Promise 2 Purpose Investor", Score = 3.9 },
                    new PerformanceRating() { Category =  "Student Focused", Score = 2.5 },
                    new PerformanceRating() { Category =  "Technical Skills", Score = 3.2 },
                };

                var flPerformanceRating2020 = new List<PerformanceRating>
                {
                    new PerformanceRating() { Category =  "Ethics and Standards", Score = 3.0 },
                    new PerformanceRating() { Category = "Schedules for Core Leadership Tasks", Score = 3.2 },
                    new PerformanceRating() { Category = "Strategic Planning", Score = 4.5  },
                    new PerformanceRating() { Category = "Change Facilitation", Score = 3.2 },
                    new PerformanceRating() { Category = "Coaching, Growth, Feedback, and Professional Development", Score = 4.5  }
                };

                var flPerformanceRating2021 = new List<PerformanceRating>
                {
                    new PerformanceRating() { Category =  "Ethics and Standards", Score = 4.2 },
                    new PerformanceRating() { Category = "Schedules for Core Leadership Tasks", Score = 4.2 },
                    new PerformanceRating() { Category = "Strategic Planning", Score =3.9 },
                    new PerformanceRating() { Category = "Change Facilitation", Score = 4.2 },
                    new PerformanceRating() { Category = "Coaching, Growth, Feedback, and Professional Development", Score = 4.4  }
                };

                var overallRatingsByYear = new Dictionary<int, IEnumerable<PerformanceRating>>
                {
                    {2020, overAllPerformanceRating2020}, {2021, overAllPerformanceRating2021}
                };

                var flRatingsByYear = new Dictionary<int, IEnumerable<PerformanceRating>>
                {
                    {2020, flPerformanceRating2020}, {2021, flPerformanceRating2021}
                };

                var overAllPerformanceEvaluation = new PerformanceEvaluation()
                {
                    Title = "Overall",
                    RatingsByYear = overallRatingsByYear
                };

                var flPerformanceEvaluation = new PerformanceEvaluation()
                {
                    Title = "Forever Learner",
                    RatingsByYear = flRatingsByYear
                };

                var evaluations = new List<PerformanceEvaluation>
                {
                    overAllPerformanceEvaluation,
                    flPerformanceEvaluation
                };

                return evaluations;
            }
        }
    }
}
