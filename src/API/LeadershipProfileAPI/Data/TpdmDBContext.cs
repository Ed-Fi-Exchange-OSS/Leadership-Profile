using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LeadershipProfileAPI.Data
{
    public class TpdmDBContext:IdentityDbContext
    {
        public TpdmDBContext(DbContextOptions<TpdmDBContext> options):base(options)
        {
            
        }
    }
}
