using Application.Common;
using Application.Model.Models;
using Application.Service;
using Application.Web;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Application.Controllers
{
    public class BranchController : Controller
    {
        private IBranchService branchService;

        public BranchController(IBranchService branchService)
        {
            this.branchService = branchService;            
        }

        public ActionResult Branch()     
        {           
            return View();
        }

        public JsonResult GetBranchList()
        {
            var itemList = this.branchService.GetBranchList();

            List<Branch> list = new List<Branch>();
            foreach (var item in itemList)
            {
                list.Add(new Branch { Id = item.Id, Name = item.Name, IsAllowOnline = item.IsAllowOnline });
            }

            return Json(list);
        }

        public JsonResult GetUserBranchList()
        {
            var user = AppUtils.GetLoggedInUser();
            var itemList = this.branchService.GetBranchList(user.Id);
            
            List<Branch> list = new List<Branch>();
            foreach (var item in itemList)
            {
                list.Add(new Branch { Id = item.Id, Name = item.Name, IsAllowOnline = item.IsAllowOnline });
            }

            return Json(list);
        }

        public JsonResult CreateBranch([FromBody] Branch branch)
        {
            bool isSuccess = true;
            try
            {
                this.branchService.CreateBranch(branch);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult UpdateBranch([FromBody] Branch branch)
        {
            bool isSuccess = true;
            try
            {
                this.branchService.UpdateBranch(branch);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }
        public JsonResult DeleteBranch([FromBody] Branch branch)
        {
            bool isSuccess = true;
            try
            {
                this.branchService.DeleteBranch(branch);
            }
            catch (Exception exp)
            {
                isSuccess = false;
            }

            return Json(new Result { IsSuccess = isSuccess });
        }        
                    
    }
}