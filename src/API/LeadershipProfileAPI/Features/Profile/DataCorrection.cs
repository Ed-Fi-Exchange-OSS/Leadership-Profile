using AutoMapper.Configuration;
using LeadershipProfileAPI.Infrastructure;
using LeadershipProfileAPI.Infrastructure.Email;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Features.Profile
{
    public class DataCorrection
    {
        public class Command : IRequest<Response>
        {
            public string StaffUniqueId { get; set; }
            public string UserFullName { get; set; }
            public string StaffEmail { get; set; }
            public string MessageSubject { get; set; }
            public string MessageDescription { get; set; }
        }

        public class Response
        {
            public bool Result { get; set; }
            public string ResultMessage { get; set; }
        }

        public IConfiguration Configuration { get; }

        public class CommandHandler : IRequestHandler<Command, Response>
        {
            private readonly IEmailSender _emailSender;
            private readonly DataCorrectionSettings _configSettings;
            private readonly ILogger<CommandHandler> _logger;

            public CommandHandler(
                IEmailSender emailSender,
                IOptions<DataCorrectionSettings> configSettings,
                ILogger<CommandHandler> logger)
            {
                _emailSender = emailSender;
                _configSettings = configSettings.Value;
                _logger = logger;
            }

            public async Task<Response> Handle(Command request, CancellationToken cancellationToken)
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                var response = new Response
                {
                    Result = true,
                    ResultMessage = "An email will be sent to the email address on file in the system."
                };

                var adminEmail = _configSettings.AdminEmail;

                var message = request.MessageDescription;

                await _emailSender.SendEmailAsync(adminEmail, $"{request.MessageSubject} - {request.StaffUniqueId}", message);

                return response;
            }
        }
    }
}
