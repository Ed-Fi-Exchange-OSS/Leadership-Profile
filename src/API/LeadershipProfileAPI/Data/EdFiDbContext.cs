﻿using System;
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
        public DbSet<StaffAdmin> StaffAdmins { get; set; }
        public DbSet<StaffCertificate> StaffCertificates { get; set; }
        public DbSet<StaffPerformanceMeasure> StaffPerformanceMeasures { get; set; }
        public DbSet<StaffProfessionalDevelopment> StaffProfessionalDevelopments { get; set; }

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

            modelBuilder.Entity<StaffAdmin>()
                .HasKey(k => k.Id);

            modelBuilder.Entity<StaffEducation>()
                .ToView("vw_StaffEducations", "edfi")
                .HasKey(k => new { k.StaffUsi, k.TeacherPreparationProgramName });

            modelBuilder.Entity<StaffPerformanceMeasure>()
                .HasKey(k => new { k.StaffUsi, k.Category, k.SubCategory, k.MeasureDate });

            modelBuilder.Entity<StaffProfessionalDevelopment>()
                .ToView("vw_StaffProfessionalDevelopment", "edfi")
                .HasKey(k => new { k.StaffUsi, k.ProfessionalDevelopmentTitle });

            modelBuilder.Entity<StaffCertificate>()
                .ToView("vw_LeadershipProfileCertification", "edfi")
                .HasKey(k => new { k.StaffUsi, k.Description });
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
