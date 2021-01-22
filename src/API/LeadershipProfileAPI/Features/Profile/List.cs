using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
            [JsonPropertyName("id")] public string Id { get; set; } = Guid.NewGuid().ToString();
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

                TeacherProfile[] items;
                var count = await profiles.CountAsync(cancellationToken);

                if (request.Page.HasValue)
                {
                    items = await profiles.Skip((request.Page.Value - 1) * PageSize).Take(PageSize).ToArrayAsync(cancellationToken);
                }
                else
                {
                    items = await profiles.ToArrayAsync(cancellationToken);
                }

                return new Response()
                {
                    TotalCount = count,
                    Page = request.Page,
                    Profiles = items
                };
            }
        }
    }
}
