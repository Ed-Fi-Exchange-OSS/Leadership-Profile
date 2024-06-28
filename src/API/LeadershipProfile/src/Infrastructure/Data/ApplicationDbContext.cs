using System.Reflection;
using LeadershipProfile.Application.Common.Interfaces;
using LeadershipProfile.Domain.Entities;
using LeadershipProfile.Domain.Entities.ListItem;
using LeadershipProfile.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfile.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {        
     }

    // public IConfiguration Configuration { get; }


    public DbSet<TodoList> TodoLists => Set<TodoList>();

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<StaffVacancy> StaffVacancies => Set<StaffVacancy>();

    public DbSet<Staff> Staff => Set<Staff>();
    public DbSet<LeaderSearch> LeaderSearches { get; set; }
    public DbSet<ListItemAssignment> ListItemAssignments => Set<ListItemAssignment>();
    public DbSet<ListItemCategory> ListItemCategories => Set<ListItemCategory>();
    public DbSet<ListItemDegree> ListItemDegrees => Set<ListItemDegree>();
    public DbSet<ListItemSchoolCategory> ListItemSchoolCategories => Set<ListItemSchoolCategory>();
    public DbSet<ListItemInstitution> ListItemItemInstitutions => Set<ListItemInstitution>();
    public DbSet<StaffSearch> StaffSearches { get; set; }
    public DbSet<ActiveStaff> ActiveStaff { get; set; }
    public DbSet<ProfileHeader> ProfileHeader { get; set; }
    public DbSet<ProfilePositionHistory> ProfilePositionHistory { get; set; }
    public DbSet<StaffAdmin> StaffAdmins { get; set; }
    public DbSet<ProfileCertification> ProfileCertification { get; set; }
    public DbSet<ProfileEvaluationObjective> ProfileEvaluationObjectives { get; set; }
    public DbSet<ProfileEvaluationElement> ProfileEvaluationElements { get; set; }
    public DbSet<StaffProfessionalDevelopment> StaffProfessionalDevelopments { get; set; }



    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // var connectionString = Configuration.GetConnectionString("EdFi");
        // optionsBuilder
        //     .UseSqlServer(connectionString,
        //         providerOptions => { providerOptions.EnableRetryOnFailure(); });
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Entity<ListItemAssignment>()
                .ToView("vw_ListAllAssignments", "edfi")
                .HasNoKey();

        builder.Entity<ListItemCategory>()
            .ToView("vw_ListAllCategories", "edfi")
            .HasNoKey();

        builder.Entity<ListItemDegree>()
            .ToView("vw_ListAllDegrees", "edfi")
            .HasNoKey();

        builder.Entity<ListItemSchoolCategory>()
            .ToView("vw_ListAllSchoolCategories", "edfi")
            .HasNoKey();

        builder.Entity<ListItemInstitution>()
            .ToView("vw_ListAllInstitutions", "edfi")
            .HasNoKey();

        builder.Entity<StaffVacancy>()
                .ToView("vw_StaffVacancy", "edfi")
                .HasNoKey();

        builder.Entity<Staff>().ToTable("Staff", schema: "edfi")
                .Property(p => p.LastName).HasColumnName("LastSurname");

        builder.Entity<ProfileHeader>()
                .ToView("vw_LeadershipProfileHeader", "edfi")
                .HasNoKey();
        builder.Entity<ProfilePositionHistory>()
                .ToView("vw_LeadershipProfilePositionHistory", "edfi")
                .HasNoKey();

            builder.Entity<StaffAdmin>()
                .HasKey(k => k.Id);

            builder.Entity<StaffProfessionalDevelopment>()
                .ToView("vw_StaffProfessionalDevelopment", "edfi")
                .HasKey(k => new { k.StaffUsi, k.ProfessionalDevelopmentTitle });

            builder.Entity<ProfileCertification>()
                .ToView("vw_LeadershipProfileCertification", "edfi")
                .HasNoKey();

            builder.Entity<ProfileEvaluationObjective>()
                .ToView("vw_LeadershipProfileEvaluationObjective", "edfi")
                .HasNoKey();

            builder.Entity<ProfileEvaluationElement>()
                .ToView("vw_LeadershipProfileEvaluationElement", "edfi")
                .HasNoKey();


        builder.Entity<LeaderSearch>()
                .ToView("vw_LeaderSearch", "edfi")
                .HasNoKey();
        builder.Entity<StaffSearch>()
                .ToView("vw_StaffSearch", "edfi")
                .HasNoKey();
        builder.Entity<ActiveStaff>()
                .ToView("vw_ActiveStaff", "edfi")
                .HasNoKey();

        base.OnModelCreating(builder);
    }
}
