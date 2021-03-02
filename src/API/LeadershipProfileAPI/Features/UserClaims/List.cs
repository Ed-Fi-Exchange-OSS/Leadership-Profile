using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.UserClaims
{
    public class List
    {
        public class Query : IRequest<Response>
        {
            public int? Page { get; set; }
            public string Role { get; set; }
        }

        public class Response
        {
            public int TotalCount { get; set; }

            public IList<TeacherRoleProfile> Profiles { get; set; }

            public int? Page { get; set; }
        }

        public class TeacherRoleProfile
        {
            [JsonPropertyName("id")] public string Id { get; set; }
            [JsonPropertyName("staffUsi")] public int StaffUsi { get; set; }
            [JsonPropertyName("staffUniqueId")] public string StaffUniqueId { get; set; }
            [JsonPropertyName("firstName")] public string FirstName { get; set; }
            [JsonPropertyName("middleName")] public string MiddleName { get; set; }
            [JsonPropertyName("lastSurname")] public string LastSurName { get; set; }
            [JsonPropertyName("location")] public string Location { get; set; }
            [JsonPropertyName("fullName")] public string FullName { get; set; }
            [JsonPropertyName("isAdmin")] public bool IsAdmin { get; set; }
            [JsonPropertyName("username")] public string Username { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly IMapper _mapper;
            private const int pageSize = 10;

            public QueryHandler(EdFiDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var page = request.Page ?? 1;
                var andRoleOf = !string.IsNullOrWhiteSpace(request.Role) ? $"and cl.ClaimValue = '{request.Role}'" : "";

                var sql = $@"
                    select 
                         st.Id
                        ,st.StaffUSI
                        ,st.StaffUniqueId
                        ,st.FirstName
                        ,st.MiddleName
                        ,st.LastSurname
                        ,sa.City as Location
                        ,st.TpdmUsername
                        ,cast(case when cl.UserId is null then 0 else 1 end as bit) as IsAdmin
                    from edfi.Staff as st
                    left join edfi.StaffAddress sa on sa.StaffUSI = st.StaffUSI
                    left join dbo.AspNetUsers as u on u.UserName = st.TpdmUsername
                    left join dbo.AspNetUserClaims as cl on cl.UserId = u.Id
                    where TpdmUsername is not null {andRoleOf}
                    order by st.LastSurname, st.FirstName
                    offset {((page - 1) * pageSize)} rows
                    fetch next {pageSize} rows only
                ";

                var profiles = await _dbContext.StaffAdmins.FromSqlRaw(sql)
                    .ProjectTo<TeacherRoleProfile>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response
                {
                    TotalCount = profiles.Count,
                    Page = page,
                    Profiles = profiles
                };
            }
        }
    }
}