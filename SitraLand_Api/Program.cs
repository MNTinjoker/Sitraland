using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SitraLand_Api;
using SitraLand_Api.Data;
using SitraLand_Api.Services.Implementations;
using SitraLand_Api.Services.Interfaces;
using static System.Net.WebRequestMethods;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("sqlConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IProductsService, ProductsService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IBasketService, BasketService>();

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddHttpContextAccessor();
builder.Services.AddResponseCaching();

// The customers are on slow mobile networks, every response is sent compressed.
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
    {
        "application/json",
        "application/javascript",
        "text/javascript",
        "application/octet-stream",
        "image/svg+xml"
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSpaStaticFiles(configurations =>
{
    configurations.RootPath = "ClientApp/dist";
});

// Only explicitly configured origins may call the API from another host.
// The live site is served on www.sitraland.com, the apex domain redirects to it.
// The configured origins are added to the defaults, so a stale configuration
// file cannot lock the site out again.
var defaultOrigins = new[]
{
    "https://www.sitraland.com",
    "http://www.sitraland.com",
    "https://sitraland.com",
    "http://sitraland.com",
    "http://localhost:4200",
    "https://localhost:4200"
};

var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
var allowedOrigins = defaultOrigins.Concat(configuredOrigins).Distinct().ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.ConfigureIdentity();
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.ConfigureSwagger();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// The compression has to run before the static files, otherwise the Angular
// bundle and the product images are sent uncompressed.
app.UseResponseCompression();

var productImagesFolder = Path.Combine(app.Environment.ContentRootPath, @"Files");

if (Directory.Exists(productImagesFolder))
{
    app.UseStaticFiles(new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(productImagesFolder),
        RequestPath = new PathString("/Images"),
        OnPrepareResponse = context =>
        {
            // The product images do not change under the same name, so the browser
            // and the mobile networks do not have to download them again.
            context.Context.Response.Headers.CacheControl = "public, max-age=604800";
        }
    });
}

if (!app.Environment.IsDevelopment())
{
    // The bundle files are named with a content hash, so the browser can keep
    // them for a year. The index.html must always be revalidated, otherwise
    // the visitors would keep an old version of the application.
    var spaDist = Path.Combine(app.Environment.ContentRootPath, "ClientApp", "dist");

    if (Directory.Exists(spaDist))
    {
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(spaDist),
            OnPrepareResponse = context =>
            {
                var fileName = Path.GetFileName(context.File.Name);
                context.Context.Response.Headers.CacheControl = fileName == "index.html"
                    ? "no-cache"
                    : "public, max-age=31536000, immutable";
            }
        });
    }
}

app.UseRouting();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapWhen(x => x.Request.Path.Value?.StartsWith("/api", StringComparison.OrdinalIgnoreCase) == false, builder =>
{
    builder.UseSpa(spa =>
    {
        // To learn more about options for serving an Angular SPA from ASP.NET Core,
        // see https://go.microsoft.com/fwlink/?linkid=864501

        spa.Options.SourcePath = "ClientApp";

        //if (env.IsDevelopment())
        //{
        //  spa.UseAngularCliServer(npmScript: "start");
        //}
    });
});

app.Run();
