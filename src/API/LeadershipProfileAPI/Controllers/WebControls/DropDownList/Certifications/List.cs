using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Certifications
{
    public static class List
    {
        public class Query : IRequest<Response> { }

        public class Response
        {
            public ICollection<Certification> Certifications { get; set; }
        }

        public class Certification
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
                var list = await _dbContext.ListItemCertifications
                    .ProjectTo<Certification>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return new Response
                {
                    Certifications = list.OrderBy(o => o.Text).ToList()
                };
            }
        }
    }
}