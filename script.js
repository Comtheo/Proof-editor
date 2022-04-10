(function(angular) {
    'use strict';
  angular.module('graphic', ['ngSanitize'])
    .controller('excontroller', ['$window', '$scope', '$sce', function($window, $scope, $sce) {
      
      $scope.steps = [
        {"Id":10,
        "Description":"Description",
        "Note":"Note",
        "VerticalPos":"100px",
        "HorizontalPos":"50",
        "SRC":"<p>Hello world!</p>"}
      ]
      var dragged = 0;
      $scope.move = function(event) 
      {
        if(dragged!=-1)
        {
            event.preventDefault();
            var x = event.clientX;
            var y = event.clientY;
            $scope.steps[dragged].VerticalPos = (y-75)+"px";
            $scope.steps[dragged].HorizontalPos = (x-100)+"px";
        }
      };

      $scope.getSrcDoc = function(index){
        return $sce.trustAsHtml($scope.steps[index].SRC);
      };

      $scope.setDraggable = function(index){
        dragged = index;
      }
      var edited = -1;
      $scope.editStep = function(index){
        edited = index;
        document.getElementById("dial").style.display = "block";
        document.getElementById("note_input").value = $scope.steps[edited].Note;
        document.getElementById("text_input").value = $scope.steps[edited].Description;
      }

      $scope.stopEditing = function(i){
        var text = document.getElementById("text_input").value;
        $scope.steps[edited].Description = text;
        $scope.steps[edited].Note = document.getElementById("note_input").value;
        var generator = new latexjs.HtmlGenerator();
        generator = latexjs.parse(text, { generator: generator });
        $scope.steps[edited].SRC = generator.htmlDocument("https://cdn.jsdelivr.net/npm/latex.js@0.12.4/dist/").documentElement.outerHTML;
        document.getElementById("frame-"+edited).srcdoc = $scope.steps[edited].SRC;
        console.log($scope.steps[edited].SRC);
        document.getElementById("dial").style.display = "none";
        edited = -1;
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
        "HorizontalPos":"50",
        "SRC":"EditMe"
        }
        )
      }



      $scope.back = function(){
        //document.getElementById("dial").style.display = "initial";
      };
    }]);
  })(window.angular);