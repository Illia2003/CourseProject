using Application.Data.Infrastructure;
using Application.Data.Models;
using Application.Model.Models;
using System;
using System.Linq.Expressions;
namespace Application.Data.Repository
{
    public class AttributeNameRepository : RepositoryBase<AttributeName>, IAttributeNameRepository
        {
        public AttributeNameRepository(DatabaseFactory databaseFactory)
            : base(databaseFactory)
            {
            }        
        }
    public interface IAttributeNameRepository : IRepository<AttributeName>
    {
        
    }
}