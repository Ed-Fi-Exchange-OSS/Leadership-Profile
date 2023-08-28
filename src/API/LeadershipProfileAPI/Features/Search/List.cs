using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models.ProfileSearchRequest;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Features.Search
{
    public class List
    {
        public class Query : IRequest<Response>
        {
            public int? Page { get; set; }
            public string SortField { get; set; }
            public string SortBy { get; set; }
            public bool OnlyActive { get; set; }
            public ProfileSearchRequestBody SearchRequestBody { get; set; }
        }

        public class Response
        {
            public int TotalCount { get; set; }

            public int PageCount { get; set; }

            public IList<SearchResult> Results { get; set; }

            public int? Page { get; set; }
        }

        public class SearchResult
        {
            public string StaffUniqueId { get; set; }
            public string FirstName { get; set; }
            [JsonPropertyName("lastSurname")] public string LastSurName { get; set; }
            public string FullName { get; set; }
            public decimal YearsOfService { get; set; }
            public string Assignment { get; set; }
            public string Degree { get; set; }
            public string Institution { get; set; } = "Default Institution";
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
                const int pageSize = 10;
                var results = await _dbQueryData.GetSearchResultsAsync(
                    request.SearchRequestBody,
                    request.SortBy ?? "asc",
                    request.SortField ?? "id",
                    request.Page ?? 1,
                    pageSize,
                    request.OnlyActive);

                var list = results.AsQueryable()
                    .ProjectTo<SearchResult>(_mapper.ConfigurationProvider)
                    .ToList();

                var totalCount = await _dbQueryData.GetSearchResultsTotalsAsync(request.SearchRequestBody);
                var pageCount = (totalCount + pageSize - 1) / pageSize;

                return new Response
                {
                    TotalCount = totalCount,
                    Page = request.Page,
                    Results = list,
                    PageCount = pageCount,
                };
            }
        }
    }
}
