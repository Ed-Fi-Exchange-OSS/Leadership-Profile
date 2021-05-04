using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data
{
    public class EdFiIdentityDbContext : IdentityDbContext
    {
        public EdFiIdentityDbContext(DbContextOptions<EdFiIdentityDbContext> options) : base(options)
        {

        }
    }

}
