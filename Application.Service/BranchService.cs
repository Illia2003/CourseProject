using System.Collections.Generic;
using System.Linq;
using Application.Data.Repository;
using Application.Data.Infrastructure;
using Application.Model.Models;
using Application.Common;
using Application.Service.Properties;
using System;

namespace Application.Service
{

    public interface IBranchService
    {
        void CreateBranch(Branch branch);
        void UpdateBranch(Branch branch);
        void DeleteBranch(Branch branch);
        IEnumerable<Branch> GetBranchList();
        List<Branch> GetBranchList(string userId);
        Branch GetBranch(int id);
        void Commit();
    }

    public class BranchService : IBranchService
    {
        private readonly IBranchRepository branchRepository;
        private readonly IUnitOfWork unitOfWork;

        public BranchService(IBranchRepository classRepository, IUnitOfWork unitOfWork)
        {
            this.branchRepository = classRepository;
            this.unitOfWork = unitOfWork;           
        }
        
        #region IClassService Members

        public void CreateBranch(Branch branch)
        {
            this.branchRepository.Add(branch);
            Commit();
        }
        public void UpdateBranch(Branch branch)
        {
            this.branchRepository.Update(branch);
            Commit();
        }
        public void DeleteBranch(Branch branch)
        {
            this.branchRepository.Delete(branch);
            Commit();
        }

        public IEnumerable<Branch> GetBranchList()
        {
            return this.branchRepository.GetAll().OrderBy(r => r.Name).ToList();
        }

        public List<Branch> GetBranchList(string userId)
        {
            List<Branch> list = new List<Branch>();
            string sql = String.Format(@"Select b.Id, b.Name from Branch b, UserBranches ub where b.Id = ub.BranchId and ub.UserId = '{0}'", userId);

            list = Utils.ExecuteQuery<Branch>(sql).ToList();

            return list;
        }

        public Branch GetBranch(int id)
        {
            var branch = branchRepository.Get(r => r.Id == id);
            return branch;
        }
                
        public void Commit()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
