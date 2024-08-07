﻿using System.Text.Json.Serialization;
using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Application.Common.Models;
using LeadershipProfile.Application.Common.Security;
using LeadershipProfile.Domain.Entities;
using LeadershipProfile.Domain.Enums;

namespace LeadershipProfile.Application.Profiles.Queries.GetProfile;

[Authorize]
public record GetProfileQuery : IRequest<Response>
{
    public string Id { get; set; } = "";
};


public class Response
{
    [JsonPropertyName("staffUniqueId")] public string StaffUniqueId { get; set; } = "12345";
    [JsonPropertyName("firstName")] public string FirstName { get; set; } = "";
    [JsonPropertyName("middleName")] public string MiddleName { get; set; } = "";
    [JsonPropertyName("lastSurname")] public string LastName { get; set; } = "";
    [JsonPropertyName("fullName")] public string FullName { get; set; } = "";
    public string CurrentPosition { get; set; } = "Default Position";
    public string District { get; set; } = "Default School District";
    public string School { get; set; } = "Default High School";
    public decimal YearsOfService { get; set; }
    public string Phone { get; set; } = "+12320103203";
    public string Email { get; set; } = "default@email.com";
    public bool InterestedInNextRole { get; set; }
    public required IEnumerable<PositionHistory> PositionHistory { get; set; }
    public required IEnumerable<Certificate> Certificates { get; set; }
    public required IEnumerable<ProfessionalDevelopment> ProfessionalDevelopment { get; set; }
    public required IEnumerable<PerformanceEvaluation> Evaluations { get; set; }
    public required IEnumerable<PerformanceEvaluation> Ratings { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ProfileHeader, Response>()
                .ForMember(dst => dst.Certificates, opt => opt.Ignore())
                .ForMember(dst => dst.PositionHistory, opt => opt.Ignore())
                .ForMember(dst => dst.ProfessionalDevelopment, opt => opt.Ignore())
                .ForMember(dst => dst.InterestedInNextRole, opt => opt.MapFrom(x => x.InterestedInNextRole))
                .ForMember(dst => dst.LastName, opt => opt.MapFrom(x => x.LastSurname))
                .ForMember(dst => dst.FullName, opt => opt.MapFrom(x => GetFullName(x.FirstName ?? "", x.MiddleName ?? "", x.LastSurname ?? "")))
                .ForMember(dst => dst.District, opt => opt.MapFrom(x => x.Location))
                .ForMember(dst => dst.Phone, opt => opt.MapFrom(x => x.Telephone))
                .ForMember(dst => dst.CurrentPosition, opt => opt.MapFrom(x => x.Position))
                .ForMember(dst => dst.Evaluations, opt => opt.Ignore());
        }
        
        private static string GetFullName(string firstName, string middleName, string lastName)
        {
            var fullName = firstName;

            if (!string.IsNullOrWhiteSpace(middleName))
            {
                fullName += " " + middleName;
            }

            fullName += " " + lastName;

            return fullName;
        }
    }
}
public class PerformanceEvaluation
{
    public required string Title { get; set; }
    public required Dictionary<int, IEnumerable<PerformanceRating>> RatingsByYear { get; set; }
}

public class PerformanceRating
{
    public required string Category { get; set; }
    public decimal Score { get; set; }
    
}

public class PositionHistory
{
    public string? Role { get; set; }
    public string? SchoolName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            // CreateMap<ProfilePositionHistory, PositionHistory>();
            CreateMap<ProfilePositionHistory, PositionHistory>()
                .ForMember(dst => dst.SchoolName, opt => opt.MapFrom(x => x.School));
        }
    }
}

public class Certificate
{
    public string Description { get; set; } = "Default Certificate";
    public string Type { get; set; } = "Default Type";
    public DateTime ValidFromDate { get; set; }
    public DateTime? ValidToDate { get; set; }
    private class Mapping : Profile
    {
        public Mapping()
        {
            // CreateMap<ProfileCertification, Certificate>();
            CreateMap<ProfileCertification, Certificate>()
                .ForMember(dst => dst.Type, opt => opt.MapFrom(x => x.CredentialType))
                .ForMember(dst => dst.ValidFromDate, opt => opt.MapFrom(x => x.IssuanceDate))
                .ForMember(dst => dst.ValidToDate, opt => opt.MapFrom(x => x.ExpirationDate));
        }
        
    }
}

