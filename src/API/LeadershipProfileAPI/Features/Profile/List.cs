using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.Profile
{
    public class List
    {
        public class Query : IRequest<Response>
        {
            public int Page { get; set; }
            public string SortField { get; set; }
            public string SortBy { get; set; }
            public string Search { get; set; }
        }

        public class Response
        {
            public int TotalCount { get; set; }

            public IList<TeacherProfile> Profiles { get; set; }

            public int Page { get; set; }
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

            public QueryHandler(EdFiDbContext ctx, IMapper mapper)
            {
                _ctx = ctx;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = _ctx.ProfileList.ProjectTo<TeacherProfile>(_mapper.ConfigurationProvider);

                var count = await profiles.CountAsync(cancellationToken);
                var items = await profiles.Skip((request.Page - 1) * 10).Take(10).ToArrayAsync(cancellationToken);

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
