(function(angular) {
    'use strict';
  angular.module('graphic', ['ngSanitize'])
    .controller('excontroller', ['$window', '$scope', '$sce', function($window, $scope, $sce) {
      
      $scope.steps = [
        {"Description":"",
        "Note":"",
        "VerticalPos":"100px",
        "HorizontalPos":"50px"}
      ]

      $scope.connections = [
      ]

      $scope.export = function(){
        let export_string=$scope.steps.length+"\n";
        for(let i=0;i<$scope.steps.length;i++)
        {
          export_string = export_string + $scope.steps[i].Description+"\n";
          export_string = export_string + $scope.steps[i].Note+"\n";
          export_string = export_string + parseInt($scope.steps[i].VerticalPos,10) + "\n";
          export_string = export_string + parseInt($scope.steps[i].HorizontalPos,10) + "\n";
        }
        export_string = export_string + $scope.connections.length + "\n";
        for(let i=0;i<$scope.connections.length;i++)
        {
          var connection = $scope.connections[i];
          export_string = export_string + connection.id1 + " " + connection.id2 + " " + connection.x1 + " " + connection.y1 + " " + connection.x2+ " " + connection.y2+"\n";
        }
        document.getElementById("download_link").href="data:,"+export_string;
        document.getElementById("download_link").click();
      }

      $scope.proof_import = function(){
        var f = document.getElementById("choose_imported").files[0];
        const reader = new FileReader();
        reader.onload = function(){
          var lines = reader.result.split('\n');
          let steps_count = parseInt(lines[0],10);
          let connections_count = parseInt(lines[4*steps_count+1],10);
          let connections_beginning = 4*steps_count+2;
          $scope.steps = [];
          $scope.connections = [];
          for(let i=0;i<steps_count;i++)
          {
            let description = lines[4*i+1];
            let note = lines[4*i+2];
            let vertical_pos = lines[4*i+3];
            let horizontal_pos = lines[4*i+4];
            console.log(description + note + vertical_pos + horizontal_pos);
            $scope.steps.push({
              "Description":description,
              "Note":note,
              "VerticalPos":vertical_pos+"px",
              "HorizontalPos":horizontal_pos+"px"
              })
          }
          console.log(connections_count);
          for(let i=0;i<connections_count;i++)
          {
            let line_index = i+connections_beginning;
            let coords = lines[line_index].split(" ");
            let id1 = parseInt(coords[0],10);
            let id2 = parseInt(coords[1],10);
            let x1 = parseInt(coords[2],10);
            let y1 = parseInt(coords[3],10);
            let x2 = parseInt(coords[4],10);
            let y2 = parseInt(coords[5],10);
            $scope.connections.push({
              "id1":id1,
              "id2":id2,
              "x1":x1,
              "x2":x2,
              "y1":y1,
              "y2":y2
            })
          }
        };
        reader.readAsText(f);
      }

      var dragged = -1, connecting = false, disconnecting = false;
      $scope.move = function(event) 
      {
        if(dragged!=-1)
        {
            event.preventDefault();
            var x = event.clientX;
            var y = event.clientY;
            $scope.steps[dragged].VerticalPos = (y-75)+"px";
            $scope.steps[dragged].HorizontalPos = (x-100)+"px";
            for (let i=0;i<$scope.connections.length;i++){
              if(dragged == $scope.connections[i].id1)
              {
                
                var id2 = $scope.connections[i].id2;
                var other_x = parseInt($scope.steps[id2].HorizontalPos,10);
                var other_y = parseInt($scope.steps[id2].VerticalPos,10);
                console.log($scope.quadrant(x,y,other_x,other_y));
                $scope.connections[i].x1=x;
                    $scope.connections[i].y1=y;
                /*switch($scope.quadrant(x,y,other_x,other_y))
                {
                  case 1:
                    $scope.connections[i].x1=x-100;
                    $scope.connections[i].y1=y+100;
                    $scope.connections[i].x2=other_x+100;
                    $scope.connections[i].y2=other_y-50;
                    break;
                  case 2:
                    $scope.connections[i].x1=x+100;
                    $scope.connections[i].y1=y+100;
                    $scope.connections[i].x2=other_x-100;
                    $scope.connections[i].y2=other_y-50;
                    break;
                  case 3:
                    $scope.connections[i].x1=x+100;
                    $scope.connections[i].y1=y-50;
                    $scope.connections[i].x2=other_x-100;
                    $scope.connections[i].y2=other_y+100;
                    break;
                  case 4:
                    $scope.connections[i].x1=x-100;
                    $scope.connections[i].y1=y-50;
                    $scope.connections[i].x2=other_x+200;
                    $scope.connections[i].y2=other_y+150;
                    break;
                }*/
                
              }
              if(dragged == $scope.connections[i].id2)
              {
                $scope.connections[i].x2=x;
                $scope.connections[i].y2=y;
              }
                      
            }
        }
      };

      $scope.quadrant = function(x1, y1, x2, y2){
        var delta_x = x1 - x2;
        var delta_y = y1 - y2;
        if(delta_x > 0)
        {
          if(delta_y>0)
            return 4;
          else
            return 1;
        }
        else
        {
          if(delta_y>0)
            return 3;
          else
            return 2;
        }
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
        connecting = true;
      }
      
      $scope.startDisconnecting = function(){
        disconnecting = true;
      }

      $scope.removeStep = function(){
        $scope.steps.splice(edited,1);
        for(let i=$scope.connections.length-1;i>=0;i--)
        {
          if($scope.connections[i].id1==edited||$scope.connections[i].id2==edited)
            $scope.connections.splice(i,1);
          else
          {
            if($scope.connections[i].id1>edited)
              $scope.connections[i].id1--;
            if($scope.connections[i].id2>edited)
              $scope.connections[i].id2--;
          }
        }
        edited=-1;
        document.getElementById("dial").style.display = "none";
      }

      $scope.Connect = function(index){
        var success = false;
        if(disconnecting)
        {
          for (let i=$scope.connections.length-1;i>=0;i--){
            if(($scope.connections[i].id1==edited&&$scope.connections[i].id2==index)||($scope.connections[i].id2==edited&&$scope.connections[i].id1==index))
            {
              $scope.connections.splice(i,1);
              success =true;
              break;
            }
          }
          disconnecting = false;
          if(!success)
            window.alert("Nothing to be disconnected");
        }
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
      document.getElementById("dial").style.display = "none";
      }

      $scope.unsetDraggable = function(){
        dragged = -1;
      }

      $scope.addNew = function(){
        $scope.steps.push({
        "Description":"",
        "Note":"",
        "VerticalPos":"100px",
        "HorizontalPos":"50"
        })
      }
    }]);
  })(window.angular);