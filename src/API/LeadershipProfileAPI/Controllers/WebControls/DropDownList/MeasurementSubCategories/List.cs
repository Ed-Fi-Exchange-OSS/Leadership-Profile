using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementSubCategories
{
    public static class List
    {
        public class Query : IRequest<Response> { }

        public class Response
        {
            public ICollection<SubCategory> SubCategories { get; set; }
        }

        public class SubCategory
        {
            public string Text { get; set; }
            public int Value { get; set; }
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
                    .ProjectTo<SubCategory>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response
                {
                    SubCategories = list.OrderBy(o => o.Text).ToList()
                };
            }
        }
    }
}