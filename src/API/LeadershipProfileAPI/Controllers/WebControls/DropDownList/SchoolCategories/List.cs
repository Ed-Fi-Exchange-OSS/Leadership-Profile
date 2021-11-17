using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.SchoolCategories
{
    public static class List
    {
        public class Query : IRequest<Response> { }

        public class Response
        {
            public ICollection<SchoolCategory> SchoolCategories { get; set; }
        }

        public class SchoolCategory
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
                var test = _dbContext.ListItemSchoolCategories.ToList();
                
                var list = await _dbContext.ListItemSchoolCategories
                    .ProjectTo<SchoolCategory>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response
                {
                    SchoolCategories = list.OrderBy(o => o.Text).ToList()
                };
            }
        }
    }
}