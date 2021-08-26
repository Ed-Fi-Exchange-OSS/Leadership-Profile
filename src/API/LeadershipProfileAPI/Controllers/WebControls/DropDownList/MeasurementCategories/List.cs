using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models.ListItem;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementCategories
{
    public static class List
    {
        public class Query : IRequest<Response> { }

        public class Response
        {
            public ICollection<Category> Categories { get; set; }
        }

        public class Category
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
                //var list = await _dbContext.ListItemCategories
                //    .ProjectTo<Category>(_mapper.ConfigurationProvider)
                //    .ToListAsync(cancellationToken);

                /* TO-DO: Returning dummy data, replace this with code above when db view is updated */
                var list = _mapper.Map<List<Category>> (DummyData());

                return new Response
                {
                    Categories = list.OrderBy(o => o.Text).ToList()
                };
            }

            public List<ListItemCategory> DummyData()
            {
                return new List<ListItemCategory>
                {
                    new() { Text = "Forever Learner", Value = 1 },
                    new() { Text = "Promise 2 Purpose Investor", Value = 2 },
                    new() { Text = "Relationship Driven", Value = 3 },
                    new() { Text = "Student Focused", Value = 4 },
                    new() { Text = "Technical Skills", Value = 5 }
                };
            }
        }
    }
}