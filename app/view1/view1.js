'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $resource, $http) {
  var self = this;
  this.inventory = {
    items: []
  };

  $scope.profile_id = 'mr_manix';

  $scope.loadInventory = function() {
    $resource('http://steamcommunity.com/id/'+ $scope.profile_id + '/inventory/json/730/2').get().$promise.then(function(inventory) {
      $scope.inventory = self.populateInventory(inventory);
    })
  };

  $scope.getMarketInfos = function(item, index) {
    $http({
      method: 'GET',
      url: 'http://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=' + item.market_hash_name.replace(' ', '%20')
    }).then(function(marketData) {
      item.price = marketData.data.median_price;
    });
  }

  this.populateInventory = function(inventory) {
    _.each(inventory.rgInventory, function(item) {
      self.inventory.items.push(_.findWhere(inventory.rgDescriptions, { 'classid': item.classid, 'instanceid': item.instanceid }));
    })

    return self.inventory;
  }
});