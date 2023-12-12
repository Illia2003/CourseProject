using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Application.Data.Models;
using Microsoft.EntityFrameworkCore;
using PagedList.Core;

namespace Application.Data.Infrastructure
{
    public class RepositoryBase<T> : IRepository<T> where T : class
    {
        private readonly DatabaseFactory _dbFactory;
        private DbSet<T> _dbSet;

        public RepositoryBase(DatabaseFactory dbFactory)
        {
            _dbFactory = dbFactory;
        }

        protected DbSet<T> DbSet
        {
            get => _dbSet ?? (_dbSet = _dbFactory.DbContext.Set<T>());
        }        

        public virtual void Add(T entity)
        {
            DbSet.Add(entity);
        }
        public virtual void Update(T entity)
        {
            DbSet.Attach(entity);
            _dbFactory.DbContext.Entry(entity).State = EntityState.Modified;            
        }
        public virtual void Delete(T entity)
        {
            DbSet.Attach(entity);
            DbSet.Remove(entity);
        }
        public virtual void Delete(Expression<Func<T, bool>> where)
        {
            IEnumerable<T> objects = DbSet.Where<T>(where).AsEnumerable();
            foreach (T obj in objects)
                DbSet.Remove(obj);
        }
        public virtual T GetById(long id)
        {
            return DbSet.Find(id);
        }
        public virtual T GetById(string id)
        {
            return DbSet.Find(id);
        }
        public virtual IEnumerable<T> GetAll()
        {
            return DbSet.ToList();
        }

        public virtual IEnumerable<T> GetMany(Expression<Func<T, bool>> where)
        {
            return DbSet.Where(where).ToList();
        }

        /// <summary>
        /// Return a paged list of entities
        /// </summary>
        /// <typeparam name="TOrder"></typeparam>
        /// <param name="page">Which page to retrieve</param>
        /// <param name="where">Where clause to apply</param>
        /// <param name="order">Order by to apply</param>
        /// <returns></returns>
        public virtual IPagedList<T> GetPage<TOrder>(Page page, Expression<Func<T, bool>> where, Expression<Func<T, TOrder>> order)
        {
            var results = DbSet.OrderBy(order).Where(where).GetPage(page).ToList();
            var total = DbSet.Count(where);
            return new StaticPagedList<T>(results, page.PageNumber, page.PageSize, total);
        }

        public T Get(Expression<Func<T, bool>> where)
        {
            return DbSet.Where(where).FirstOrDefault<T>();
        }
    }
}
