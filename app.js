'use strict';

// Declare app level module which depends on views, and components
var webFood  =  angular.module('webFood', []);

/**************************************************/
/*					          DIRECTIVES         		      */
/**************************************************/
webFood.directive('modal', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

/**************************************************/
/*					         CONTROLLERS        		      */
/**************************************************/
webFood.controller('jsonCtrl', function($scope, $http, $window){

  $scope.menu = {};
  $scope.menuList = [];
  $scope.myCart = loadCart("titles");
  $scope.myCartValues = loadCart("amount");
  $scope.myCartPrice = loadCart("prices");
  $scope.modalShown = false;

  $http({
    url: 'data/menu.json',
    dataType: 'json',
    method: 'GET',
    data: '',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function(response){
    $scope.menu = response.data.food;
    populateMenu();
  });

  /**************************************************/
  /*				            Functions     	    		    */
  /**************************************************/
  $scope.getImage = function(item){
    var src = "";
    switch (item.cuisine) {
      case "salad":
        src = "images/salad.png";
        break;
      case "pizza":
        src = "images/pizza.png";
        break;
      case "chinese":
        src = "images/chinese-food.png";
        break;
      case "burgers":
        src = "images/burger.png";
        break;
      case "beverage":
        src = "images/beverage.jpg"
        break;
    }
    return src;
  };

  $scope.getItensList = function (type) {
    $scope.menuList = [];
    for (var i = 0; i < $scope.menu.length; i++) {
      if (type == "all") {
        $scope.menuList.push($scope.menu[i]);
      }
      else if ($scope.menu[i].cuisine === type) {
        $scope.menuList.push($scope.menu[i]);
      }
    }
  };
  
  $scope.addItem = function (item) {
    var index = $scope.myCart.indexOf(item.title);

    if (contains($scope.myCart, item.title)) {
      $scope.myCartValues[index] += 1;
    }
    else {
      $scope.myCart.push(item.title);
      $scope.myCartValues.push(1);
      $scope.myCartPrice.push(item.price);
    }
    saveData();
  };

  $scope.plusItem = function (title) {
    var index = $scope.myCart.indexOf(title);
    $scope.myCartValues[index] += 1;
    saveData();
  };

  $scope.minusItem = function (title) {
    var index = $scope.myCart.indexOf(title);
    $scope.myCartValues[index] -= 1;
    if ($scope.myCartValues[index] === 0) {
      $scope.myCart.splice(index, 1);
      $scope.myCartValues.splice(index, 1);
    }
    saveData();
  };

  $scope.getPrice = function () {
    var title, amount;
    var totalPrice = 0.00;
    for (var i = 0; i < $scope.myCart.length; i++) {
      title = $scope.myCart[i];
      amount = $scope.myCartValues[i];
      totalPrice += (amount * $scope.myCartPrice[i]);
    }
    return totalPrice;
  };

  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  /**************************************************/
  /*				         Aux. Functions			            */
  /**************************************************/
  function populateMenu() {
    for (var i = 0; i < $scope.menu.length; i++) $scope.menuList.push($scope.menu[i]);
  }

  function contains(array, obj) {
    var i = array.length;
    while (i--) {
      if (array[i] === obj) {
        return true;
      }
    }
    return false;
  }

  function saveData() {
    saveCart("titles", $scope.myCart);
    saveCart("amount", $scope.myCartValues);
    saveCart("prices", $scope.myCartPrice);
  }
  
  function saveCart(key, obj) {
    return window.localStorage.setItem(key, JSON.stringify(obj)) || [];
  }

  function loadCart(key) {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  }

});