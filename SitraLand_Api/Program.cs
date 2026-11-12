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
builder.Services.AddScoped<ISmsService, SmsService>();

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddMemoryCache();

builder.Services.AddHttpContextAccessor();
builder.Services.AddResponseCaching();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSpaStaticFiles(configurations =>
{
    configurations.RootPath = "ClientApp/dist";
});

builder.Services.AddCors(o =>
{
    o.AddPolicy("AllowAll", x =>
    x.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());
});

//Auto Mapper
builder.Services.AddAutoMapper(typeof(MapperInitilizer));

builder.Services.AddAuthentication();
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
app.MapWhen(x => x.Request.Path.Value?.StartsWith("/api") == false, builder =>
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

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();