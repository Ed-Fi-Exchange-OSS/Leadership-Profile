using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Infrastructure.Email
{
    public class EmailSettings
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string Sender { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}