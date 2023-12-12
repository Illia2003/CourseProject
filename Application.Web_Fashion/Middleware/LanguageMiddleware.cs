using System.Globalization;

namespace Application.Web_Fashion.Middleware
{
    public class LanguageMiddleware
    {
        private readonly RequestDelegate _next;

        public LanguageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var cultureQuery = context.Request.Query["culture"];
            var cultureCookie = context.Request.Cookies["culture"];

            if (!string.IsNullOrWhiteSpace(cultureQuery))
            {
                var culture = new CultureInfo(cultureQuery);
                SetCulture(context, culture);
            }else if(!string.IsNullOrWhiteSpace(cultureCookie))
            {
                var culture = new CultureInfo(cultureCookie);
                SetCulture(context, culture);
            }

            await _next(context);
        }

        public void SetCulture(HttpContext context, CultureInfo culture)
        {
            System.Threading.Thread.CurrentThread.CurrentCulture = culture;
            System.Threading.Thread.CurrentThread.CurrentUICulture = culture;
            context.Response.Cookies.Append("culture", culture.Name);
        }
    }
}
