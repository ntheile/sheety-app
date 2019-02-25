using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text;

namespace thing_faceter.Controllers
{
    [Route("api/[controller]")]
    public class EnvironmentController : Controller
    {
        EnvironmentOptions _environmentOptions;
        public EnvironmentController(IOptions<EnvironmentOptions> env)
        {
            _environmentOptions = env.Value;
        }

        [HttpGet]
        public IActionResult GetEnvironment()
        {
            return Ok(JsonConvert.SerializeObject(_environmentOptions, Formatting.None));
        }

        [HttpGet]
        [Route("init")]
        public FileContentResult InitEnvironmentScript()
        {
            string environmentToJson = JsonConvert.SerializeObject(_environmentOptions, Formatting.None);
            string environmentScript = string.Format(@"window.Environment = {0};", environmentToJson);
            byte[] contents = Encoding.ASCII.GetBytes(environmentScript);
            return File(contents, "text/javascript", "environment-init.js");
        }
    }
}
