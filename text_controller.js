(function(angular) {
    'use strict';
  angular.module('text', [])
    .controller('text_controller', ['$window', '$scope', function($window, $scope) {
      
        $scope.steps = [
            {"Description":"aaa",
            "Note":""}
        ];

        $scope.editing = true;

        $scope.connections = [

        ];

        $scope.edit = function(index){
            console.log(index);
            var rect = document.getElementById("frame--"+index).getBoundingClientRect();
            console.log(rect.top+" "+rect.left);
            var text_field = document.getElementById("text_input");
            text_field.style.top=rect.top+"px";
            text_field.style.left=rect.left+"px";
        };

        $scope.addNew = function(){
            $scope.steps.push({"Description":"","Note":""})
        };

    }]);
  })(window.angular);