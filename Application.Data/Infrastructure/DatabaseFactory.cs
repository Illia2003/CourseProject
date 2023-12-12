using Application.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Data.Infrastructure
{    
    public class DatabaseFactory : IDisposable
    {
        private bool _disposed;
        private Func<ApplicationEntities> _instanceFunc;
        private DbContext _dbContext;
        public DbContext DbContext => _dbContext ?? (_dbContext = _instanceFunc.Invoke());

        public DatabaseFactory(Func<ApplicationEntities> dbContextFactory)
        {
            _instanceFunc = dbContextFactory;
        }

        public void Dispose()
        {
            if (!_disposed && _dbContext != null)
            {
                _disposed = true;
                _dbContext.Dispose();
            }
        }
    }
}
