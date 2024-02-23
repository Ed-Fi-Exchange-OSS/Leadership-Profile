using LeadershipProfile.Domain.Entities;

namespace LeadershipProfile.Application.TodoLists.Queries.GetEligibilityForRetirement;

public class EligibilityForRetirementDto
{
    public EligibilityForRetirementDto()
    {
        
    }

    public int Id { get; init; }

    public string? Title { get; init; }

    public string? Colour { get; init; }

}
