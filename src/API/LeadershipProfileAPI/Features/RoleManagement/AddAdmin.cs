using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using LeadershipProfileAPI.Data;
using LeadershipProfileAPI.Features.Profile;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace LeadershipProfileAPI.Features.RoleManagement
{
    public class AddAdmin
    {
        public class Request
        {
            public string[] StaffUniqueIds { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
        }

        public class Handle : IRequestHandler<Request, Response>
        {
            private readonly EdFiDbContext _ctx;
            private readonly UserManager<IdentityUser> _userManager;

            public Handle(EdFiDbContext ctx, UserManager<IdentityUser> userManager)
            {
                _ctx = ctx;
                _userManager = userManager;
            }

            // foreach (var id in staffUniqueIds)
            // {
            //     var staff = await _dbContext.Staff.SingleOrDefaultAsync(x => x.StaffUniqueId == id);
            //     var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == staff.TpdmUsername);
            //     await _userManager.AddClaimsAsync(user, new Claim[]
            //     {
            //         new ("role", "Admin")
            //     });
            // }
            public Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
