using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementSubCategories
{
    public static class List
    {
        public class Query : IRequest<Response> { }

        public class Response
        {
            public ICollection<SubCategoryItem> SubCategories { get; set; }
        }

        public class SubCategoryItem
        {
            public int CategoryId { get; set; }
            public string Category { get; set; }
            public string SubCategory { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly IMapper _mapper;

            public QueryHandler(EdFiDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var list = await _dbContext.ListItemCategories
                    .ProjectTo<SubCategoryItem>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response
                {
                    SubCategories = list.OrderBy(o => o.SubCategory).ToList()
                };
            }
        }
    }
}