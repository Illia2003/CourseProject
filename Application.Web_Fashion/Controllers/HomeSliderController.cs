using Application.Common;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.Caching;
using System.Web;

namespace Application.Controllers
{
    [Authorize]
    public class HomeSliderController : Controller
    {
        private IProductImageService productImageService;
        private ISliderImageService sliderImageService;
        private IWebHostEnvironment env;

        public HomeSliderController(IProductImageService productImageService, ISliderImageService sliderImageService, IWebHostEnvironment env)
        {
            this.productImageService = productImageService;
            this.sliderImageService = sliderImageService;
            this.env = env;
        }

        public ActionResult SliderImage()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public JsonResult GetSliderImageList()
        {
            List<SliderImage> list = new List<SliderImage>();

            ObjectCache cache = MemoryCache.Default;
            if (cache.Contains(ConstKey.ckHomeSlider))
            {
                list = (List<SliderImage>)cache.Get(ConstKey.ckHomeSlider);
            }
            else
            {
                list = this.sliderImageService.GetSliderImages().ToList();
                
                // Store data in the cache
                CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
                cacheItemPolicy.SlidingExpiration = TimeSpan.FromDays(1);
                cache.Add(ConstKey.ckHomeSlider, list, cacheItemPolicy);
            }

            return Json(list);
        }

        [HttpPost]
        public JsonResult SaveSliderImage(string url, int displayOrder)
        {
            if (Request.Form.Files == null || Request.Form.Files[0] == null)
                return Json(new
                {
                    isSuccess = false,
                    message = "Please choose a slider image!"
                });

            bool isSuccess = true;
            try
            {
                foreach (var file in Request.Form.Files)
                {
                    var originalFileName = file.FileName;
                    var fileExtension = Path.GetExtension(originalFileName);                    
                    var fileName = Guid.NewGuid().ToString() + ".jpg";

                    var imagePath = Path.Combine(env.WebRootPath, "Images/Slider/Original/" + fileName);

                    // Save photo
                    using (Stream fileStream = new FileStream(imagePath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }

                    // Save specified size
                    string imageSource = imagePath;
                    string imageDest = Path.Combine(env.WebRootPath, "Images/Slider/" + fileName);
                    ImageResizer.Resize_AspectRatio(imageDest, imageSource, 1400, 480);
                    
                    // Save records to db
                    SliderImage si = new Model.Models.SliderImage();
                    si.ImageName = fileName;
                    si.Url = url;
                    si.DisplayOrder = displayOrder;
                    this.sliderImageService.CreateSliderImage(si);

                    // Remove slider cache
                    ObjectCache cache = MemoryCache.Default;
                    cache.Remove(ConstKey.ckHomeSlider);

                    isSuccess = true;                    
                }

            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog.LogError(ex, "Failed: Saving user image");
            }

            return Json(new
            {
                isSuccess
            });
        }

        [HttpGet]
        public JsonResult DeleteSliderImage(string imageName)
        {
            bool isSuccess = true;
            SliderImage sliderImage = this.sliderImageService.GetSliderImage(imageName);
            if (sliderImage != null)
            {
                // Delete from db
                isSuccess = this.sliderImageService.DeleteSliderImage(imageName);

                // Delete from file
                if (isSuccess)
                {
                    string file = Path.Combine(env.WebRootPath, "Images/Slider/Original/" + imageName);
                    if (Directory.Exists(Path.GetDirectoryName(file)))
                    {
                        System.IO.File.Delete(file);
                    }

                    file = Path.Combine(env.WebRootPath, "Images/Slider/" + imageName);
                    if (Directory.Exists(Path.GetDirectoryName(file)))
                    {
                        System.IO.File.Delete(file);
                    }

                    // Remove slider cache
                    ObjectCache cache = MemoryCache.Default;
                    cache.Remove(ConstKey.ckHomeSlider);
                }
                else
                {
                    isSuccess = false;
                    ErrorLog.LogError("Delete Image Failed");
                }
            }

            return Json(new
            {
                isSuccess
            });
        }
    }
}