using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models;
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
            public IEnumerable<StaffPerformanceMeasure> PerformanceMeasures { get; set; }
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
            public string Description { get; set; }
            public string CredentialType { get; set; }
            public DateTime IssuanceDate { get; set; }
            public DateTime? ExpirationDate { get; set; }
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

        public class StaffMeasures
        {
            public string Category { get; set; }
            public string SubCateogry { get; set; }
            public int Year { get; set; }
            public decimal DistrictMin { get; set; }
            public decimal DistrictMax { get; set; }
            public decimal DistrictAvg { get; set; }
            public decimal Score { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly EdFiDbQueryData _dbQueryData;
            private readonly IMapper _mapper;

            public QueryHandler(EdFiDbContext dbContext,
                IMapper mapper,
                EdFiDbQueryData dbQueryData)
            {
                _dbContext = dbContext;
                _mapper = mapper;
                _dbQueryData = dbQueryData;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var profileHeader = await _dbContext.ProfileHeader.FirstOrDefaultAsync(x => x.StaffUniqueId == request.Id, cancellationToken);

                if (profileHeader == null)
                {
                    return null;
                }

                var response = _mapper.Map<Response>(profileHeader);

                response.PositionHistory = await _dbContext.ProfilePositionHistory.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Certificates = await _dbContext.StaffCertificates
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<Certificate>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.Education = await _dbContext.StaffEducations
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<TeacherEducation>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.ProfessionalDevelopment = await _dbContext.StaffProfessionalDevelopments
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.PerformanceMeasures = _dbQueryData
                    .GetStaffPerformanceMeasures(profileHeader.StaffUsi, DateTime.Now.Year);

                return response;
            }
        }
    }
}
