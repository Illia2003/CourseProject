$(document).ready(function () {

    $("#inputFile").change(function () {
        readURL(this);
    });

    $("#inputIconFile").change(function () {
        readIconURL(this);
    });

    $("#btnPhotoCancel").click(function () {
        $('#imgTemp').attr('src', '/Images/no-image.png');
        $('#divSavePhoto').hide();
    });

    $("#btnIconCancel").click(function () {
        $('#iconTemp').attr('src', '/Images/no-image.png');
        $('#divSaveIcon').hide();
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgTemp').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);

            $('#divSavePhoto').show();
        }
    }

    function readIconURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#iconTemp').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);

            $('#divSaveIcon').show();
        }
    }
});

// SERVICE
app.factory('categoryPhotoService', ['$http', function ($http) {

      return {
        savePhoto: function (catId, formData) {
            return $http.post('/Category/SaveCategoryPhoto?catId=' + catId, formData, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            });
        },

        getCategoryPhoto: function (catId) {
            return $http({
                url: '/Category/GetCategoryPhoto',
                method: 'GET',
                params: { catId: catId },
                cache: false
            });
        },

        deletePhoto: function (catId) {
            return $http({
                url: '/Category/DeleteCategoryPhoto',
                method: 'GET',
                params: { catId: catId }
            });
        },

        saveIcon: function (catId, formData) {
            return $http.post('/Category/SaveCategoryIcon?catId=' + catId, formData, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            });
        },

        getCategoryIcon: function (catId) {
            return $http({
                url: '/Category/GetCategoryIcon',
                method: 'GET',
                params: { catId: catId },
                cache: false
            });
        },

        deleteIcon: function (catId) {
            return $http({
                url: '/Category/DeleteCategoryIcon',
                method: 'POST',
                data: { catId: catId }
            });
        }
    };

   }
]);

// CONTROLLER
app.controller('categoryPhotoCtrl', ['$rootScope', '$scope', '$http', '$window', '$filter', '$location', 'Enum', 'categoryPhotoService', function ($rootScope, $scope, $http, $window, $filter, $location, Enum, categoryPhotoService) {

    var categoryId = getParam('catId');
    $scope.IsFileValid = false;

    loadPhoto();
    loadIcon();

    function loadPhoto() {
        categoryPhotoService.getCategoryPhoto(categoryId)
            .success(function (data) {
                $scope.ImageName = data.imageName;
            })
            .error(function (xhr) {
            });
    };

    function loadIcon() {
        categoryPhotoService.getCategoryIcon(categoryId)
            .success(function (data) {
                $scope.IconName = data.iconName;
            })
            .error(function (xhr) {
            });
    };
    
    $scope.selectPhoto = function (files) {
        $scope.categoryPhoto = files[0];
    };

    $scope.selectIcon = function (files) {
        $scope.categoryIcon = files[0];
    };

    $scope.deletePhoto = function () {
        bootbox.confirm("<h4>Are you sure to delete this image?</h4>",
            function (result) {
                if (result) {
                    categoryPhotoService.deletePhoto(categoryId)
                        .success(function (data) {
                            if (data.isSuccess) {
                                loadPhoto();
                            }
                            else {
                                bootbox.alert("<h4>Failed to delete this image!</h4>", function () { });
                            }
                        })
                        .error(function (exception) {
                            bootbox.alert("<h4>Error occured while deleting this image!</h4>", function () { });
                        });
                }
            });
    }

    $scope.deleteIcon = function () {
        bootbox.confirm("<h4>Are you sure to delete this icon?</h4>",
            function (result) {
                if (result) {
                    categoryPhotoService.deleteIcon(categoryId)
                        .success(function (data) {
                            if (data.isSuccess) {
                                loadIcon();
                            }
                            else {
                                bootbox.alert("<h4>Failed to delete this icon!</h4>", function () { });
                            }
                        })
                        .error(function (exception) {
                            bootbox.alert("<h4>Error occured while deleting this icon!</h4>", function () { });
                        });
                }
            });
    }

    $scope.uploadPhoto = function () {
        $scope.submitted = true;

        if ($scope.myForm.$invalid) {
            return false;
        }

        savePhoto();
    };

    $scope.uploadIcon = function () {
        $scope.submitted = true;

        if ($scope.myForm.$invalid) {
            return false;
        }

        saveIcon();
    };

    var savePhoto = function () {
        var file = $scope.categoryPhoto;
        var formData = new FormData();
        formData.append("file", file);

        categoryPhotoService.savePhoto(categoryId, formData)
        .success(function (data) {
            if (data.isSuccess) {
                loadPhoto();

                $('#imgTemp').attr('src', '/Images/no-image.png');
                $('#divSavePhoto').hide();

            }
            else {
                bootbox.alert("<h4>" + data.message + "</h4>", function () { });
            }
        })
        .error(function (exception) {
            bootbox.alert("<h4>Error while saving your photo!</h4>", function () { });
        });

    };

    var saveIcon = function () {
        var file = $scope.categoryIcon;
        var formData = new FormData();
        formData.append("file", file);

        categoryPhotoService.saveIcon(categoryId, formData)
            .success(function (data) {
                if (data.isSuccess) {
                    loadIcon();

                    $('#iconTemp').attr('src', '/Images/no-image.png');
                    $('#divSaveIcon').hide();

                }
                else {
                    bootbox.alert("<h4>" + data.message + "</h4>", function () { });
                }
            })
            .error(function (exception) {
                bootbox.alert("<h4>Error while saving your icon!</h4>", function () { });
            });

    };

}]);