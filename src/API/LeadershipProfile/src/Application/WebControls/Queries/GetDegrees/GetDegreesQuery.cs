using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.WebControls.Queries.GetDegrees;

public record GetDegreesQuery : IRequest<IEnumerable<ListItemDegree>>;

public class GetDegreesQueryHandler : IRequestHandler<GetDegreesQuery, IEnumerable<ListItemDegree>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDegreesQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
    public async Task<IEnumerable<ListItemDegree>> Handle(GetDegreesQuery request, CancellationToken cancellationToken)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
    {
        return await _context.ListItemDegrees
            .ToListAsync();
    }
}
