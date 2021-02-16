using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using Microsoft.AspNetCore.Identity;
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

            public int PageCount { get; set; }

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
            private readonly EdFiDbQueryData _dbQueryData;
            private readonly IMapper _mapper;

            public QueryHandler(
                EdFiDbContext ctx,
                IMapper mapper,
                EdFiDbQueryData dbQueryData)
            {
                _ctx = ctx;
                _mapper = mapper;
                _dbQueryData = dbQueryData;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var list = _dbQueryData.GetProfileList(request.SortBy ?? "asc", request.SortField ?? "id",
                    request.Page ?? 1);

                return new Response
                {
                    TotalCount = await _ctx.ProfileList.CountAsync(cancellationToken),
                    Page = request.Page,
                    Profiles = await list.ProjectTo<TeacherProfile>(_mapper.ConfigurationProvider)
                        .ToListAsync(cancellationToken),
                    PageCount = await list.CountAsync(cancellationToken)
                };
            }
        }
    }
}