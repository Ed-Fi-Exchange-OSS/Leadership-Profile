using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.WebControls.Queries.GetInstitutions;

public record GetInstitutionsQuery : IRequest<IEnumerable<ListItemInstitution>>;

public class GetInstitutionsQueryHandler : IRequestHandler<GetInstitutionsQuery, IEnumerable<ListItemInstitution>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetInstitutionsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<ListItemInstitution>> Handle(GetInstitutionsQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        return await _context.ListItemItemInstitutions
            .ToListAsync();
    }
}
