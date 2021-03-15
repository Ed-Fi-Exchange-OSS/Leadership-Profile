using AutoMapper;
using AutoMapper.QueryableExtensions;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Features.Profile
{
    public static class Get
    {
        public class Query : IRequest<Response>
        {
            public string Id { get; set; }
        }

        public class Response
        {
            [JsonPropertyName("staffUniqueId")] public string StaffUniqueId { get; set; } = "12345";
            [JsonPropertyName("firstName")] public string FirstName { get; set; } = "First name";
            [JsonPropertyName("middleName")] public string MiddleName { get; set; } = "Middle";
            [JsonPropertyName("lastSurname")] public string LastName { get; set; } = "Last name";
            [JsonPropertyName("fullName")] public string FullName { get; set; } = "First Middle Last";
            public string CurrentPosition { get; set; } = "Default Position";
            public string District { get; set; } = "Default School District";
            public string School { get; set; } = "Default High School";
            public int YearsOfService { get; set; }
            public string Phone { get; set; } = "+12320103203";
            public string Email { get; set; } = "default@email.com";
            public DateTime? StartDate { get; set; }
            public bool InterestedInNextRole { get; set; }
            public IList<TeacherEducation> Education { get; set; }
            public IList<PositionHistory> PositionHistory { get; set; }
            public IList<Certificate> Certificates { get; set; }
            public IList<ProfessionalDevelopment> ProfessionalDevelopment { get; set; }
            public IList<CompetencyRatings> Competencies { get; set; }
            public IList<Category> Category { get; set; }
            public IList<SubCategory> SubCategory { get; set; }
            public IList<ScoresByPeriod> ScoresByPeriod { get; set; }

        }

        public class CompetencyRatings
        {
            public IList<Category> Categories {get;set;}
        }
        public class Category
        {
            public string CategoryTitle { get; set; }
            public IList<SubCategory> SubCatCriteria { get; set; }
        }
        public class SubCategory
        {
            public string SubCatTitle { get; set; } = "Default Sub Category";
            public string SubCatNotes { get; set; } = "Default Note";       
            public IList<ScoresByPeriod> ScoresByPeriod { get; set; }
        }
        public class ScoresByPeriod
        {
            public string Period { get; set; } = "Default Period";
            public double DistrictMin { get; set; } = 0;
            public double DistrictMax { get; set; } = 0;
            public double DistrictAvg { get; set; } = 0;
            public double StaffScore { get; set; } = 0;
            public string StaffScoreNotes { get; set; } = "Default Note";
        }

        public class PositionHistory
        {
            public string Role { get; set; } = "Default Role";
            public string SchoolName { get; set; } = "Default School";
            public DateTime StartDate { get; set; }
            public DateTime? EndDate { get; set; }
        }

        public class Certificate
        {
            public string Description { get; set; } = "Default Certificate";
            public string Type { get; set; } = "Default Type";
            public DateTime ValidFromDate { get; set; }
            public DateTime ValidToDate { get; set; }
        }

        public class ProfessionalDevelopment
        {
            public DateTime AttendanceDate { get; set; }
            public string ProfessionalDevelopmentTitle { get; set; }
            public string Location { get; set; }
            public string AlignmentToLeadership { get; set; }
        }

        public class TeacherEducation
        {
            public string Degree { get; set; }
            public string Specialization { get; set; }
            public string Institution { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly IMapper _mapper;

            public QueryHandler(EdFiDbContext dbContext, IMapper mapper)
            {
                _dbContext = dbContext;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var profileHeader = await _dbContext.ProfileHeader.FirstOrDefaultAsync(x => x.StaffUniqueId == request.Id, cancellationToken);

                if (profileHeader == null)
                {
                    return null;
                }

                var response = _mapper.Map<Response>(profileHeader);

                var positionHistory = await _dbContext.ProfilePositionHistory.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<PositionHistory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.PositionHistory = positionHistory;

                var certificates = await _dbContext.ProfileCertification.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<Certificate>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                response.Certificates = certificates;

                response.Education = await _dbContext.StaffEducations
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<TeacherEducation>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                response.ProfessionalDevelopment = await _dbContext.StaffProfessionalDevelopments
                    .Where(o => o.StaffUniqueId == request.Id)
                    .ProjectTo<ProfessionalDevelopment>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                var competencies = await _dbContext.ProfileCompetency.Where(x => x.StaffUniqueId == request.Id)
                    .ProjectTo<CompetencyRatings>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                var criteria = await _dbContext.ProfileCategory
                    .ProjectTo<Category>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                var subcriteria = await _dbContext.ProfileSubCategory
                    .ProjectTo<SubCategory>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                var scores = await _dbContext.ProfileScoresByPeriod
                    .ProjectTo<ScoresByPeriod>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);

                if (competencies.Count == 0)
                {
                    var random = new Random();

                    competencies = new List<CompetencyRatings>();
                    competencies.Add(new CompetencyRatings());
                    competencies[0].Categories = new List<Category>();

                    competencies[0].Categories.Add(new Category()
                    {
                        CategoryTitle = "Passion for Results",
                        SubCatCriteria = new List<SubCategory>()
                    });
                    competencies[0].Categories.Add(new Category()
                    {
                        CategoryTitle = "Commitment to Growth",
                        SubCatCriteria = new List<SubCategory>()
                    });
                    competencies[0].Categories.Add(new Category()
                    {
                        CategoryTitle = "Heart for Others",
                        SubCatCriteria = new List<SubCategory>()
                    });

                    competencies[0].Categories[0].SubCatCriteria = new List<SubCategory>() {
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Achievement Oriented",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Leading for Equitable Outcomes",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Visionary Leadership",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "subCatTitle 4",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "subCatTitle 5",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        }
                    };
                    competencies[0].Categories[1].SubCatCriteria = new List<SubCategory>() {
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Capacity Development",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Description for  goes here...",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Description for  goes here...",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Description for  goes here...",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Description for  goes here...",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        }
                    };
                    competencies[0].Categories[2].SubCatCriteria = new List<SubCategory>()
                    {
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Recognition of Others",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Collaborative Relationships",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Effective Communication",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Description for  goes here...",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        },
                        new SubCategory()
                        {
                            SubCatNotes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            SubCatTitle = "Description for  goes here...",
                            ScoresByPeriod = new List<ScoresByPeriod>() {
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2016",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2017",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2018",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2019",
                                    StaffScoreNotes = ""
                                },
                                new ScoresByPeriod() {
                                    DistrictAvg = Math.Round(random.NextDouble() * 4, 1),
                                    DistrictMax = 5,
                                    DistrictMin = 0,
                                    StaffScore = Math.Round(random.NextDouble() * 3, 1),
                                    Period = "2020",
                                    StaffScoreNotes = ""
                                },
                            }
                        }
                    };
                }

                response.Competencies = competencies;
                response.Category = criteria;
                response.SubCategory = subcriteria;
                response.ScoresByPeriod = scores;

                response.Phone = (response.Phone == string.Empty || response.Phone == null) ? "713-013-2398" : response.Phone;
                response.Email = (response.Email == string.Empty || response.Email == null) ? "abarough@company.com" : response.Email;
                response.District = (response.District == string.Empty || response.District == null) ? "District" : response.District;
                response.CurrentPosition = (response.CurrentPosition == string.Empty || response.CurrentPosition == null) ? "Location" : response.District;
                response.School = (response.School == string.Empty || response.School == null) ? "School" : response.School;

                if (response.ProfessionalDevelopment.Count == 0)
                {
                    response.ProfessionalDevelopment.Add(new ProfessionalDevelopment()
                    {
                        ProfessionalDevelopmentTitle = "Course Name",
                        AttendanceDate = new DateTime(2019, 6, 10),
                        AlignmentToLeadership = "Default Aligment",
                        Location = "Default Location"
                    });;
                }

                if (response.Certificates.Count == 0)
                {
                    response.Certificates.Add(new Certificate()
                    {
                        Description = "Certificate 1 Description",
                        Type = "Type A",
                        ValidFromDate = new DateTime(2019, 1, 1),
                        ValidToDate = new DateTime(2019, 12, 31),
                    });
                    
                    response.Certificates.Add(new Certificate()
                    {
                        Description = "Certificate 2 Description",
                        Type = "Type B",
                        ValidFromDate = new DateTime(2019, 1, 31),
                        ValidToDate = new DateTime(2019, 12, 31)
                    });
                }

                if (response.Education.Count == 0)
                {
                    response.Education.Add(new TeacherEducation()
                    {
                        Degree = "Bachelor",
                        Institution = "Institute",
                        Specialization = "Education"
                    });

                    response.Education.Add(new TeacherEducation()
                    {
                        Degree = "Master",
                        Institution = "Institute",
                        Specialization = "Psicology"
                    });
                }
                
                if(response.PositionHistory.Count == 0)
                {
                    response.PositionHistory.Add(new PositionHistory()
                    {
                        EndDate = new DateTime(2019,10,10),
                        Role = "Teacher",
                        SchoolName = "School",
                        StartDate = new DateTime(2018, 10, 10),
                    });
                }

                return response;
            }
        }
    }
}
