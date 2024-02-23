using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.WebControls.Queries.GetMeasurementCategories;

public record GetMeasurementCategoriesQuery : IRequest<IEnumerable<ListItemCategory>>;

public class GetMeasurementCategoriesQueryHandler : IRequestHandler<GetMeasurementCategoriesQuery, IEnumerable<ListItemCategory>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMeasurementCategoriesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<ListItemCategory>> Handle(GetMeasurementCategoriesQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        return await _context.ListItemCategories
            .ToListAsync();
    }
}
