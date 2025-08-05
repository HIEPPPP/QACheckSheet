using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace QACheckSheetAPI.Data
{
    public class QACheckSheetDBContextFactory : IDesignTimeDbContextFactory<QACheckSheetDBContext>
    {
        public QACheckSheetDBContext CreateDbContext(string[] args)
        {
            // Lấy cấu hình từ appsettings.json
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("CheckSheetConnectString");

            var optionsBuilder = new DbContextOptionsBuilder<QACheckSheetDBContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new QACheckSheetDBContext(optionsBuilder.Options);
        }
    }
}
