// using LeadershipProfile.Application.Common.Interfaces;
// using LeadershipProfile.Application.Common.Models;
// using LeadershipProfile.Application.Common.Security;
// using LeadershipProfile.Domain.Enums;

// namespace LeadershipProfile.Application.TodoLists.Queries.GetEligibilityForRetirement;

// [Authorize]
// public record GetEligibilityForRetirementQuery : IRequest<EligibilityForRetirementDto>;

// public class GetEligibilityForRetirementQueryHandler : IRequestHandler<GetEligibilityForRetirementQuery, EligibilityForRetirementDto>
// {
//     private readonly IApplicationDbContext _context;
//     private readonly IMapper _mapper;

//     public GetEligibilityForRetirementQueryHandler(IApplicationDbContext context, IMapper mapper)
//     {
//         _context = context;
//         _mapper = mapper;
//     }

//     public async Task<VacancyForecasts> Handle(GetEligibilityForRetirementQuery request, CancellationToken cancellationToken)
//     {
//         return _context.StaffVacancies.ToListAsync();
//     }
// }
