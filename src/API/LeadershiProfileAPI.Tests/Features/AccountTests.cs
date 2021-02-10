using LeadershipProfileAPI.Controllers;
using LeadershipProfileAPI.Features.Account;
using Microsoft.AspNetCore.Http;
using Shouldly;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace LeadershipProfileAPI.Tests.Features
{
    public class AccountTests
    {
        [Theory]
        [InlineData("bobmarley", "12345", true)]
        [InlineData("whatever", "0132398", true)]
        public async Task AccountForgotPassword(string username, string staffUniqueId, bool expectedResult)
        {
            var response = await Testing.Send(
                new ForgotPassword.Command
                {
                    Username = username,
                    StaffUniqueId = staffUniqueId
                });

            response.Result.ShouldBe(expectedResult, response.ResultMessage);
        }

        //[Fact]
        //public async Task AccountLogin()
        //{
        //    var controller = new AccountController(null)
        //    {
        //        ControllerContext = new Microsoft.AspNetCore.Mvc.ControllerContext()
        //    };

        //    controller.ControllerContext.HttpContext = new DefaultHttpContext();

        //    var regResponse = await Testing.Send(
        //        new Register.Command
        //        {
        //            Email = "mirayda.torresavila@utrgv.edu",
        //            Password = "thisIsapassword123!",
        //            StaffUniqueId = "20283167",
        //            Username = "mtorresavila"
        //        });

        //    var logResponse = await Testing.Send(
        //        new Login.Command
        //        {
        //            HttpContext = controller.HttpContext,
        //            Password = "thisIsapassword123!",
        //            Username = "mtorresavila"
        //        });

        //    var delResponse = await Testing.Send(new Delete.Command { Username = "mtorresavila" });

        //    regResponse.Result.ShouldBe(true, regResponse.ResultMessage);
        //    logResponse.Result.ShouldBe(true, logResponse.ResultMessage);
        //    delResponse.Result.ShouldBe(true, delResponse.ResultMessage);
        //}

        [Fact]
        public async Task AccountRegister()
        {
            var regResponse = await Testing.Send(
                new Register.Command
                {
                    Email = "mirayda.torresavila@utrgv.edu",
                    Password = "thisIsapassword123!",
                    StaffUniqueId = "20283167",
                    Username = "mtorresavila"
                });

            var delResponse = await Testing.Send(new Delete.Command { Username = "mtorresavila" });

            regResponse.Result.ShouldBe(true, regResponse.ResultMessage);
            delResponse.Result.ShouldBe(true, delResponse.ResultMessage);
        }

        //[Fact]
        //public async Task AccountResetPassword()
        //{
        //    var regResponse = await Testing.Send(
        //        new ResetPassword.Command
        //        {
        //            Username = "mtorresavila",
        //            NewPassword = "thisIsAnewPassword987#",
        //            Token = "xyz"
        //        });

        //    var delResponse = await Testing.Send(new Delete.Command { Username = "mtorresavila" });

        //    regResponse.Result.ShouldBe(true, regResponse.ResultMessage);
        //    delResponse.Result.ShouldBe(true, delResponse.ResultMessage);
        //}
    }
}
