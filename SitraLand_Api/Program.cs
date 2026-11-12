using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SitraLand_Api;
using SitraLand_Api.Configurations;
using SitraLand_Api.Data;
using SitraLand_Api.Services.Implementations;
using SitraLand_Api.Services.Interfaces;

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

builder.Services.AddMemoryCache();

builder.Services.AddHttpContextAccessor();
builder.Services.AddResponseCaching();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSpaStaticFiles(configurations =>
{
    configurations.RootPath = "ClientApp/dist";
});

// Only explicitly configured origins may call the API from another host.
// Production serves the Angular bundle from the same origin, so no CORS entry is needed there.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
if (allowedOrigins == null || allowedOrigins.Length == 0)
{
    allowedOrigins = new[] { "http://localhost:4200", "https://localhost:4200" };
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

//Auto Mapper
builder.Services.AddAutoMapper(typeof(MapperInitilizer));

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
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), @"Files")),
    RequestPath = new PathString("/Images")
});

if (!app.Environment.IsDevelopment())
    app.UseSpaStaticFiles();

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
