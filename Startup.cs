using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using thing_faceter.Utility;
using Microsoft.AspNetCore.Rewrite;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Antiforgery;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using System.Collections.Generic;
using System.Net;

namespace thing_faceter
{
    public class Startup
    {
        public static string _clientID = "";
        public static string _clientSecret = "";
        public static string _authority = "https://login.microsoftonline.com/c3e32f53-cb7f-4809-968d-1cc4ccc785fe";
        private string _redirectUri = "";
        public static string _resourceID = "";
        public static List<string> AnonymousRoutes = new List<string> { "/api", "/forbidden", "/notfound", "/loggedout" };
        public IConfiguration Configuration { get; }

        public IHostingEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration)
        {

            Configuration = configuration;


            _clientSecret = Configuration["Environment:Client_Secret"];
            _resourceID = Configuration["Environment:Api_Resource_Uri"];
            _clientID = Configuration["Environment:Application_Id"];
            _redirectUri = Configuration["Environment:Redirect_Uri"];
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            // Register the IConfiguration instance which MyOptions binds against.
            services.Configure<EnvironmentOptions>(Configuration.GetSection("Environment"));

            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                auth.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                auth.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie(options =>
            {
                options.Cookie.Name = "thing_faceter_AUTH";                
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.Expiration = TimeSpan.FromHours(1);
                options.LoginPath = new PathString("/Account/Login");
                options.LogoutPath = new PathString("/Account/Logout");
                options.AccessDeniedPath = new PathString("/forbidden"); 
                // The default setting for cookie expiration is 14 days. SlidingExpiration is set to true by default
                options.ExpireTimeSpan = TimeSpan.FromHours(1);
                options.SlidingExpiration = true;
                options.Events.OnRedirectToLogin = ctx =>
                {
                    if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == (int)HttpStatusCode.OK)
                    {
                        ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    }
                    else
                    {
                        ctx.Response.Redirect(ctx.RedirectUri);
                    }
                    return Task.FromResult(0);
                };
                options.Events.OnRedirectToAccessDenied = (ctx) =>
                {
                    if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == (int)HttpStatusCode.OK)
                    {
                        ctx.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    }
                    else
                        ctx.Response.Redirect(ctx.RedirectUri);
                    return Task.CompletedTask;
                };
            })
            .AddOpenIdConnect(oidcOptions =>
            {
                oidcOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                oidcOptions.ClientId = _clientID;
                oidcOptions.ClientSecret = _clientSecret;
                oidcOptions.Authority = _authority;
                oidcOptions.ResponseType = OpenIdConnectResponseType.CodeIdToken;
                oidcOptions.SaveTokens = true;
                oidcOptions.ClaimActions.Remove("amr");
                oidcOptions.ClaimActions.Remove("aud");
                oidcOptions.ClaimActions.Remove("iss");
                oidcOptions.ClaimActions.Remove("iat");
                oidcOptions.ClaimActions.Remove("nbf");
                oidcOptions.ClaimActions.Remove("exp");
                oidcOptions.Events = new OpenIdConnectEvents
                {
                    OnTicketReceived = context =>
                    {
                        context.Properties.IsPersistent = true;
                        return Task.FromResult(0);
                    },
                    OnAuthorizationCodeReceived = async (context) =>
                    {
                        // Acquire a Token for the API and cache it in the Distributed Token Cache using ADAL
                        string userObjectId = (context.Principal.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier"))?.Value;
                        ClientCredential credentials = new ClientCredential(_clientID, _clientSecret);

                        //Get an instance of the token cache for the current user request
                        IDistributedCache distributedCache = context.HttpContext.RequestServices.GetRequiredService<IDistributedCache>();
                        var cache = new DistributedTokenCache(context.Principal, distributedCache);
                        AuthenticationContext authContext = new AuthenticationContext(_authority, cache);

                        AuthenticationResult authResult = await authContext.AcquireTokenByAuthorizationCodeAsync(context.ProtocolMessage.Code,
                            new Uri(context.Properties.Items[OpenIdConnectDefaults.RedirectUriForCodePropertiesKey]), credentials, _resourceID);

                        // Notify the OIDC middleware that we already took care of code redemption.
                        context.HandleCodeRedemption(authResult.AccessToken, authResult.IdToken);
                    },
                    OnRemoteFailure = OnAuthenticationFailed

                };
            });

            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IAntiforgery antiforgery)
        {


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                //Don't force https redirect in dev environment
                //Redirect all non-http requests to https globally
                var options = new RewriteOptions().AddRedirectToHttps();
                app.UseRewriter(options);
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            // Configure XSRF middleware, This pattern is for SPA style applications where XSRF token is added on Index page 
            // load and passed back token on every subsequent async request            
            app.Use(async (context, next) =>
            {
                if (string.Equals(context.Request.Path.Value, "/", StringComparison.OrdinalIgnoreCase))
                {
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions() { HttpOnly = false });
                }
                await next.Invoke();
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });


            app.UseWhen(IsUnauthenticatedSpaPath, TriggerSignIn);

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                /*
                // If you want to enable server-side rendering (SSR),
                // [1] In ng_template.csproj, change the <BuildServerSideRenderer> property
                //     value to 'true', so that the SSR bundle is built during publish
                // [2] Uncomment this code block
                spa.UseSpaPrerendering(options =>
                {
                  options.BootModulePath = $"{spa.Options.SourcePath}/dist-server/main.bundle.js";
                  options.BootModuleBuilder = env.IsDevelopment() ? new AngularCliBuilder(npmScript: "build:ssr") : null;
                  options.ExcludeUrls = new[] { "/sockjs-node" };
                });
                        */

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }

        // Handle sign-in errors differently than generic errors.
        private Task OnAuthenticationFailed(RemoteFailureContext context)
        {
            context.HandleResponse();
            var message = Regex.Replace(context.Failure?.Message, @"[^\u001F-\u007F]+", string.Empty);
            context.Response.Redirect("/Home/Error?message=" + message);
            return Task.FromResult(0);
        }

        private static bool IsUnauthenticatedSpaPath(HttpContext context)
        {
            var unAuthenticated = !context.User.Identity.IsAuthenticated;
            var noExtention = !Path.HasExtension(context.Request.Path.Value);
            var isAnonymousRoute = AnonymousRoutes.Exists((anonRoute) => context.Request.Path.Value.StartsWith(anonRoute, StringComparison.OrdinalIgnoreCase));
            var isDevelopmentWebSocket = context.Request.Path.Value.StartsWith("/sockjs-node", StringComparison.OrdinalIgnoreCase);
            return !isAnonymousRoute && unAuthenticated && noExtention && !isDevelopmentWebSocket;
        }

        private static void TriggerSignIn(IApplicationBuilder app)
        {

            app.Run(context =>
            {
                context.Response.Redirect("/Account/Login");
                return Task.FromResult(0);
            });
        }
    }
}
