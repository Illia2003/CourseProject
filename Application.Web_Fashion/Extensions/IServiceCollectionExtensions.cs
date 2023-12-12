using Application.Data.Infrastructure;
using Application.Data.Models;
using Application.Data.Repository;
using Application.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Web.Extensions
{    
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationEntities>(options =>
                {
                    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                    .UseLazyLoadingProxies();
                }
            );

            services.AddScoped<Func<ApplicationEntities>>((provider) => () => provider.GetService<ApplicationEntities>());
            services.AddScoped<DatabaseFactory>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }

        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            return services
                .AddScoped(typeof(IRepository<>), typeof(RepositoryBase<>))
                .AddScoped<IRoleRepository, RoleRepository>()
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<IActionLogRepository, ActionLogRepository>()
                .AddScoped<IAttributeNameRepository, AttributeNameRepository>()
                .AddScoped<IAttributeVariationRepository, AttributeVariationRepository>()
                .AddScoped<IBranchRepository, BranchRepository>()
                .AddScoped<ICategoryRepository, CategoryRepository>()
                .AddScoped<IItemTypeRepository, ItemTypeRepository>()
                .AddScoped<ILookupRepository, LookupRepository>()
                .AddScoped<IOrderRepository, OrderRepository>()
                .AddScoped<IProductImageRepository, ProductImageRepository>()
                .AddScoped<IProductStockRepository, ProductStockRepository>()
                .AddScoped<ISettingRepository, SettingRepository>()
                .AddScoped<ISliderImageRepository, SliderImageRepository>()
                .AddScoped<IStockLocationRepository, StockLocationRepository>()
                .AddScoped<ISupplierRepository, SupplierRepository>()
                .AddScoped<IProductRepository, ProductRepository>();                
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            return services
                .AddScoped<IRoleService, RoleService>()
                .AddScoped<IUserService, UserService>()
                .AddScoped<IActionLogService, ActionLogService>()
                .AddScoped<IAttributeNameService, AttributeNameService>()
                .AddScoped<IAttributeVariationService, AttributeVariationService>()
                .AddScoped<IBranchService, BranchService>()
                .AddScoped<ICategoryService, CategoryService>()
                .AddScoped<IItemTypeService, ItemTypeService>()
                .AddScoped<ILookupService, LookupService>()
                .AddScoped<IOrderService, OrderService>()
                .AddScoped<IProductImageService, ProductImageService>()
                .AddScoped<IProductStockService, ProductStockService>()
                .AddScoped<ISettingService, SettingService>()
                .AddScoped<ISliderImageService, SliderImageService>()
                .AddScoped<IStockLocationService, StockLocationService>()
                .AddScoped<ISupplierService, SupplierService>()
                .AddScoped<IProductService, ProductService>();
        }
    }
}
