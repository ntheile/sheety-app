using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace thing_faceter
{
    public class Program
    {
        public static void Main(string[] args)
        {
         
         
            CreateWebHostBuilder(args).Build().Run();
           
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
          /*
          *CreateDefaultBuilder configures:
          *Kestrel
          *appSettings.*.json
          *Adds User Secrets if Development
          *Configures logging
          *UseIISIntegration
          *Command line args if provided
          See here for what CreatewEbHostBuilder is actually doing:
            https://github.com/aspnet/MetaPackages/blob/dev/src/Microsoft.AspNetCore/WebHost.cs#L148 
           */
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
