using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Extensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.Profile
{
    public static class List
    {
        public class Query : IRequest<Response>
        {
            public int? Page { get; set; }
            public string SortField { get; set; }
            public string SortBy { get; set; }
            public string Search { get; set; }
        }

        public class Response
        {
            public int TotalCount { get; set; }

            public IList<TeacherProfile> Profiles { get; set; }

            public int? Page { get; set; }
        }

        public class TeacherProfile
        {
            [JsonPropertyName("id")] public Guid Id { get; set; }
            [JsonPropertyName("staffUniqueId")] public string StaffUniqueId { get; set; }
            [JsonPropertyName("firstName")] public string FirstName { get; set; }
            [JsonPropertyName("middleName")] public string MiddleName { get; set; }
            [JsonPropertyName("lastSurname")] public string LastSurName { get; set; }
            [JsonPropertyName("fullName")] public string FullName { get; set; }
            public string Location { get; set; } = "Default Location";
            public int YearsOfService { get; set; }
            public string Institution { get; set; } = "Default Institution";
            public string HighestDegree { get; set; } = "Default Degree";
            public string Major { get; set; } = "Default Major";
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _ctx;
            private readonly IMapper _mapper;
            private const int PageSize = 10;

            public QueryHandler(EdFiDbContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _ctx.ProfileList.AsQueryable();
                var profiles = query.ProjectTo<TeacherProfile>(_mapper.ConfigurationProvider);
                var isAscending = string.IsNullOrWhiteSpace(request.SortBy) || request.SortBy.Equals("asc");
                List<Expression<Func<ProfileList, object>>> orderByExpressions = new();

                switch (request.SortField)
                {
                    case "id":
                        orderByExpressions.Add(o => o.StaffUniqueId);
                        break;
                    case "name":
                        orderByExpressions.Add(o => o.LastSurName);
                        orderByExpressions.Add(o => o.FirstName);
                        break;
                    case "location":
                        if (isAscending)
                        {
                            // Push any null values to the end of the collection
                            orderByExpressions.Add(o => string.IsNullOrEmpty(o.Location));
                        }
                        orderByExpressions.Add(o => o.Location);
                        break;
                    case "school":
                        if (isAscending)
                        {
                            // Push any null values to the end of the collection
                            orderByExpressions.Add(o => string.IsNullOrEmpty(o.Institution));
                        }
                        orderByExpressions.Add(o => o.Institution);
                        break;
                    case "position":
                        if (isAscending)
                        {
                            // Push any null values to the end of the collection
                            orderByExpressions.Add(o => string.IsNullOrEmpty(o.Position));
                        }
                        orderByExpressions.Add(o => o.Position);
                        break;
                    case "yearsOfService":
                        orderByExpressions.Add(o => o.YearsOfService);
                        break;
                    case "highestDegree":
                        if (isAscending)
                        {
                            // Push any null values to the end of the collection
                            orderByExpressions.Add(o => string.IsNullOrEmpty(o.HighestDegree));
                        }
                        orderByExpressions.Add(o => o.HighestDegree);
                        break;
                    case "major":
                        if (isAscending)
                        {
                            // Push any null values to the end of the collection
                            orderByExpressions.Add(o => string.IsNullOrEmpty(o.Major));
                        }
                        orderByExpressions.Add(o => o.Major);
                        break;
                    default:
                        orderByExpressions.Add(o => o.LastSurName);
                        orderByExpressions.Add(o => o.FirstName);
                        break;
                }

                if (isAscending)
                {
                    // Build query
                    query = query.OrderBy(orderByExpressions);
                }
                else
                {
                    // Build query
                    query = query.OrderByDescending(orderByExpressions);
                }

                // Project to desired object
                var results = query
                    .ProjectTo<TeacherProfile>(_mapper.ConfigurationProvider);

                return new Response()
                {
                    TotalCount = await _ctx.ProfileList.CountAsync(cancellationToken),
                    Page = request.Page,
                    Profiles = await results
                        .Skip((request.Page.Value - 1) * PageSize)
                        .Take(PageSize)
                        .ToListAsync(cancellationToken)
                };
            }
        }
    }
}
