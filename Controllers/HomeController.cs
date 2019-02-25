using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Options;

namespace thing_faceter.Controllers
{
    public class HomeController : Controller
    {
        private readonly EnvironmentOptions _clientEnvironmentOptions;

        public HomeController(IOptions<EnvironmentOptions> environment)
        {
            _clientEnvironmentOptions = environment.Value;
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
