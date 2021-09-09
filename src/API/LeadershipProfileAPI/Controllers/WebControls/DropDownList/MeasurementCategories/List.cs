using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Data.Models.ListItem;
using MediatR;

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
            public string Value { get; set; }

            public string Text { get; set; }


            public Category() { }
            public Category(string value)
            {
                Value = value;
                Text = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(value);
            }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;

            public QueryHandler(EdFiDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                //var list = await _dbContext.ListItemCategories
                //    .ProjectTo<Category>(_mapper.ConfigurationProvider)
                //    .ToListAsync(cancellationToken);

                /* TO-DO: Returning dummy data, replace this with code above when db view is updated */
                var list = DummyData()
                    .Select(d => new Category(d.Value))
                    .OrderBy(d => d.Text)
                    .ToList();

                var response = new Response
                {
                    Categories = list
                };

                return Task.FromResult(response);
            }

            public List<ListItemCategory> DummyData()
            {
                return new List<ListItemCategory>
                {
                    new() { Value = "Forever Learner" },
                    new() { Value = "Promise 2 Purpose Investor" },
                    new() { Value = "Relationship Driven" },
                    new() { Value = "Student Focused" },
                    new() { Value = "Technical Skills" }
                };
            }
        }
    }
}