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
        public static List<string> AnonymousRoutes = new List<string> { "/api", "/forbidden", "/notfound", "/loggedout" };
        public IConfiguration Configuration { get; }

        public IHostingEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration)
        {

            Configuration = configuration;
            
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            // Register the IConfiguration instance which MyOptions binds against.
            services.Configure<EnvironmentOptions>(Configuration.GetSection("Environment"));

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
            // Add header
            app.Use(async (context, nextMiddleware) =>
            {
                context.Response.OnStarting(() =>
                {
                    context.Response.Headers.Add("can't-be-evil", "true");

                    // delete cookies 
                    foreach (var cookie in context.Request.Cookies.Keys)
                    {
                        context.Response.Cookies.Delete(cookie);
                    }

                    return Task.FromResult(0);
                });
                await nextMiddleware();
            });

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
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });


            // app.UseWhen(IsUnauthenticatedSpaPath, TriggerSignIn);

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
