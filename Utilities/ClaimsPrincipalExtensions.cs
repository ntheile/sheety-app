using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace thing_faceter.Utility
{
	public static class ClaimsPrincipalExtensions
	{
		public static string FindFirstValue(this ClaimsPrincipal principal, string claimType, bool throwIfNotFound = false)
		{
			Guard.ArgumentNotNull(principal, nameof(principal));

			var value = principal.FindFirst(claimType)?.Value;
			if (throwIfNotFound && string.IsNullOrWhiteSpace(value))
			{
				throw new InvalidOperationException(
					string.Format(CultureInfo.InvariantCulture, "The supplied principal does not contain a claim of type {0}", claimType));
			}

			return value;
		}

		public static string GetIssuerValue(this ClaimsPrincipal principal, bool throwIfNotFound = true)
		{
			return principal.FindFirstValue("iss", throwIfNotFound);
		}

		/// <summary>
		/// Extension method on <see cref="System.Security.Claims.ClaimsPrincipal"/> which returns the AAD Tenant ID, if it exists.
		/// </summary>
		/// <param name="principal">A <see cref="System.Security.Claims.ClaimsPrincipal"/> representing the currently signed in ASP.NET user.</param>
		/// <returns>The AAD Tenant ID if it exists, otherwise, an exception is thrown.</returns>
		public static string GetTenantIdValue(this ClaimsPrincipal principal)
		{
			return principal.FindFirstValue("http://schemas.microsoft.com/identity/claims/tenantid", true);
		}

		public static string GetObjectIdentifierValue(this ClaimsPrincipal principal, bool throwIfNotFound = true)
		{
			return principal.FindFirstValue("http://schemas.microsoft.com/identity/claims/objectidentifier", throwIfNotFound);
		}

		public static string GetDisplayNameValue(this ClaimsPrincipal principal)
		{
			return principal.FindFirstValue("name", true);
		}

		public static string GetEmailValue(this ClaimsPrincipal principal)
		{
			return principal.FindFirstValue(ClaimTypes.Email, true);
		}

		public static string GetUserName(this ClaimsPrincipal principal)
		{
			return principal.FindFirstValue(ClaimsIdentity.DefaultNameClaimType);
		}

		public static bool IsSignedInToApplication(this ClaimsPrincipal principal)
		{
			Guard.ArgumentNotNull(principal, nameof(principal));
			return principal.Identity != null && principal.Identity.IsAuthenticated;
		}
	}
}
