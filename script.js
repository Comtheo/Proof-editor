(function(angular) {
    'use strict';
  angular.module('graphic', [])
    .controller('excontroller', ['$window', '$scope', function($window, $scope) {
      
      $scope.steps = [
        {"Id":10,
        "Description":"Description",
        "Note":"Note",
        "VerticalPos":"100px",
        "HorizontalPos":"50"}
      ]
      var dragged = 0;
      $scope.move = function(event) 
      {
        if(dragged!=-1)
        {
            event.preventDefault();
            var x = event.clientX;
            var y = event.clientY;
            var coords = "X: "+x+"Y: "+y;
            $scope.steps[dragged].VerticalPos = (y-75)+"px";
            $scope.steps[dragged].HorizontalPos = (x-100)+"px";
        }
      };

      $scope.setDraggable = function(index){
        dragged = index;
      }

      $scope.unsetDraggable = function(){
        dragged = -1;
      }

      $scope.addNew = function(){
        $scope.steps.push({
          "Id":10,
        "Description":"Description",
        "Note":"Note",
        "VerticalPos":"100px",
        "HorizontalPos":"50"
        }
        )
      }

      $scope.hide = function(){
        document.getElementById("dial").style.display = "none";
      };

      $scope.back = function(){
        //document.getElementById("dial").style.display = "initial";
      };
    }]);
  })(window.angular);