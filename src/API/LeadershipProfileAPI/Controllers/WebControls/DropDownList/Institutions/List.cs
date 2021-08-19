using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Institutions
{
    public class List
    {
        public class Query : IRequest<Response> {}

        public class Response
        {
            public ICollection<Institution> Institutions { get; set; }
        }

        public class Institution
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
                var list = await _dbContext.ListItemItemInstitutions
                    .ProjectTo<Institution>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response()
                {
                    Institutions = list.OrderBy(x => x.Text).ToList()
                };
            }
        }
    }
}