public class ProfessionalDevelopment
{
    public DateTime AttendanceDate { get; set; }
    public required string ProfessionalDevelopmentTitle { get; set; }
    public required string Location { get; set; }
    public required string AlignmentToLeadership { get; set; }
        private class Mapping : Profile
    {
        public Mapping()
        {
            // CreateMap<StaffProfessionalDevelopment, ProfessionalDevelopment>();
            CreateMap<StaffProfessionalDevelopment, ProfessionalDevelopment>()
                .ForMember(dst => dst.AttendanceDate, opt => opt.MapFrom(x => x.AttendanceDate))
                .ForMember(dst => dst.ProfessionalDevelopmentTitle, opt => opt.MapFrom(x => x.ProfessionalDevelopmentTitle))
                .ForMember(dst => dst.Location, opt => opt.MapFrom(x => x.Location))
                .ForMember(dst => dst.AlignmentToLeadership, opt => opt.MapFrom(x => x.AlignmentToLeadership));
        }
    }
}

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, Response>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProfileQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Response> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var profileHeader = await _context.ProfileHeader.FirstOrDefaultAsync(x => x.StaffUniqueId == request.Id, cancellationToken);
        // var profileHeader = await _context.ProfileHeader.FirstOrDefaultAsync();

        // if (profileHeader == null)
        // {
        //     return null;
        // }

        var response = _mapper.Map<Response>(profileHeader);

        var positionHistory = await _context.ProfilePositionHistory.Where(x => x.StaffUniqueId == request.Id)
            .OrderByDescending(x => x.StartDate)
            .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        response.PositionHistory = positionHistory;

        var certificates = await _context.ProfileCertification.Where(x => x.StaffUniqueId == request.Id)
            .ProjectTo<Certificate>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

        response.Certificates = certificates;

        response.ProfessionalDevelopment = await _context.StaffProfessionalDevelopments
            .Where(o => o.StaffUniqueId == request.Id)
            .OrderByDescending(o => o.AttendanceDate)
            .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        response.Evaluations = await BuildChartDataAsync(_context, request.Id, "Texas Principal Evaluation & Support Systems");
        response.Ratings = await BuildChartDataAsync(_context, request.Id, "Garland Leadership Rating");

        return response;
    }

    
            private async Task<IEnumerable<PerformanceEvaluation>> BuildChartDataAsync(IApplicationDbContext _context, 
                    string requestId, string evaluationTitle)
            {
                var sections = new List<PerformanceEvaluation>();

                var staffObjectives = await _context.ProfileEvaluationObjectives
                    .Where(o => o.StaffUniqueId == requestId && o.EvalNumber == 1 && o.EvaluationTitle == evaluationTitle) 
                    .ToListAsync();

                var objectivesByYear = staffObjectives
                    .GroupBy(o => o.SchoolYear)
                    .ToDictionary(g => g.Key, g => g.Select(o =>
                        new PerformanceRating { Category = o.ObjectiveTitle ?? "", Score = o.Rating }));

                sections.Add(new PerformanceEvaluation { Title = "Overall", RatingsByYear = objectivesByYear });

                var staffElements = await _context.ProfileEvaluationElements
                    // .Where(e => e.StaffUniqueId == requestId && e.EvalNumber == 1)
                    .Where(e => e.StaffUniqueId == requestId)
                    .ToListAsync();

                var evalsByObjective = staffElements
                    .GroupBy(e => e.ObjectiveTitle)
                    .Select(o => new PerformanceEvaluation
                    {
                        Title = o.Key ?? "",
                        RatingsByYear = o
                            .GroupBy(g => g.SchoolYear)
                            .ToDictionary(g => g.Key,
                                g => g
                                    .OrderBy(g => g.ElementTitle)
                                    .Select(e => new PerformanceRating {Category = e.ElementTitle ?? "", Score = e.Rating})
                            )
                    })
                    .OrderBy(o => o.Title);

                sections.AddRange(evalsByObjective);

                return sections;
            }
}
