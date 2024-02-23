using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.WebControls.Queries.GetSchoolCategories;

public record GetSchoolCategoriesQuery : IRequest<IEnumerable<ListItemSchoolCategory>>;

public class GetSchoolCategoriesQueryHandler : IRequestHandler<GetSchoolCategoriesQuery, IEnumerable<ListItemSchoolCategory>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSchoolCategoriesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<ListItemSchoolCategory>> Handle(GetSchoolCategoriesQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        return await _context.ListItemSchoolCategories
            .ToListAsync();
    }
}
