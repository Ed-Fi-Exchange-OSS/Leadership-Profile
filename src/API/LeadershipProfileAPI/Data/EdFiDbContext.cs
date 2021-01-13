using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data
{
    public class EdFiDbContext : DbContext
    {
        public EdFiDbContext(DbContextOptions<EdFiDbContext> options) : base(options)
        {

        }
        public DbSet<Staff> Staff { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {   
            modelBuilder.Entity<Staff>().ToTable("Staff", schema:"edfi")
                .Property(p=>p.LastName).HasColumnName("LastSurname");
        }
    }
}