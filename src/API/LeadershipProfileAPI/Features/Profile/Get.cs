// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
            public decimal YearsOfService { get; set; }
            public string Phone { get; set; } = "+12320103203";
            public string Email { get; set; } = "default@email.com";
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
            public decimal Score { get; set; }
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
            public DateTime? ValidToDate { get; set; }
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
                    .OrderByDescending(x => x.StartDate)
                    .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.PositionHistory = positionHistory;

                var certificates = await _dbContext.ProfileCertification.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<Certificate>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Certificates = certificates;

                response.ProfessionalDevelopment = await _dbContext.StaffProfessionalDevelopments
                    .Where(o => o.StaffUniqueId == request.Id)
                    .OrderByDescending(o => o.AttendanceDate)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.Evaluations = await BuildChartDataAsync(_dbContext, request.Id);

                return response;
            }

            private async Task<IEnumerable<PerformanceEvaluation>> BuildChartDataAsync(EdFiDbContext dbContext, string requestId)
            {
                var sections = new List<PerformanceEvaluation>();

                var staffObjectives = await _dbContext.ProfileEvaluationObjectives
                    .Where(o => o.StaffUniqueId == requestId && o.EvalNumber == 1)
                    .ToListAsync();

                var objectivesByYear = staffObjectives
                    .GroupBy(o => o.SchoolYear)
                    .ToDictionary(g => g.Key, g => g.Select(o =>
                        new PerformanceRating { Category = o.ObjectiveTitle, Score = o.Rating }));

                sections.Add(new PerformanceEvaluation { Title = "Overall", RatingsByYear = objectivesByYear });

                var staffElements = await _dbContext.ProfileEvaluationElements
                    // .Where(e => e.StaffUniqueId == requestId && e.EvalNumber == 1)
                    .Where(e => e.StaffUniqueId == requestId)
                    .ToListAsync();

                var evalsByObjective = staffElements
                    .GroupBy(e => e.ObjectiveTitle)
                    .Select(o => new PerformanceEvaluation
                    {
                        Title = o.Key,
                        RatingsByYear = o
                            .GroupBy(g => g.SchoolYear)
                            .ToDictionary(g => g.Key,
                                g => g
                                    .OrderBy(g => g.ElementTitle)
                                    .Select(e => new PerformanceRating {Category = e.ElementTitle, Score = e.Rating})
                            )
                    })
                    .OrderBy(o => o.Title);

                sections.AddRange(evalsByObjective);

                return sections;
            }
        }
    }
}
