using System;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ListItem;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data
{
    public class EdFiDbContext : DbContext
    {
        public EdFiDbContext(DbContextOptions<EdFiDbContext> options) : base(options)
        {

        }

        public DbSet<Staff> Staff { get; set; }
        public DbSet<StaffEducation> StaffEducations { get; set; }
        public DbSet<ProfileList> ProfileList { get; set; }
        public DbSet<ProfileHeader> ProfileHeader { get; set; }
        public DbSet<ProfilePositionHistory> ProfilePositionHistory { get; set; }
        public DbSet<StaffAdmin> StaffAdmins { get; set; }
        public DbSet<StaffSearch> StaffSearches { get; set; }
        public DbSet<ListItemAssignment> ListItemAssignments { get; set; }
        public DbSet<ListItemCategory> ListItemCategories { get; set; }
        public DbSet<ListItemCertification> ListItemCertifications { get; set; }
        public DbSet<ListItemDegree> ListItemDegrees { get; set; }
        public DbSet<ListItemSubCategory> ListItemSubCategories { get; set; }
        public DbSet<StaffCertificate> StaffCertificates { get; set; }
        public DbSet<StaffPerformanceMeasure> StaffPerformanceMeasures { get; set; }
        public DbSet<StaffProfessionalDevelopment> StaffProfessionalDevelopments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ListItemAssignment>()
                .ToView("vw_ListAllAssignments", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ListItemCategory>()
                .ToView("vw_ListAllCategories", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ListItemCertification>()
                .ToView("vw_ListAllCertifications", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ListItemDegree>()
                .ToView("vw_ListAllDegrees", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ListItemSubCategory>()
                .ToView("vw_ListAllSubCategories", "edfi")
                .HasNoKey();

            modelBuilder.Entity<Staff>().ToTable("Staff", schema: "edfi")
                .Property(p => p.LastName).HasColumnName("LastSurname");

            modelBuilder.Entity<ProfileList>()
                .ToView("vw_LeadershipProfileList", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ProfileHeader>()
                .ToView("vw_LeadershipProfileHeader", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ProfilePositionHistory>()
                .ToView("vw_LeadershipProfilePositionHistory", "edfi")
                .HasNoKey();

            modelBuilder.Entity<StaffAdmin>()
                .HasKey(k => k.Id);

            modelBuilder.Entity<StaffEducation>()
                .ToView("vw_StaffEducations", "edfi")
                .HasKey(k => new { k.StaffUsi, k.TeacherPreparationProgramName });

            modelBuilder.Entity<StaffProfessionalDevelopment>()
                .ToView("vw_StaffProfessionalDevelopment", "edfi")
                .HasKey(k => new { k.StaffUsi, k.ProfessionalDevelopmentTitle });

            modelBuilder.Entity<StaffSearch>()
                .ToView("vw_StaffSearch", "edfi")
                .HasNoKey();
        }
    }

    public class Staff
    {
        public int StaffUSI { get; set; }
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string StaffUniqueId { get; set; }
        public string TpdmUsername { get; set; }
    }
}
