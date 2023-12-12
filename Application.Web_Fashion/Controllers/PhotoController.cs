using Application.Common;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Application.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Imaging;

namespace Application.Controllers
{
    [Authorize]
    public class PhotoController : Controller
    {
        private IProductImageService productImageService;
        private IWebHostEnvironment hostEnvironment;
        public PhotoController(IProductImageService productImageService, IWebHostEnvironment hostEnvironment)
        {
            this.productImageService = productImageService;
            this.hostEnvironment = hostEnvironment;
        }

        public ActionResult ManagePhoto()
        {
            return View();
        }

        public ActionResult SiteLogo()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SavePhoto(string productId)
        {
            bool isSuccess = false;
            string message = String.Empty;

            if (Request.Form.Files == null || Request.Form.Files[0] == null)
                return Json(new
                {
                    isSuccess = false,
                    message = "Please choose a user image!"
                });


            // Check max limit reached
            var photoList = this.productImageService.GetProductImages(productId, false);
            if (photoList.Count() >= 6)
            {
                return Json(new
                {
                    isSuccess = false,
                    message = "You image upload limit exceeded!"
                });
            }


            bool isPrimaryImage = photoList.Count() == 0 ? true : false;
            isSuccess = AppUtils.SaveProductImage(hostEnvironment, productImageService, Request, productId, false, isPrimaryImage);
            
            return Json(new
            {
                isSuccess
            });
        }        

        public JsonResult SetPrimaryPhoto(string productId, string photoId)
        {            
            bool isSuccess = this.productImageService.SetProfileImage(productId, photoId);

            if (!isSuccess)
            {
                ErrorLog.LogError("Set Primary Image is Failed!");
            }

            return Json(new
            {
                isSuccess
            });
        }

        public JsonResult GetPhotoList(string productId)
        {
            var imageList = this.productImageService.GetProductImages(productId, false);

            List<ProductImageViewModel> imageVMList = new List<ProductImageViewModel>();            
            
            if (imageList != null)
            {
                foreach (ProductImage pi in imageList)
                {
                    ProductImageViewModel pivm = new ProductImageViewModel();
                    pivm.Id = pi.Id;
                    pivm.ImageName = pi.ImageName;
                    pivm.ProductId = pi.ProductId;
                    pivm.DisplayOrder = pi.DisplayOrder == null ? 0 : (int)pi.DisplayOrder;
                    pivm.IsPrimaryImage = pi.IsPrimaryImage;
                    pivm.IsApproved = pi.IsApproved;
                    pivm.Status = pi.IsApproved ? "Approved" : "Pending";

                    imageVMList.Add(pivm);
                }
            }

            return Json(imageVMList);
        }

        public JsonResult DeletePhoto(string imageId)
        {
            bool isSuccess = true;

            isSuccess = AppUtils.DeleteProductImage(hostEnvironment, productImageService, imageId);
            
            return Json(new
            {
                isSuccess
            });
        }

        [HttpPost]
        public JsonResult SaveLogo()
        {
            if (Request.Form.Files == null || Request.Form.Files[0] == null)
                return Json(new
                {
                    isSuccess = false,
                    message = "Please select a logo image!"
                });

            bool isSuccess = true;
            try
            {
                foreach (var file in Request.Form.Files)
                {
                    var fileName = "Logo.png";
                    var imagePath = Path.Combine(hostEnvironment.WebRootPath, "Images/Logo/Original/" +  fileName);

                    // Save logo
                    using (Stream fileStream = new FileStream(imagePath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }

                    // Save specified size
                    string imageSource = imagePath;
                    string imageDest = Path.Combine(hostEnvironment.WebRootPath, "Images/Logo/" + fileName);
                    ImageResizer.Resize(imageSource, imageDest, 200, 60, false, ImageFormat.Jpeg);

                    isSuccess = true;
                }
            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "Failed: Saving logo");
            }

            return Json(new
            {
                isSuccess
            });
        }        
    }
}