using Application.Common;
using Application.Controllers;
using Application.Logging;
using Application.Model.Models;
using Application.Service;
using Application.ViewModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Application.Web
{
    public static class AppUtils
    {        
        public static UserViewModel GetLoggedInUserInfo(User user)
        {
            UserViewModel userVM = new UserViewModel();
            userVM.Id = user.Id;
            userVM.Username = user.Username;
            userVM.Password = user.Password;
            userVM.IsActive = user.IsActive;
            userVM.IsDelete = user.IsDelete;
            userVM.IsVerified = user.IsVerified;
            userVM.Permissions = user.Permissions;

            return userVM;
        }

        public static bool SaveProductImage(IWebHostEnvironment env, IProductImageService service, HttpRequest request, string productId, bool isFromPosting, bool isPrimaryImage = false)
        {
            bool isSuccess = true;
            try
            {
                int count = 1;
                foreach (var file in request.Form.Files)
                {
                    var originalFileName = file.FileName;
                    var fileExtension = Path.GetExtension(originalFileName);
                    var productImageId = Guid.NewGuid().ToString();

                    var fileName = productImageId + ".png";
                    var imagePath = Path.Combine(env.WebRootPath, "ProductImages/Original/" + fileName);

                    // Save photo
                    using (Stream fileStream = new FileStream(imagePath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }

                    // Saving photo in different sizes
                    string imageSource = String.Empty;
                    string imageDest = String.Empty;

                    // Shaped
                    imageSource = imagePath;
                    imageDest = Path.Combine(env.WebRootPath, "ProductImages/Shaped/" + fileName);
                    ImageResizer.Resize_AspectRatio(imageDest, imageSource, 500, 750);

                    // Large
                    imageSource = imagePath;
                    imageDest = Path.Combine(env.WebRootPath, "ProductImages/Large/" + fileName);                    
                    ImageResizer.Resize_AspectRatio(imageDest, imageSource, 500, 750);
                    
                    // Save records to db
                    ProductImage productImage = new ProductImage();
                    productImage.Id = Guid.NewGuid().ToString();
                    productImage.ProductId = productId;
                    productImage.ImageName = fileName;
                    productImage.DisplayOrder = count;
                    productImage.IsApproved = true;
                    productImage.ActionDate = DateTime.Now;

                    if (isFromPosting)
                    {
                        productImage.IsPrimaryImage = count == 1 ? true : false;
                    }
                    else
                    {
                        productImage.IsPrimaryImage = isPrimaryImage;
                    }

                    service.CreateProductImage(productImage);

                    isSuccess = true;
                    count++;
                }

            }
            catch (Exception ex)
            {
                isSuccess = false;
                ErrorLog("SaveProductImage()", ex.Message);
            }

            return isSuccess;
        }

        public static bool DeleteProductImage(IWebHostEnvironment env, IProductImageService productImageService, string imageId)
        {
            bool isSuccess = true;
            ProductImage productImage = productImageService.GetProductImage(imageId);
            if (productImage != null)
            {
                // Delete from db
                isSuccess = productImageService.DeleteImage(imageId);

                if (isSuccess)
                {
                    // Delete from file
                    string file = Path.Combine(env.WebRootPath, "ProductImages/Shaped/" + productImage.ImageName);
                    if (Directory.Exists(Path.GetDirectoryName(file)))
                    {
                        System.IO.File.Delete(file);
                    }

                    file = Path.Combine(env.WebRootPath, "ProductImages/Original/" + productImage.ImageName);
                    if (Directory.Exists(Path.GetDirectoryName(file)))
                    {
                        System.IO.File.Delete(file);
                    }

                    //string file = Path.Combine(env.WebRootPath, "ProductImages/XLarge/" + productImage.ImageName);
                    //if (Directory.Exists(Path.GetDirectoryName(file)))
                    //{
                    //    System.IO.File.Delete(file);
                    //}

                    //file = Path.Combine(env.WebRootPath, "ProductImages/Large/" + productImage.ImageName);
                    //if (Directory.Exists(Path.GetDirectoryName(file)))
                    //{
                    //    System.IO.File.Delete(file);
                    //}

                    //file = Path.Combine(env.WebRootPath, "ProductImages/Medium/" + productImage.ImageName);
                    //if (Directory.Exists(Path.GetDirectoryName(file)))
                    //{
                    //    System.IO.File.Delete(file);
                    //}

                    //file = Path.Combine(env.WebRootPath, "ProductImages/Original/" + productImage.ImageName);
                    //if (Directory.Exists(Path.GetDirectoryName(file)))
                    //{
                    //    System.IO.File.Delete(file);
                    //}

                    //file = Path.Combine(env.WebRootPath, "~/ProductImages/Small/" + productImage.ImageName);
                    //if (Directory.Exists(Path.GetDirectoryName(file)))
                    //{
                    //    System.IO.File.Delete(file);
                    //}

                    //file = Path.Combine(env.WebRootPath, "ProductImages/Grid/" + productImage.ImageName);
                    //if (Directory.Exists(Path.GetDirectoryName(file)))
                    //{
                    //    System.IO.File.Delete(file);
                    //}
                }
                else
                {
                    isSuccess = false;
                    ErrorLog("DeleteProductImage", "Delete Image Failed");
                }
            }

            return isSuccess;
        }

        public static string GetAllChildIds(string id)
        {
            string sqlQuery = String.Empty;
            string allChildIds = id;

            sqlQuery = String.Format(@"
                                            ;WITH r as (
                                             SELECT ID
                                             FROM Category
                                             WHERE ParentID = {0}
                                             UNION ALL
                                             SELECT d.ID 
                                             FROM Category d
                                                INNER JOIN r 
                                                   ON d.ParentID = r.ID
                                        )
                                        SELECT ID FROM r ", id);

            var recordList = Utils.ExecuteQuery<ChildIdsViewModel>(sqlQuery).ToList();
            if (recordList != null && recordList.Count > 0)
            {
                foreach (var record in recordList)
                {
                    allChildIds += "," + record.Id;
                }
            }

            return allChildIds;
        }

        public static void SilentLogin(IUserService userService, IRoleService roleService, string userId)
        {
            var user = userService.GetUserById(userId);
            if (user != null)
            {
                // Set cookies
                SetAuthenticationCookie(roleService, user, true);

                // Update last login time
                userService.UpdateLastLoginTime(user.Id);                
            }
            else
            {
                ErrorLog("SilentLogin", "SilentLogin(): User is null");
            }
        }

        public static async void SetAuthenticationCookie(IRoleService roleService, User user, bool isRememberMe)
        {
            // Login claims
            var claims = new List<Claim>
            {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),                    
                    new Claim(ClaimTypes.Email, user.Username),                    
            };

            // Adding roles to clain
            List<Role> roleList = roleService.GetUserRoles(user.Id).ToList();
            foreach(var role in roleList)
            {
                if (!String.IsNullOrEmpty(role.Name))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
                }
            }

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                //AllowRefresh = <bool>,
                // Refreshing the authentication session should be allowed.

                //ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
                // The time at which the authentication ticket expires. A 
                // value set here overrides the ExpireTimeSpan option of 
                // CookieAuthenticationOptions set with AddCookie.

                //IsPersistent = true,
                // Whether the authentication session is persisted across 
                // multiple requests. When used with cookies, controls
                // whether the cookie's lifetime is absolute (matching the
                // lifetime of the authentication ticket) or session-based.

                //IssuedUtc = <DateTimeOffset>,
                // The time at which the authentication ticket was issued.

                //RedirectUri = <string>
                // The full path or absolute URI to be used as an http 
                // redirect response value.                
            };

            await AppHttpContext.Current.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            // Set user session 
            AppHttpContext.Current.Session.SetObject("User", GetLoggedInUserInfo(user));
            
        }        

        public static User GetLoggedInUser()
        {
            return AppHttpContext.Current.Session.GetObject<User>("User");
        }

        public static string HasPermission(string text)
        {
            string access = "none";
            User user = GetLoggedInUser();
            if (user != null)
            {
                if (!String.IsNullOrEmpty(user.Permissions) && user.Permissions.Contains(text))
                {
                    access = "";
                }
                else
                {
                    access = "none";
                }
            }

            return access;
        }

        public static bool IsUserLoggedIn()
        {
            var user = AppHttpContext.Current.Session.GetObject<User>("User");
            if(user != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static string GetLoggedInUserId()
        {
            string loggedInUserId = String.Empty;
            var loggedInUser = AppUtils.GetLoggedInUser();
            loggedInUserId = loggedInUser != null ? loggedInUser.Id : String.Empty;

            return loggedInUserId;
        }       

        public static int GetWordCount(string text)
        {
            int wordCount = 0, index = 0;

            // skip whitespace until first word
            while (index < text.Length && char.IsWhiteSpace(text[index]))
                index++;

            while (index < text.Length)
            {
                // check if current char is part of a word
                while (index < text.Length && !char.IsWhiteSpace(text[index]))
                    index++;

                wordCount++;

                // skip whitespace until next word
                while (index < text.Length && char.IsWhiteSpace(text[index]))
                    index++;
            }

            return wordCount;
        }

        public static string GetUserIdFromJwtToken()
        {
            string userId = String.Empty;
            var identity = AppHttpContext.Current.User.Identity as ClaimsIdentity;   

            if(identity != null)
            {
                var userClaims = identity.Claims;

                userId = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            return userId;
        }

        public static string GetPriceText(string productId)
        {
            string priceText = String.Empty;

            string sql = String.Format("select ISNULL(min(Price),0) as MinPrice, ISNULL(max(Price),0) as MaxPrice from AttributeVariations where price is not null and productid = '{0}'", productId);

            var priceRange = Utils.ExecuteQuery<PriceRange>(sql).FirstOrDefault();
            if (priceRange != null)
            {
                if (priceRange.MinPrice != 0 && priceRange.MaxPrice != 0)
                {
                    if (priceRange.MinPrice != priceRange.MaxPrice)
                    {
                        priceText = Utils.GetCurrencyCode() + priceRange.MinPrice.ToString("N0") + " - " + Utils.GetCurrencyCode() + priceRange.MaxPrice.ToString("N0");
                    }
                    else
                    {
                        priceText = Utils.GetCurrencyCode() + priceRange.MinPrice.ToString("N0");
                    }
                }
            }

            return priceText;
        }

        public static void ErrorLog(string functionName, string message)
        {
            string sql = String.Format(@"Insert Into ErrorLogs (Id,FunctionName,Message,ActionTime)
                            Values('{0}','{1}','{2}','{3}')", Guid.NewGuid().ToString(), functionName, message, DateTime.Now);

            using (var context = new Data.Models.ApplicationEntities(Utils.GetContextOptions()))
            {
                int result = context.Database.ExecuteSqlRaw(sql);
            }
        }
    }
}