 'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, User) {
  console.log('mainCtrl!');

  $scope.logout = () => {
    User.logout()
      .then(()=>{
        $state.go('home');
      })
  };
});

app.controller('profileCtrl', function($scope, $state, CurrentUser, User) {
  console.log('profileCtrl!');
  // console.log('CurrentUser:', CurrentUser);
  $scope.currentUser = CurrentUser;

  $scope.searchBussiness = (businessId) => {
    User.searchBussiness(businessId)
    .then(res => {
      // console.log("res: ", res);
      $scope.businessData = res.data;
    })
    .catch(err => {
      console.log("err: ", err);
    })
  }

  $scope.deleteYelp = (businessId) => {
    // console.log("businessId: ",businessId);
    // console.log($scope.currentUser._id);
    User.deleteYelp(CurrentUser.data._id, businessId)
      .then(res => {
        console.log("res.data: ", res.data);
        $state.reload('profile');
      })
      .catch(err => {
        console.log("err: ", err);
      })
  }
})

app.controller('loginRegisterCtrl', function($scope, $state, User, SweetAlert) {

  $scope.currentState = $state.current.name;

  $scope.submit = () => {
    // console.log('$scope.user:', $scope.user);

    if($scope.currentState === 'login') {
      // login stuff
      User.login($scope.user)
        .then(res => {
          $state.go('home');
          console.log("res: ",res);
        })
        .catch(err => {
          console.log('err:', err);
          SweetAlert.swal('Register failed.\nusername or password is incorrect.');
        });
    } else {
      // register stuff

      if($scope.user.password !== $scope.user.password2) {
        // passwords don't match
        $scope.user.password = null;
        $scope.user.password2 = null;
        SweetAlert.swal("Passwords must match.  Try again.");
      } else {
        // passwords are good
        User.register($scope.user)
          .then(res => {
            $state.go('login');
          })
          .catch(err => {
            console.log('err:', err);
            SweetAlert.swal('Register failed. \nUsername is not available.\nor registered');
          });
      }
    }
  };

});



app.controller('loginCtrl', function($scope, $state, User) {
  console.log('loginCtrl!');

  console.log('$state:', $state);

  $scope.login = () => {

  };

});


app.controller('yelpCtrl', function($scope, $state, CurrentUser, User){
  console.log("yelpCtrl");
  // console.log('CurrentUser:', CurrentUser);
  // $scope.currentUser = CurrentUser.data;



  $scope.searchYelp = () => {
    console.log("searchYelp term: ", $scope.searchObj.term);
    console.log("searchYelp location: ", $scope.searchObj.location);

    User.searchYelp($scope.searchObj)
      .then(res => {
        console.log("res.data in controllers: ", res.data);
        $scope.searchResults = res.data;
      })
      .catch(err => {
        console.log("err in controllers: ", err);
      })
  }

  $scope.addYelp = (businessId) => {
    $scope.message = null;
    $scope.shouldAdd = true;
    console.log("businessId: ", businessId);
    console.log("CurrentUser.data._id: ", CurrentUser.data._id);
    // if(CurrentUser.data.yelps.businessId.indexOf(businessId) === -1){
    //   console.log("no");
    // }else{
    //   console.log("yes");
    // }
    angular.forEach(CurrentUser.data.yelps, function(yelp){
      // console.log("yelp: ", yelp.businessId);
      if(yelp.businessId !== businessId){
        console.log("diff");
        $scope.shouldAdd = $scope.shouldAdd && true;

      }else{
        console.log("same");
        $scope.shouldAdd = $scope.shouldAdd && false;
        $scope.message=`${businessId} already existed in your favorite!`;
      }
    })
    // console.log("$scope.shouldAdd: ", $scope.shouldAdd);
    if($scope.shouldAdd){
      // console.log("should add");
      User.addYelp(CurrentUser.data._id, businessId)
        .then(res => {
          console.log("res.data: ", res.data);
          $scope.message= `Added ${businessId} to your favorite`
        })
        .catch(err => {
          console.log("err: ", err);
        })
    }

  }

})
