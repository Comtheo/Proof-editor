(function(angular) {
    'use strict';
  angular.module('text', [])
    .controller('text_controller', ['$window', '$scope', function($window, $scope) {
      
        $scope.steps = [
            {"Description":"",
            "Note":"",
            "ButtonText":"Edit",}
        ];

        $scope.editing = false;

        $scope.connections = [

        ];

        $scope.deleteStep = function(index){
            if(!$scope.editing)
                $scope.steps.splice(index,1);
        }

        $scope.edit = function(index){
            if($scope.editing == false)
            {
                console.log(index);
                var rect = document.getElementById("frame--"+index).getBoundingClientRect();
                console.log(rect.top+" "+rect.left);
                var text_field = document.getElementById("text_input");
                text_field.style.top=rect.top+"px";
                text_field.style.left=rect.left+"px";
                text_field.value=$scope.steps[index].Description;
                $scope.steps[index].ButtonText="Submit"
                $scope.editing = true;
                $scope.edited = index;
            }
            else
            {
                if($scope.edited==index)
                {
                    var generator = new latexjs.HtmlGenerator();
                    $scope.steps[index].Description=document.getElementById("text_input").value;
                    generator = latexjs.parse($scope.steps[index].Description, { generator: generator });
                    document.getElementById("frame--"+index).srcdoc = generator.htmlDocument("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/").documentElement.outerHTML;
                    $scope.steps[index].ButtonText="Edit"
                    $scope.editing = false;
                }
            }
        };

        $scope.addNew = function(){
            $scope.steps.push({"Description":"","Note":"","ButtonText":"Edit"})
        };

    }]);
  })(window.angular);