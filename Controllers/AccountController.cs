using thing_faceter.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Linq;

namespace thing_faceter.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        EnvironmentOptions _environmentOptions;
        public  AccountController(IOptions<EnvironmentOptions> env)
        {
            _environmentOptions = env.Value;
        }

        [HttpGet]
        [Route("api/userinfo")]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public ActionResult UserInfo()
        {
            return Ok(User.Claims.ToList().Select(c=> new { c.Type, c.Value, c.ValueType}));
        }

        [AllowAnonymous]
        [Route("Account/Login")]
        public ActionResult Login()
        {
            return Challenge(new AuthenticationProperties { RedirectUri = _environmentOptions.Redirect_Uri },OpenIdConnectDefaults.AuthenticationScheme);
        }

       
        [Route("Account/Logout")]
        public ActionResult Logout()
        {
            string userObjectId = User.GetObjectIdentifierValue();

            //Get an instance of the token cache for the current user request
            IDistributedCache distributedCache = HttpContext.RequestServices.GetRequiredService<IDistributedCache>();

            var cache = new DistributedTokenCache(User, distributedCache);
            AuthenticationContext authContext = new AuthenticationContext(Startup._authority, cache);
            authContext.TokenCache.Clear();

            //Explicitly delete the cookie(this is an IE compatability thing)
            Response.Cookies.Delete("thing_faceter_AUTH");

            // Let Azure AD sign-out
            return SignOut(
                new AuthenticationProperties { RedirectUri = _environmentOptions.Post_Logout_Redirect_Uri },
                CookieAuthenticationDefaults.AuthenticationScheme,
                OpenIdConnectDefaults.AuthenticationScheme
            );
        }
    }
}
