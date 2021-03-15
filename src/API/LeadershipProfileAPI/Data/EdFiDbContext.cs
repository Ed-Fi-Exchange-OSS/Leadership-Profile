using System;
using System.Diagnostics;
using LeadershipProfileAPI.Data.Models;
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
        public DbSet<ProfileCertification> ProfileCertification { get; set; }
        public DbSet<ProfileEducation> ProfileEducation { get; set; }
        public DbSet<StaffProfessionalDevelopment> StaffProfessionalDevelopments { get; set; }
        public DbSet<StaffAdmin> StaffAdmins { get; set; }
        //public DbSet<ProfileCompetency> ProfileCompetency { get; set; }
        //public DbSet<ProfileCategory> ProfileCategory { get; set; }
        //public DbSet<ProfileSubCategory> ProfileSubCategory { get; set; }
        //public DbSet<ProfileScoresByPeriod> ProfileScoresByPeriod { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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

            modelBuilder.Entity<ProfileCertification>()
                .ToView("vw_LeadershipProfileCertification", "edfi")
                .HasNoKey();

            modelBuilder.Entity<ProfileEducation>()
                .ToView("vw_LeadershipProfileEducation", "edfi")
                .HasNoKey();

            modelBuilder.Entity<StaffAdmin>()
                .HasKey(k => k.Id);

            modelBuilder.Entity<StaffEducation>()
                .ToView("vw_StaffEducations", "edfi")
                .HasKey(k => new { k.StaffUsi, k.TeacherPreparationProgramName });

            modelBuilder.Entity<StaffProfessionalDevelopment>()
                .ToView("vw_StaffProfessionalDevelopment", "edfi")
                .HasKey(k => new { k.StaffUsi, k.ProfessionalDevelopmentTitle });

            //modelBuilder.Entity<ProfileCategory>()
            //   .HasOne<ProfileCompetency>()
            //   .WithMany(o => o.Categories)
            //   .HasForeignKey(k => k.CompetencyId)
            //   .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<ProfileSubCategory>()
            //    .HasOne<ProfileCategory>()
            //    .WithMany(o => o.SubCategories)
            //    .HasForeignKey(k => k.CategoryId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<ProfileScoresByPeriod>()
            //    .HasOne<ProfileSubCategory>()
            //    .WithMany(o => o.ScoresByPeriod)
            //    .HasForeignKey(k => k.SubCategoryId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<ProfileCompetency>()
            //    .ToTable("ProfileCompetency")
            //    .HasKey(k => k.CompetencyId);

            //modelBuilder.Entity<ProfileCategory>()
            //    .ToTable("ProfileCategory")
            //    .HasKey(k => k.CategoryId);

            //modelBuilder.Entity<ProfileSubCategory>()
            //    .ToTable("ProfileSubCategory")
            //    .HasKey(k => k.SubCategoryId);

            //modelBuilder.Entity<ProfileScoresByPeriod>()
            //    .ToTable("ProfileScoresByPeriod")
            //    .HasKey(k => k.ScoresByPeriodId);
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
