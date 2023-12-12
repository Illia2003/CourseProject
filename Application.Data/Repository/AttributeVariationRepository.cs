using Application.Data.Infrastructure;
using Application.Data.Models;
using Application.Model.Models;
using System;
using System.Linq.Expressions;
namespace Application.Data.Repository
{
    public class AttributeVariationRepository : RepositoryBase<AttributeVariation>, IAttributeVariationRepository
        {
        public AttributeVariationRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory)
            {
            }        
        }
    public interface IAttributeVariationRepository : IRepository<AttributeVariation>
    {
        
    }
}