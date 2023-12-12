using Application.ViewModel;
using Application.Web;
using Application.Web.Extensions;
using Application.Web_Fashion.Middleware;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Razor;

var builder = WebApplication.CreateBuilder(args);
int timeOutInMinutes = 40;

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.AddRazorPages()
    .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
    .AddDataAnnotationsLocalization();

// Add services to the container.
builder.Services.AddControllersWithViews()
                    .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null); // By default json does not preserve the property name casing. This line keeps the object naming case as it is

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(timeOutInMinutes); // Session Timeout  
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSeettings"));

builder.Services.AddAuthentication(config =>
{
    config.DefaultScheme = "cookie_jwt";
})
.AddPolicyScheme("cookie_jwt", "Cookie or Jwt", options =>
{
    options.ForwardDefaultSelector = context =>
    {
        context.Request.Headers.TryGetValue("Authorization", out var headerValue);
        var bearerAuth = headerValue.ToString().StartsWith("Bearer ") ? true : false;

        if (bearerAuth)
        {
            return JwtBearerDefaults.AuthenticationScheme;
        }
        else
        {
            return CookieAuthenticationDefaults.AuthenticationScheme;
        }
    };
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    options.LoginPath = new PathString("/security/login");
    options.AccessDeniedPath = new PathString("/security/login");
    options.LogoutPath = new PathString("/security/logout");
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(timeOutInMinutes);
});

ConfigurationManager configuration = builder.Configuration;
builder.Services.AddDatabase(configuration);
builder.Services.AddRepositories();
builder.Services.AddServices();

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

var app = builder.Build();
var supportedCultures = new[] { "uk", "en" };
var localizationOptions = new RequestLocalizationOptions()
    .SetDefaultCulture(supportedCultures[0])
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures);

app.UseRequestLocalization(localizationOptions);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.UseMiddleware<LanguageMiddleware>();

AppHttpContext.Services = app.Services; // .ApplicationServices;

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();