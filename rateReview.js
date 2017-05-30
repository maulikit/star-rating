var app = angular.module("webapp", []);

app.controller('ratereviewController', ['$scope', '$rootScope',
    function($scope, $rootScope) {

        $scope.score = 0;
        $scope.totalRatings = 0;
        $scope.totalUsers = 0;
        $scope.avgScore = 0;

        $scope.myCallBack = function(newrating) {

            $scope.totalRatings = $scope.totalRatings + newrating;
            $scope.totalUsers++;
        };
    }
]);

app.directive('starRating', function() {
    return {
        restrict: 'A',
        template: '<span ng-repeat="star in stars" ng-click="setRating($index)" ng-mouseover="hover($index)" ng-mouseleave="stopHover()">' +
            '<i class="icon-Star_line" ng-class="starClass(star, $index)" > </i>' +
            '</span>',
        scope: {
            score: '=',
            max: '@maxStars',
            callback: '&mycallbackFn'
        },
        controller: function($scope) {

            $scope.updateStars = function() {
                var idx = 0;
                $scope.stars = [];
                for (idx = 0; idx < $scope.max; idx++) {
                    $scope.stars.push({
                        "full": $scope.score > idx
                    });
                }
            };

            $scope.starClass = function(star, idx) {
                var starClass = 'icon-Star_line';
                //if(star['full']){
                if (idx <= $scope.hoverIdx) {
                    starClass = 'icon-Star_fill';
                }
                return starClass;
            };

            $scope.$watch('score', function(newValue, oldValue) {
                if (newValue !== null && newValue !== undefined) {
                    $scope.updateStars();
                }
            });

            $scope.setRating = function(idx) {
                $scope.score = idx + 1;
                $scope.callback({
                    newratings: $scope.score
                });
            };

            $scope.hover = function(idx) {
                $scope.hoverIdx = idx;
                //$scope.score = idx + 1;
                //$scope.updateStars();
            };

            $scope.stopHover = function() {
                //$scope.hoverIdx = -1;
            };
        }

    };
});
/*
                  '<span ng-if="i == fullstar && halfstar>=0">'+
                      '<i class="icon-Star_line"> </i>'+
                      '<i class="icon-starRate{{halfstar}}"> </i>'+
                  '</span>'+
*/

app.directive('averageRating', function() {
    return {
        restrict: 'A',
        template: "<span ng-repeat='star in starArr track by $index'>" +
            "<i ng-if=\"star == 'icon-Star_fill' || star == 'icon-Star_line' \" class=\"{{star}}\"> </i>" +
            "<span ng-if=\"star != 'icon-Star_fill' && star != 'icon-Star_line' \">" +
            "<i class=\"{{star}}\"> </i>" +
            "<i class=\"icon-Star_line\" style=\"position: relative;z-index: 1;left: -23.5px;\"> </i>" +
            "</span>" +
            "</span>",
        scope: {
            averageRatings: "=averageScore",
            totalRatings: "=totalRating",
            totalUsers: "=totalUser",
            maxStars: "@maxStars"
        },
        controller: function($scope) {

            $scope.$watch('totalUsers', function(newValue, oldValue) {

                if (newValue > 0) {
                    var avgratings = ($scope.totalRatings / $scope.totalUsers);
                    $scope.averageRatings = Math.round(avgratings * 10) / 10;

                    var exploded = $scope.averageRatings.toString().split(".");

                    $scope.fullstar = exploded[0];
                    $scope.halfstar = (exploded[1] == "" || exploded[1] == undefined) ? 0 : exploded[1];

                    $scope.starArr = [];
                    var useClass = "";
                    for (var i = 0; i < $scope.maxStars; i++) {
                        if (i < $scope.fullstar) {
                            useClass = "icon-Star_fill";
                        } else if (i == $scope.fullstar && $scope.halfstar > 0) {
                            useClass = "icon-starRate" + $scope.halfstar;
                        } else {
                            useClass = "icon-Star_line";
                        }
                        $scope.starArr.push(useClass);
                    }
                }
            });

        },
    };

});
