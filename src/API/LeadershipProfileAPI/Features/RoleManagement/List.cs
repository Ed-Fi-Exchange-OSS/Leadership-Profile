using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.RoleManagement
{
    public class List
    {
        public class Query : IRequest<Response>
        {
            public int? Page { get; set; }
        }

        public class Response
        {
            public int TotalCount { get; set; }

            public IList<TeacherRoleProfile> Profiles { get; set; }

            public int? Page { get; set; }
        }

        public class TeacherRoleProfile
        {
            [JsonPropertyName("id")] public string Id { get; set; } = Guid.NewGuid().ToString();
            [JsonPropertyName("staffUniqueId")] public string StaffUniqueId { get; set; }
            [JsonPropertyName("firstName")] public string FirstName { get; set; }
            [JsonPropertyName("middleName")] public string MiddleName { get; set; }
            [JsonPropertyName("lastSurname")] public string LastSurName { get; set; }
            [JsonPropertyName("fullName")] public string FullName { get; set; }
            public string Location { get; set; } = "Default Location";
            public bool? Admin { get; set; }
            public string Username { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _ctx;
            private readonly IMapper _mapper;
            private readonly UserManager<IdentityUser> _userManager;
            private const int PageSize = 10;

            public QueryHandler(EdFiDbContext ctx, IMapper mapper, UserManager<IdentityUser> userManager)
            {
                _ctx = ctx;
                _mapper = mapper;
                _userManager = userManager;
            }

            private static void SetAdminStatus(TeacherRoleProfile profile, bool hasAdminClaim)
            {
                profile.Admin = hasAdminClaim;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var page = request.Page ?? 0;
                var query = _ctx.ProfileList.AsQueryable().ProjectTo<TeacherRoleProfile>(_mapper.ConfigurationProvider);

                var staff = _ctx.Staff
                    .Where(x => x.TpdmUsername != null)
                    .Join(query, s => s.StaffUniqueId, t => t.StaffUniqueId, (s, t) => new TeacherRoleProfile
                    {
                        StaffUniqueId = t.StaffUniqueId,
                        FirstName = t.FirstName,
                        MiddleName = t.MiddleName,
                        LastSurName = t.LastSurName,
                        FullName = t.FullName,
                        Location = t.Location,
                        Username = s.TpdmUsername,
                    }).OrderBy(p => p.LastSurName)
                    .ThenBy(p => p.FirstName).ToList();

                var totalCount = staff.Count;

                staff = staff.AsEnumerable()
                    .Skip((page - 1) * PageSize)
                    .Take(PageSize)
                    .AsEnumerable()
                    .Select(async x =>
                    {
                        var user = await _userManager.Users.SingleOrDefaultAsync(y =>
                            y.UserName == x.Username, cancellationToken);
                        var claims = await _userManager.GetClaimsAsync(user);
                        if (claims.Count == 0)
                        {
                            x.Admin = false;
                            return x;
                        }
                        x.Admin = claims.Any(y => y.Value == "Admin");
                        return x;
                    }).Select(x => x.GetAwaiter().GetResult()).ToList();

                return new Response
                {
                    TotalCount = totalCount,
                    Page = request.Page,
                    Profiles = staff
                };
            }
        }
    }
}