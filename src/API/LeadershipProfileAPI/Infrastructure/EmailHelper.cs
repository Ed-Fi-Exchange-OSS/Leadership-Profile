using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Mail;

namespace LeadershipProfileAPI.Infrastructure
{
    public class EmailHelper
    {
        public bool SendEmail(string userEmail, string resetLink)
        {

#if DEBUG
            //userEmail = "javier.martinez@headspring.com";
            userEmail = "Papercut@user.com";
#endif
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("javier.martinez@headspring.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Confirm your email";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = resetLink;

            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("javier.martinez@headspring.com", "&N\04I?vpfMP");
            client.Host = "smtpout.secureserver.net";
            client.Port = 465;
            client.EnableSsl = true;
            client.Timeout = 20000;

            try
            {
                client.Send(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                // log exception
            }
            return false;
        }
    }
}
