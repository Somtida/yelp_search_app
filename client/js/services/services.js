'use strict';

var app = angular.module('myApp');


app.service('User', function($http, $rootScope, $cookies, $state, $q, TOKENNAME) {

  this.getProfile = () => {
    return $http.get('/api/users/profile');
  };

  this.readToken = () => {
    let token = $cookies.get(TOKENNAME);

    if(typeof token === 'string') {
      let payload = JSON.parse(atob(token.split('.')[1]));
      $rootScope.currentUser = payload;
    }
  };

  this.register = userObj => {
    return $http.post('/api/users/register', userObj);
  };

  this.login = userObj => {
    // console.log("userObj: ", userObj);
    return $http.post('/api/users/login', userObj)
      .then(res => {
        $rootScope.currentUser = res.data;
        console.log("res.data: ",res.data);
        return $q.resolve(res);
      });
  };

  this.logout = () => {
    $cookies.remove(TOKENNAME);
    $rootScope.currentUser = null;
    $state.go('home');
  };

  this.addYelp = (userId, businessId) => {
    console.log("addYelp");
    return $http.put(`/api/users/addYelp/${userId}`, {businessId: businessId});
  }

  this.searchYelp = (searchObj) => {
    // console.log("searchObj in services: ", searchObj);
    return $http.get(`/api/users/searchYelp/${searchObj.term}/${searchObj.location}`);
  }

  this.searchBussiness = (id) => {
    // console.log("id in services: ", id);
    return $http.get(`/api/users/searchBussiness/${id}`);
  }



  this.deleteYelp = (userId,businessId) => {
    // console.log("userId: ", userId);
    // console.log("businessId: ", businessId);
    return $http.put(`/api/users/deleteYelp/${userId}/${businessId}`);
  }

});
