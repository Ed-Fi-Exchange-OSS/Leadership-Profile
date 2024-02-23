// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Http;
// using IdentityServer4;
// using IdentityServer4.Events;
// using IdentityServer4.Services;

// namespace LeadershipProfile.Application.Account.Commands.Login;
// public record LoginCommand : IRequest<Response>
// {
//     public required string Username { get; set; }
//     public required string Password { get; set; }
//     public required HttpContext HttpContext { get; set; }
// }

// public class Response
// {
//     public bool Result { get; set; }
//     public required string ResultMessage { get; set; }
// }

// public class LoginCommandHandler : IRequestHandler<LoginCommand, Response>
// {
//     private readonly SignInManager<IdentityUser> _signInManager;
//     private readonly IEventService _events;

//     public LoginCommandHandler(SignInManager<IdentityUser> signInManager, IEventService events)
//     {
//         _signInManager = signInManager;
//         _events = events;
//     }

//     public async Task<Response> Handle(LoginCommand request, CancellationToken cancellationToken)
//     {
//         // if (request == null)
//         // {
//         //     throw new ArgumentNullException(nameof(request));
//         // }

//         // // find user by username
//         // var user = await _signInManager.UserManager.FindByNameAsync(request.Username);

//         // // validate username/password using ASP.NET Identity
//         // if (user != null && (await _signInManager.CheckPasswordSignInAsync(user, request.Password, true)) == SignInResult.Success)
//         // {
//         //     await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: "interactive"));

//         //     // issue authentication cookie with subject ID and username
//         //     var identityServerUser = new IdentityServerUser(user.Id) { DisplayName = user.UserName };

//         //     var claims = await _signInManager.UserManager.GetClaimsAsync(user);

//         //     foreach (var claim in claims)
//         //     {
//         //         identityServerUser.AdditionalClaims.Add(claim);
//         //     }

//         //     await request.HttpContext.SignInAsync(identityServerUser, null);

//         //     return new Response { Result = true, ResultMessage = "ok" };
//         // }

//         await _events.RaiseAsync(new UserLoginFailureEvent(request.Username, "Invalid credentials", clientId: "interactive"));

//         return new Response { Result = false, ResultMessage = "Invalid credentials" };
//     }
// }
