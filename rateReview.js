angular.module("webapp").controller('ratereviewController', ['$scope', '$rootScope',"getWebAppData","$location","$attrs", "$location","$sce", "$window", '$anchorScroll',
    function ($scope, $rootScope, getWebAppData, $location, $attrs,  $location,$sce, $window, $anchorScroll) {       
       	console.log("rate-review");
            $scope.productname = '';
            $scope.customerReviews = '';
            $scope.total_rating = 0;
            $scope.score = 0;
            $scope.productUrl = '';
            $scope.scoreoptions = {max : 5, onupdateStar: function(score){
                  $scope.score = score;
            }};    
//productDescriptionModule---customerReviewModule---writeNewReviewModule      
       	$scope.getReview = function(){

       		var jsonData = {
						supid:supid,
						itemcode: prodId,
					      variant:prodVarId,
                baseurl:baseurl,
					};
       		getWebAppData.getReviews(jsonData,'getReviews').then(function(data){
				if(data.errors.code == 1){ //no reviews given
					$scope.total_rating = 0;
          $scope.avg_rating   = 0;
          $scope.total_rating = 0;
          $scope.total_review = 0;
          $scope.customerReviews =  '';
          $scope.ratingsHtml  = '';
				}else{
                              $scope.avg_rating   = data.results.data.ratings.avg_rating;
                              $scope.total_rating = data.results.data.ratings.total_rating;
                              $scope.total_review = data.results.data.ratings.total_review;
                              $scope.customerReviews =  data.results.data.reviews;
                              $scope.ratingsHtml  = $sce.trustAsHtml(data.results.data.ratings.ratingsHtml);
                        }
			});
       	};
            $scope.getproductDesc = function(){
                  
                  var jsonData = {
                                    account_mongo_id:account_mongo_id,
                                    supid     : supid,
                                    bid       : bid,
                                    city      : GCYCITY,
                                    variantid : prodVarId,
                                    baseurl   : baseurl,
                                    bid       : bid
                              };
                              
                  getWebAppData.getproductDesc(jsonData,'getproductDescription').then(function(data){
                        if(data.errors.code == 1){ //no reviews given
                              
                        }else{
                              $scope.prodNameInDesc = $scope.prodItemname = $scope.productname = data.results.data[prodVarId]['variantitemname'][0];
                              $scope.prodImgInDesc  = $scope.prodImagePath  = data.results.data[prodVarId]['imgpath'][0];
                              $scope.productUrl     = data.results.data[prodVarId]['productUrl'];
                              console.log($scope.productUrl);
                        }
                  });
            };            

            $scope.submitRating = function(){

                  console.log($scope.reviewTitle);
                  console.log($scope.reviewDesc);
                  console.log($scope.score);
                  console.log(encodeURIComponent($scope.prodItemname));
                  console.log($scope.prodImagePath);


                  var jsonData = {
                                    supid          : supid,
                                    ratingScore    : $scope.score,
                                    itemcode       : prodId,
                                    variantid      : prodVarId,
                                    reviewTitle    : ($scope.reviewTitle == "" || $scope.reviewTitle == undefined) ? "" :encodeURIComponent($scope.reviewTitle),
                                    reviewDesc     : ($scope.reviewDesc  == "" || $scope.reviewDesc  == undefined) ? "" :encodeURIComponent($scope.reviewDesc),
                                    prodItemname   : encodeURIComponent($scope.prodItemname),
                                    prodImagePath  : encodeURIComponent($scope.prodImagePath)
                              };
                  getWebAppData.addReviewRating(jsonData,'addReviewRating').then(function(data){
                        if(data.errors.code == 1){ //error in submitting review
                        }else{
                             $window.location.href = $scope.productUrl;
                        }
                  });
            };

             $scope.gotoReviewSection = function() {
              
              $location.hash('rateReviewSection');
              $anchorScroll();
            };
}]);

angular.module("webapp").directive('starRating',function() {
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

                        scope.starClass = function(star, idx){ //console.log(idx+"--"+JSON.stringify(star));
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
