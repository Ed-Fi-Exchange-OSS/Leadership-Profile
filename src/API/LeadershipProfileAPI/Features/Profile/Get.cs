﻿using AutoMapper;
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
            public IEnumerable<TeacherEducation> Education { get; set; }
            public IEnumerable<PositionHistory> PositionHistory { get; set; }
            public IEnumerable<Certificate> Certificates { get; set; }
            public IEnumerable<ProfessionalDevelopment> ProfessionalDevelopment { get; set; }
            public IEnumerable<CompetencyRatings> Competencies { get; set; }
            public IEnumerable<Category> Category { get; set; }
            public IEnumerable<SubCategory> SubCategory { get; set; }
            public IEnumerable<ScoresByPeriod> ScoresByPeriod { get; set; }

        }

        public class CompetencyRatings
        {
            public IList<Category> Categories { get; set; }
        }
        public class Category
        {
            public string CategoryTitle { get; set; }
            public IList<SubCategory> SubCatCriteria { get; set; }
        }
        public class SubCategory
        {
            public string SubCatTitle { get; set; } = "Default Sub Category";
            public string SubCatNotes { get; set; } = "Default Note";
            public IList<ScoresByPeriod> ScoresByPeriod { get; set; }
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
            public DateTime AttendanceDate { get; set; }
            public string ProfessionalDevelopmentTitle { get; set; }
            public string Location { get; set; }
            public string AlignmentToLeadership { get; set; }
        }

        public class TeacherEducation
        {
            public string Degree { get; set; }
            public string Specialization { get; set; }
            public string Institution { get; set; }
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

                response.Education = await _dbContext.StaffEducations
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<TeacherEducation>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.ProfessionalDevelopment = await _dbContext.StaffProfessionalDevelopments
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                //var competencies = await _dbContext.ProfileCompetency.Where(x => x.StaffUniqueId == request.Id)
                //    .ProjectTo<CompetencyRatings>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                //var criteria = await _dbContext.ProfileCategory
                //    .ProjectTo<Category>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                //var subcriteria = await _dbContext.ProfileSubCategory
                //    .ProjectTo<SubCategory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                //var scores = await _dbContext.ProfileScoresByPeriod
                //    .ProjectTo<ScoresByPeriod>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                return response;
            }
        }
    }
}
