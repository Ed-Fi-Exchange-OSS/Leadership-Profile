using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Infrastructure.Email
{
    public class SmtpSender : IEmailSender
    {
        private readonly ILogger<SmtpSender> _logger;
        private readonly EmailSettings _emailSettings;


        public SmtpSender(ILogger<SmtpSender> logger, IOptions<EmailSettings> emailSettings)
        {
            _logger = logger;
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            try
            {
                var msg = new MimeMessage();
                msg.From.Add(MailboxAddress.Parse(_emailSettings.Sender));
                msg.To.Add(MailboxAddress.Parse(email));
                msg.Subject = subject;
                msg.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_emailSettings.Server, _emailSettings.Port).ConfigureAwait(false);

                if (!string.IsNullOrWhiteSpace(_emailSettings.Username))
                {
                    await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password).ConfigureAwait(false);
                }

                await smtp.SendAsync(msg).ConfigureAwait(false);
                await smtp.DisconnectAsync(true).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Failed to send email to {email}", email);
            }
        }
    }
}
