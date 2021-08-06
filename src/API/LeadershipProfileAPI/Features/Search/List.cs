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
            public int StaffUsi { get; set; }
            public string StaffUniqueId { get; set; }
            public string FirstName { get; set; }
            public string MiddleName { get; set; }
            [JsonPropertyName("lastSurname")] public string LastSurName { get; set; }
            public string FullName { get; set; }
            public int YearsOfService { get; set; }
            public string Certification { get; set; }
            public string Assignment { get; set; }
            public string Degree { get; set; }
            public string RatingCategory { get; set; }
            public string RatingSubCategory { get; set; }
            public decimal Rating { get; set; }
            public string Institution { get; set; } = "Default Institution";
            public string Email { get; set; }
            public string Telephone { get; set; }
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
                var results = await _dbQueryData.GetSearchResultsAsync(
                    request.SearchRequestBody,
                    request.SortBy ?? "asc",
                    request.SortField ?? "id",
                    request.Page ?? 1);

                var list = results.AsQueryable()
                    .ProjectTo<SearchResult>(_mapper.ConfigurationProvider)
                    .ToList();

                var totalCount = await _dbQueryData.GetSearchResultsTotalsAsync(request.SearchRequestBody);

                return new Response
                {
                    TotalCount = totalCount,
                    Page = request.Page,
                    Results = list,
                    PageCount = results.Count
                };
            }
        }
    }
}
