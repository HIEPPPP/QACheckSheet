using Microsoft.EntityFrameworkCore;
using QACheckSheetAPI.Data;
using QACheckSheetAPI.Mapping;
using QACheckSheetAPI.Repositories.Implementation;
using QACheckSheetAPI.Repositories.Interface;
using QACheckSheetAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy => policy
        .WithOrigins(
            "http://172.17.140.11:5000",
            "http://localhost:5173"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
    );
});

// EF Core
builder.Services.AddDbContext<QACheckSheetDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CheckSheetConnectString"))
);

// AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<AutoMapperProfile>();
});

// Repositories & Services
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDeviceTypeRepository, DeviceTypeRepository>();
builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<ISheetRepository, SheetRepository>();
builder.Services.AddScoped<ISheetDeviceTypeRepository, SheetDeviceTypeRepository>();
builder.Services.AddScoped<ISheetItemRepository, SheetItemRepository>();
builder.Services.AddScoped<ICheckResultRepository, CheckResultRepository>();
builder.Services.AddScoped<INgDetailRepository, NgDetailRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddScoped<AuthServices>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<DeviceTypeServices>();
builder.Services.AddScoped<DeviceServices>();
builder.Services.AddScoped<SheetServices>();
builder.Services.AddScoped<SheetDeviceTypeServices>();
builder.Services.AddScoped<SheetItemServices>();
builder.Services.AddScoped<CheckResultServices>();
builder.Services.AddScoped<NgDetailServices>();
builder.Services.AddScoped<RoleServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
