using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Configurations.Entities;

namespace SitraLand_Api.Data
{
    public class DatabaseContext : IdentityDbContext<ApiUser>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) 
        { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<ProductGallery> ProductGallerys { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new RoleConfiguration());

            builder.Entity<ProductGallery>(entity =>
            {
                entity.HasIndex(g => g.ProductId);
            });
        }
    }
}
