
// SERVICE CALL
app.factory('addCustomerService', [
    '$http', function ($http) {

        return {
            registerAccount: function (user) {
                return $http({
                    url: '/Account/RegisterAccount?byAdmin=true',
                    method: 'POST',
                    data: user
                });
            }
        };
    }
]);

// CONTROLLER
app.controller('AddCustomerCtrl', ['$rootScope', '$scope', '$http', '$window', '$filter', '$location', 'Enum', 'addCustomerService', function ($rootScope, $scope, $http, $window, $filter, $location, Enum, addCustomerService) {

    var id = getParam("id");
    if (id) {
        $('#lblAddCustomer').html('Update Customer');
        $('#btnCustomerRegister').html('Update Customer');
        populateCustomerInfo(id);
    }

    function showCreateAccountLoader() {
        $('.create-account-loading').show();
    }

    function hideCreateAccountLoader() {
        $('.create-account-loading').hide();
    }

    function clearControls() {
        $('#customerUsername').val('');
        $('#customerPassword').val('');
        $('#customerFirstName').val('');
        $('#customerLastName').val('');
        $('#customerAddress').val('');
        $('#customerZipCode').val('');
        $('#customerCity').val('');
        $('#customerState').val('');
        $('#customerCountry').val('');        
    }

    function populateCustomerInfo(id) {
        $.ajax({
            dataType: "json",
            url: '/Admin/GetCustomer?id=' + id,
            data: {},
            success: function (record) {
                if (record) {
                    $scope.Username = record.Username;

                    $('#customerUsername').val(record.Username);
                    $('#customerPassword').val(record.Password);
                    $('#customerFirstName').val(record.FirstName);
                    $('#customerLastName').val(record.LastName);
                    $('#customerAddress').val(record.ShipAddress);
                    $('#customerZipCode').val(record.ShipZipCode);
                    $('#customerCity').val(record.ShipCity);
                    $('#customerState').val(record.ShipState);
                    $('#customerCountry').val(record.ShipCountry);                    
                }
            },
            error: function (xhr) {
                $('.item-loading').hide();
            }
        });
    }

    $scope.registerAccount = function (form) {

        $scope.submitted = true;
        if ($scope.myForm.$invalid) {
            return false;
        }

        var username = $('#customerUsername').val();
        var password = $('#customerPassword').val();
        var firstName = $('#customerFirstName').val();
        var lastName = $('#customerLastName').val();
        var address = $('#customerAddress').val();
        var zipCode = $('#customerZipCode').val();
        var city = $('#customerCity').val();
        var state = $('#customerState').val();
        var country = $('#customerCountry').val();        

        $scope.submitted = true;
        setButtonState('btnRegister', true);
        showCreateAccountLoader();

        var user = {};        
        var id = getParam("id");
        if (id) {
            user["Id"] = id;
        }

        user["Username"] = username;
        user["Password"] = password;        
        user["FirstName"] = firstName;
        user["LastName"] = lastName;
        user["ShipAddress"] = address;
        user["ShipZipCode"] = zipCode;
        user["ShipCity"] = city;
        user["ShipState"] = state;
        user["ShipCountry"] = country;

        addCustomerService.registerAccount(user)
            .success(function (data) {
                if (data.isSuccess) {
                    if (id) {
                        bootbox.alert("<h4>Customer updated successfully!</h4>", function () { });
                    }
                    else {
                        clearControls();
                        bootbox.alert("<h4>Customer created successfully!</h4>", function () { });
                    }
                } else {
                    if (data.message) {
                        bootbox.alert("<h4>" + data.message + "</h4>", function () { });
                    }
                    else {
                        bootbox.alert("<h4>Failed to create customer account!</h4>", function () { });
                    }
                }

                setButtonState('btnRegister', false);
                hideCreateAccountLoader();
            })
            .error(function (xhr) {
                bootbox.alert("<h4>Error occured while saving customer account!</h4>", function () { });
                setButtonState('btnRegister', false);
                hideCreateAccountLoader();
            });
    };
}]);