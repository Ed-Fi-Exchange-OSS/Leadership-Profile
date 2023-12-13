using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.Vacancy
{
    public class Retirement
    {
        public class Query : IRequest<Response>
        {
            public string Role { get; set; }
            // public int? Page { get; set; }
            // public string SortField { get; set; }
            // public string SortBy { get; set; }
            // public ProfileSearchRequestBody SearchRequestBody { get; set; }
        }

        public class Response
        {
            public int TotalCount { get; set; }

            public int PageCount { get; set; }

            public IList<StaffVacancy> Results { get; set; }

            public int? Page { get; set; }
        }


        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly EdFiDbQueryData _dbQueryData;
            private readonly IMapper _mapper;

            public QueryHandler(EdFiDbContext dbContext, EdFiDbQueryData dbQueryData, IMapper mapper)
            {
                _dbContext = dbContext;
                _dbQueryData = dbQueryData;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                // var results = await _dbQueryData.GetVacancyProjectionResultsAsync(request.Role, cancellationToken);
                var results = await _dbQueryData.GetRetirementResultsAsync(request.Role, cancellationToken);

                return new Response
                {
                    Results = results
                };
            }
        }
    }
}
