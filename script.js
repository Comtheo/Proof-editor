(function(angular) {
    'use strict';
  angular.module('graphic', ['ngSanitize'])
    .controller('excontroller', ['$window', '$scope', '$sce', function($window, $scope, $sce) {
      
      $scope.steps = [
        {"Description":"",
        "Note":"",
        "VerticalPos":"100px",
        "HorizontalPos":"50px",
        "SRC":"<p>Hello world!</p>"}
      ]

      $scope.connections = [
        {
        }
      ]


      var dragged = 0, connecting = false;
      $scope.move = function(event) 
      {
        if(dragged!=-1)
        {
            event.preventDefault();
            var x = event.clientX;
            var y = event.clientY;
            $scope.steps[dragged].VerticalPos = (y-75)+"px";
            $scope.steps[dragged].HorizontalPos = (x-100)+"px";
            var other_x, other_y;
            for (let i=0;i<$scope.connections.length;i++){
              if(dragged == $scope.connections[i].id1)
              {
                $scope.connections[i].x1=x;
                $scope.connections[i].y1=y;
                
              }
              if(dragged == $scope.connections[i].id2)
              {
                $scope.connections[i].x2=x;
                $scope.connections[i].y2=y;
              }
                      
            }
        }
      };

      $scope.getSrcDoc = function(index){
        return $sce.trustAsHtml($scope.steps[index].SRC);
      };

      $scope.setDraggable = function(index){
        if(!connecting)
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
        document.getElementById("dial").style.display = "none";
        edited = -1;
      }

      $scope.startConnecting = function(){
        window.alert("Click on an element to connect to");
        connecting = true;
      }

      $scope.Connect = function(index){
        if((index==edited)&&connecting)
        {
          window.alert("Can't connect an element with itself")
        }
        else
        if(connecting)
        {
          var x1 = parseInt($scope.steps[edited].HorizontalPos,10)+100
          var x2 =parseInt($scope.steps[index].HorizontalPos,10)+100
          var y1 =parseInt($scope.steps[edited].VerticalPos,10)+75
          var y2 =parseInt($scope.steps[index].VerticalPos,10)+75
        $scope.connections.push({
          "id1":edited,
          "id2":index,
          "x1":x1,
          "x2":x2,
          "y1":y1,
          "y2":y2
        })
        connecting = false;
        window.alert("Connected");
      }
        
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
    }]);
  })(window.angular);