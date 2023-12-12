// SERVICE
app.factory('attributeNameService', ['$http', function ($http) {

    return {

        createAttributeName: function (attributeName) {
            return $http({
                url: '/Attribute/CreateAttributeName',
                method: 'POST',
                data: attributeName
            })
        },

        updateAttributeName: function (attributeName) {
            return $http({
                url: '/Attribute/UpdateAttributeName',
                method: 'POST',
                data: attributeName
            })
        },

        deleteAttributeName: function (attributeName) {
            return $http({
                url: '/Attribute/DeleteAttributeName',
                method: 'POST',
                data: attributeName
            })
        },

        getAttributeNameList: function () {
            return $http.get('/Attribute/GetAttributeNameList');
        }
    };

}]);

// CONTROLLER
app.controller('AttributeNameCtrl', ['$scope', '$http', '$window', '$filter', '$location', 'Enum', 'attributeNameService', function ($scope, $http, $window, $filter, $location, Enum, attributeNameService) {

    getAttributeNameList();

    $scope.addMode = false;

    $scope.toggleAddMode = function () {
        $scope.addMode = !$scope.addMode;
    };

    $scope.toggleEditMode = function (attributeName) {
        attributeName.editMode = !attributeName.editMode;
    };

    $scope.createAttributeName = function () {

        if (!$scope.attributeName.Name) {
            bootbox.alert("<h3>Please select attributeName name!</h3>", function () { });
            return;
        }

        var attributeName = {};
        attributeName["Id"] = $scope.attributeName.Id;
        attributeName["Name"] = $scope.attributeName.Name;                
        attributeName["Value"] = $scope.attributeName.Value;

        attributeNameService.createAttributeName(attributeName)
        .success(function (data) {
            if (data && data.IsSuccess) {
                getAttributeNameList();
                $scope.attributeName.Name = '';
                $scope.attributeName.Value = '';
                $scope.toggleAddMode();
            }
        })
        .error(function (xhr) {
            ShowError('Error to saving attributeName');
        });
    };

    $scope.updateAttributeName = function (attributeName) {
        attributeNameService.updateAttributeName(attributeName)
        .success(function (data) {
            if (data && data.IsSuccess) {
                getAttributeNameList();
            }
        })
        .error(function (xhr) {
            ShowError('Error to update records');
        });
    };

    $scope.deleteAttributeName = function (attributeName) {
        var deleteConfirm = $window.confirm('Are you sure to delete attributeName "' + attributeName.Name + '"?');
        if (deleteConfirm) {
            attributeNameService.deleteAttributeName(attributeName)
            .success(function (data) {
                if (data && data.IsSuccess) {
                    getAttributeNameList();
                }
            })
            .error(function (xhr) {
                ShowError('Error to delete attributeNames');
            });
        }
    };

    $scope.addAttr = function (attributeName) {        
        window.open('/Admin/AttributeConfig?catId=' + attributeName.Id + '&catName=' + attributeName.Name, '_blank');
    };

    function getAttributeNameList() {
        attributeNameService.getAttributeNameList()
        .success(function (data) {
            $scope.attributeNameList = data;
        })
        .error(function (xhr) {
            ShowError('Error to retrieve Student Class');
        });
    }

    function ShowError(errorText) {
        $('.error-message').show();
        $('.error-list').append('<li>' + errorText + '</li>');
    }
}]);