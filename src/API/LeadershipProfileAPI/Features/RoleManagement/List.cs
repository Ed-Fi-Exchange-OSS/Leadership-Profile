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

            private async Task<bool> GetAdminStatus(string username, CancellationToken cancellationToken)
            {
                var user = await _userManager.Users.SingleOrDefaultAsync(x =>
                    x.UserName == username, cancellationToken);
                if (user != null)
                {
                    var claims = await _userManager.GetClaimsAsync(user);
                    var hasAdminClaim = claims.Any(x => x.Value == "Admin");
                    return hasAdminClaim;
                }

                return false;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _ctx.ProfileList.AsQueryable();
                var profiles = query.ProjectTo<TeacherRoleProfile>(_mapper.ConfigurationProvider);
                var staff = _ctx.Staff
                    .Where(x => x.TpdmUsername != null)
                    .Join(profiles, s => s.StaffUniqueId, t => t.StaffUniqueId, (s, t) => new TeacherRoleProfile
                    {
                        StaffUniqueId = t.StaffUniqueId,
                        FirstName = t.FirstName,
                        MiddleName = t.MiddleName,
                        LastSurName = t.LastSurName,
                        FullName = t.FullName,
                        Location = t.Location,
                        Username = s.TpdmUsername,
                    });

                foreach (var s in staff)
                {
                    var isAdmin = await GetAdminStatus(s.Username, cancellationToken);
                    s.Admin = isAdmin;
                }

                var count = await staff.CountAsync(cancellationToken);

                List<TeacherRoleProfile> items;
                if (request.Page.HasValue)
                {
                    items = await staff
                        .OrderBy(p => p.LastSurName)
                        .ThenBy(p => p.FirstName)
                        .Skip((request.Page.Value - 1) * PageSize)
                        .Take(PageSize)
                        .ToListAsync(cancellationToken);
                }
                else
                {
                    items = await staff
                        .OrderBy(p => p.LastSurName)
                        .ThenBy(p => p.FirstName)
                        .ToListAsync(cancellationToken);
                }

                return new Response
                {
                    TotalCount = count,
                    Page = request.Page,
                    Profiles = items
                };
            }
        }
    }
}