using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.WebControls.Queries.GetMeasurementCategories;

public record GetMeasurementCategoriesQuery : IRequest<Response>;

public class Category
{
    public string? Value { get; set; }

    public string? Text { get; set; }
    public string? EvaluationTitle { get; set; }

    public Category() { }
    public Category(string value, string evaluation)
    {
        Value = value;
        Text = value;
        EvaluationTitle = evaluation;
    }
}

public class Response
{
    public ICollection<Category>? Categories { get; set; }
}

public class GetMeasurementCategoriesQueryHandler : IRequestHandler<GetMeasurementCategoriesQuery, Response>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMeasurementCategoriesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<Response> Handle(GetMeasurementCategoriesQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        var list = await _context.ListItemCategories
            // .ToListAsync();
            .OrderBy(c => c.SortOrder)
            // .Select(c => c.Category)
            // .Distinct()
            .Select(c => new Category(c.Category ?? "", c.EvaluationTitle ?? ""))
            .ToListAsync(cancellationToken);

        return new Response
                {
                    Categories = list
                };
    }
}
