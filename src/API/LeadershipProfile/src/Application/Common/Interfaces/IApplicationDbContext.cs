using LeadershipProfile.Domain.Entities;
using LeadershipProfile.Domain.Entities.ListItem;

namespace LeadershipProfile.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }
    DbSet<Staff> Staff { get; }
    DbSet<StaffVacancy> StaffVacancies { get; }
    DbSet<LeaderSearch> LeaderSearches { get; set; }
    DbSet<ListItemAssignment> ListItemAssignments { get;}
    DbSet<ListItemCategory> ListItemCategories { get;}
    DbSet<ListItemDegree> ListItemDegrees { get; }
    DbSet<ListItemSchoolCategory> ListItemSchoolCategories { get; }
    DbSet<ListItemInstitution> ListItemItemInstitutions { get; }
    DbSet<ActiveStaff> ActiveStaff { get; set; }
    DbSet<StaffSearch> StaffSearches { get; set; }
    DbSet<ProfileHeader> ProfileHeader { get; set; }
    DbSet<ProfilePositionHistory> ProfilePositionHistory { get; set; }
    DbSet<StaffAdmin> StaffAdmins { get; set; }
    DbSet<ProfileCertification> ProfileCertification { get; set; }
    DbSet<ProfileEvaluationObjective> ProfileEvaluationObjectives { get; set; }
    DbSet<ProfileEvaluationElement> ProfileEvaluationElements { get; set; }
    DbSet<StaffProfessionalDevelopment> StaffProfessionalDevelopments { get; set; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
