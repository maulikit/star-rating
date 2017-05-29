var app = angular.module("webapp",[]);

app.controller('ratereviewController', ['$scope', '$rootScope',"$location","$attrs", "$location","$sce", "$window",
    function ($scope, $rootScope, $location, $attrs,  $location,$sce, $window) {       
       	console.log("rate-review");
            $scope.productname = '';
            $scope.customerReviews = '';
            $scope.total_rating = 0;
            $scope.score = 0;
            $scope.productUrl = '';
            $scope.scoreoptions = {max : 5, onupdateStar: function(score){
                  $scope.score = score;
            }};
}]);

app.directive('starRating',function() {
      return {
                  restrict : 'A',
                  template : '<span ng-repeat="star in stars" ng-click="setRating($index)" ng-mouseover="hover($index)" ng-mouseleave="stopHover()">'+
                                    '<i class="icon-Star_line" ng-class="starClass(star, $index)" > </i>'+
                              '</span>',
                  scope: {
                        score : '=',
                        
                  },
                  controller : function($scope){
                        var scope = $scope;
                        scope.updateStars = function () {
                              var idx = 0;
                              scope.stars = [];
                              for(idx = 0;  idx < scope.score.max; idx++){
                                    scope.stars.push({
                                          "full" : scope.score > idx
                                    });
                              }                              
                        };

                        scope.starClass = function(star, idx){
                              var starClass = 'icon-Star_line';
                              //if(star['full']){
                              if(idx <= scope.hoverIdx){
                                    starClass = 'icon-Star_fill';
                              }
                              return starClass;
                        };

                        scope.$watch('score', function(newValue, oldValue) {
                                if (newValue !== null && newValue !== undefined) {
                                  scope.updateStars();
                                }
                        });

                        scope.setRating = function(idx) { console.log("clicked-index::"+idx);
                          //scope.score = idx + 1;
                          scope.score.onupdateStar(idx + 1);
                          //scope.stopHover();
                        };

                        scope.hover = function(idx) {
                          scope.hoverIdx = idx;
                          //scope.score = idx + 1;
                          //scope.updateStars();
                        };

                        scope.stopHover = function() {
                         // scope.hoverIdx = -1;
                        };
                  }
                  
            };
      }
);