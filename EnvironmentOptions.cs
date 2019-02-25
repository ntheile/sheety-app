using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace thing_faceter
{
    /// <summary>
    /// Mapping for environment vars found in appsettings.{env}.json 
    /// </summary>
    public class EnvironmentOptions
    {
        public string Api_Uri { get; set; }
        public string Application_Id { get; set; }
        public string Api_Resource_Uri { get; set; }
        public string Application_Insights_Id { get; set; }
        public string Redirect_Uri { get; set; }
        public string Post_Logout_Redirect_Uri { get; set; }
        public string Tenant { get; set; }
    }
}
