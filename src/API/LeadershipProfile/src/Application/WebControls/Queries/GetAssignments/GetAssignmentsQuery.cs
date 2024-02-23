using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.WebControls.Queries.GetAssignments;

public record GetAssignmentsQuery : IRequest<IEnumerable<ListItemAssignment>>;

public class GetAssignmentsQueryHandler : IRequestHandler<GetAssignmentsQuery, IEnumerable<ListItemAssignment>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAssignmentsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<ListItemAssignment>> Handle(GetAssignmentsQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        return await _context.ListItemAssignments
            .ToListAsync();
    }
}
