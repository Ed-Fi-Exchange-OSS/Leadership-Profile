using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LeadershipProfileAPI.Features.UserClaims
{
    public class Create
    {
        public class Command : IRequest<Response>
        {
            public string ClaimType { get; set; }
            public string ClaimValue { get; set; }
            public ICollection<string> StaffUniqueIds { get; set; }
        }

        public class Response
        {
            public string ResultMessage { get; set; }
            public ICollection<object> UserResults { get; set; }

            public Response()
            {
                UserResults = new List<object>();
            }
        }

        public class UserRolesHandler : IRequestHandler<Command, Response>
        {
            private readonly EdFiDbContext _dbContext;
            private readonly UserManager<IdentityUser> _userManager;

            public UserRolesHandler(
                EdFiDbContext dbContext,
                UserManager<IdentityUser> userManager)
            {
                _dbContext = dbContext;
                _userManager = userManager;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                var response = new Response();

                // Get all the usernames from the ids provided
                var users = await GetIdentitiesFromIdsAsync(request.StaffUniqueIds, cancellationToken);

                // Iterate the identity users and add the claim
                foreach (var user in users)
                {
                    response.UserResults.Add(await AddClaimAsync(user, request.ClaimType, request.ClaimValue));
                }

                response.ResultMessage = $"Processed {users.Count()} records";

                return response;
            }

            /// <summary>
            /// Method iterates a list of StaffUniqueId identifiers and requests a collection of 
            /// IdentityUser objects by username
            /// </summary>
            /// <param name="staffUniqueIds">Collection of string StaffUniqueId's</param>
            /// <param name="cancellationToken"></param>
            /// <returns></returns>
            public async Task<IEnumerable<IdentityUser>> GetIdentitiesFromIdsAsync(IEnumerable<string> staffUniqueIds, CancellationToken cancellationToken)
            {
                var identities = new List<IdentityUser>();

                // Do we have something to do?
                if (staffUniqueIds == null)
                {
                    return identities;
                }

                // Get all the usernames from the ids provided
                var userNames = await _dbContext.Staff
                .Where(o => staffUniqueIds.Any(s => s == o.StaffUniqueId))
                .Select(s => s.TpdmUsername)
                .ToListAsync(cancellationToken);

                // Get all IdentityUser objects from the usernames
                identities = await _userManager.Users
                    .Where(o => userNames.Any(u => u == o.UserName))
                    .ToListAsync(cancellationToken);

                return identities;
            }

            /// <summary>
            /// Method adds a new claim to a user
            /// </summary>
            /// <param name="user">User the claim is being added to</param>
            /// <param name="claimType">The claim type</param>
            /// <param name="claimValue">The claim value</param>
            /// <returns></returns>
            public async Task<object> AddClaimAsync(IdentityUser user, string claimType, string claimValue)
            {
                // Current user claims
                var userClaims = await _userManager.GetClaimsAsync(user);

                // Make sure user does not already have this claim
                if (userClaims.FirstOrDefault(o => o.Type == claimType && o.Value == claimValue) == null)
                {
                    // Add the claim to the user
                    var result = await _userManager.AddClaimAsync(user, new Claim(claimType, claimValue));

                    return new { user.UserName, result.Succeeded, result.Errors };
                }
                else
                {
                    return new { user.UserName, Succeeded = false, Message = "Claim already added" };
                }
            }
        }
    }
}
