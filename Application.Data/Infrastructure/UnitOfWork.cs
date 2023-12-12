using Application.Data.Models;

namespace Application.Data.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseFactory databaseFactory;
        
        public UnitOfWork(DatabaseFactory databaseFactory)
        {
            this.databaseFactory = databaseFactory;
        }

        public void Commit()
        {
            this.databaseFactory.DbContext.SaveChanges();
        }
    }
}
