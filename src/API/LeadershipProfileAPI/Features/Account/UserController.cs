using System.Threading;
using System.Threading.Tasks;
using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Features.Account;
using LeadershipProfileAPI.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeadershipProfileAPI.Controllers
{
    [TypeFilter(typeof(ApiExceptionFilter))]
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        /// <summary>
        /// Initializes a new instance of the class
        /// </summary>
        /// <param name="mediator"></param>
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Endpoint to handle forgotten passwords
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPasswordAsync(ForgotPasswordModel model, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(new ForgotPassword.Command { Username = model.Username, StaffUniqueId = model.StaffUniqueId }, cancellationToken);

            if (response.Result)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        /// <summary>
        /// Endpoint to handle password resets
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost("resetPassword")]
        [Authorize]
        public async Task<IActionResult> ResetPasswordAsync(ResetPasswordModel model, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(new ResetPassword.Command { Username = model.Username, NewPassword = model.NewPassword, Token = model.Token }, cancellationToken);

            if (response.Result)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        /// <summary>
        /// Endpoint to handle registrations
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel model, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(new Register.Command { Email = model.Email, Password = model.Password, StaffUniqueId = model.StaffUniqueId, Username = model.Username }, cancellationToken);

            // Log successful registrations into the system
            if (response.Result)
            {
                await Login(new LoginInputModel { Username = model.Username, Password = model.Password }, cancellationToken);

                return Ok(response);
            }

            return BadRequest(response);
        }

        /// <summary>
        /// Endpoint to handle logins
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<ObjectResult> Login(LoginInputModel model, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(new Login.Command { HttpContext = HttpContext, Password = model.Password, Username = model.Username }, cancellationToken);

            // Send back the correct result type
            if (response.Result)
            {
                return Ok(response);
            }

            return Unauthorized(response);
        }

        /// <summary>
        /// Endpoint to handle logout
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout(LogoutInputModel model, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(new Logout.Command { ControllerContext = HttpContext, HttpResponse = Response, LogoutId = model.LogoutId, User = User }, cancellationToken);

            if (response.Result)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }
    }
}
