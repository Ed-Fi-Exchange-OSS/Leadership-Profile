using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace LeadershipProfileAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpClientFactory _clientFactory;

        public HomeController(ILogger<HomeController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _clientFactory = clientFactory;
        }

        [HttpGet]
        public async Task<IEnumerable<TeacherProfile>> Get()
        {

            var client = _clientFactory.CreateClient("ODS-API-Client");

            var fragment = "v5.0.0/api/data/v3";

            var response = await client.GetAsync($"{fragment}/ed-fi/staffs");

            response.EnsureSuccessStatusCode();

            var readAsString = await response.Content.ReadAsStringAsync();
         
            var teachers = JsonConvert.DeserializeObject<IList<TeacherProfile>>(JArray.Parse(readAsString).ToString());

            return teachers;
        }
    }

  
    public class TeacherProfile
    {
        [Newtonsoft.Json.JsonProperty("staffUniqueId")]
        public string Id { get; set; }
        [Newtonsoft.Json.JsonProperty("firstName")]
        public string FirstName { get; set; }
        [Newtonsoft.Json.JsonProperty("middleName")]
        public string MiddleName { get; set; }
        [Newtonsoft.Json.JsonProperty("lastSurname")]
        public string LastName { get; set; }
    }
}
