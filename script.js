(function(angular) {
    'use strict';
  angular.module('graphic', [])
    .controller('excontroller', ['$window', '$scope', function($window, $scope) {
      
      $scope.move = function(event,md) 
      {
        
        if(md!=0)
        {
          event.preventDefault();
            //console.log(md);
            var x = event.clientX;
            var y = event.clientY;
            var coords = "X: "+x+"Y: "+y;
            document.getElementById("circ"+md).style.top=(y-75)+"px";
            document.getElementById("circ"+md).style.left=(x-100)+"px";
            /*var line = document.getElementById("line");
            line.setAttribute("x2",x);
            line.setAttribute("y2",y);*/
        }
      };

      $scope.hide = function(){
        document.getElementById("dial").style.display = "none";
      };

      $scope.back = function(){
        //document.getElementById("dial").style.display = "initial";
      };
    }]);
  })(window.angular);