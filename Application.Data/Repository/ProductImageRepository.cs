using Application.Data.Infrastructure;
using Application.Data.Models;
using Application.Model.Models;
using System;
using System.Linq.Expressions;
namespace Application.Data.Repository
{
    public class ProductImageRepository : RepositoryBase<ProductImage>, IProductImageRepository
        {
        public ProductImageRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory)
            {
            }        
        }
    public interface IProductImageRepository : IRepository<ProductImage>
    {
        
    }
}