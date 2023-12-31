﻿angular.module('AjaxLoaderServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            //alert('start spinner');
            $('#loader').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
    // register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                // Do something on success (Here hide the spinner)                
                $('#loader').hide();
                return response;

            }, function (response) {
                // Do something on error (Here hide the spinner)
                $('#loader').hide();
                return $q.reject(response);
            });
        };
    });