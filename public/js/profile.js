$(document).ready(function() {
                  var currentuser
                  //replace the user's name on the profile page
                  $.get("/get-current-user", function(string) {
                        currentuser=string;
                        if(string=="Guest"){
                        $("#currentuser").text(string);
                        } else{
                        $("#currentuser").text(string.charAt(0).toUpperCase() + string.slice(1));
                        }
                        });

                   $.getJSON("/get-accounts", function(string) {
                      $.each(string, function(index, value) {
               
                                   if(value.user==currentuser){
                                      $("#join_date").text("Member since "+value.date.split(",")[0]);
                                    }
          
                                   
                                 });
      
                    });

                   var categories = ['votes', 'date', 'category'];

                   $.each(categories, function(index, category) {
        // Add in dropdown menu
        $('#sort_dropdown_menu').append('<li><a id="sort_' + category + '">' +category+ '</a></li>');
        $('#sort_' + category).click(function() {
            var container = document.getElementById("writings");
            container.innerHTML=" ";
            $('#writings').innerHTML=" ";
            $.getJSON('https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/writings?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv', {
                key : category
            }, function(data) {
              $("#menu").text("Sort by: "+category+" ");
              $("#menu").append('<b class="caret"></b>');
 
                var pieces = [];
 
                // show users with existing profiles first
                $.each(data, function(index, value) {
                  if(value.user==currentuser){
                        pieces.push(value);

                    }
                });
                console.log(pieces);
                if(category=="category"){
                  pieces.sort(function(a, b) {

                      if(a.category<b.category) return -1;
                      if(a.category>b.category) return 1;
                      return 0;
                      });
                }
                else if(category=="date"){
                  pieces.sort(function(a, b) {
                    return Date.parse(b.time) - Date.parse(a.time)
                 });

                }
                else{
                  pieces.sort(function(a, b) {
                    return parseInt(b.votes) - parseInt(a.votes)
                 });
                }
 
                

                 $.each(pieces, function(index, value) {
                  console.log(value.category);
                   if(value.win=="true"){
                                  
                                      add_writing(value.prompt,value.text,"#9bd085");
                                    }
                                    else if(value.win=="false"){
               
                                      add_writing(value.prompt,value.text,"#d18a8a");
                                    }
                                    else{
                                      add_writing(value.prompt,value.text,"#79bfe2");
                                      
                                    }
                 });

              });
            });


      });


                  
                  var numberOfWriting=0
                  var win=0;
                  var loss=0;
                  $.getJSON('https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/writings?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv', function(data) {
                            // console.log(data);
                            $.each(data, function(index, value) {
                                   if(value.user==currentuser){
                                    numberOfWriting+=1;
                                    if(value.win=="true"){
                                      win+=1;
                                      add_writing(value.prompt,value.text,"#9bd085");
                                    }
                                    else if(value.win=="false"){
                                      loss+=1;
                                      add_writing(value.prompt,value.text,"#d18a8a");
                                    }
                                    else{
                                      add_writing(value.prompt,value.text,"#79bfe2");
                                      
                                    }
                                   }
                                   });
                            $("#total_writing").text("Total Writings: "+numberOfWriting);
                            $("#totalWin").text("Total Wins: "+win);
                            $("#totalLoss").text("Total Losses: "+loss);
                            });
                  

                  function add_writing(title, content, color, time) {
                  var container = document.getElementById("writings");
                  var div = document.createElement("div");
                  div.className = "span3";
                  var div2 = document.createElement("div");
                  div2.style.backgroundColor="#f5f5f5";


                  var h4= document.createElement("h4");
                  h4.id="h4";
                  var titleDisplay = document.createTextNode(title);
                  h4.style.backgroundColor=color;
                  h4.style.padding="15px";
                  h4.style.borderRadius="4px";

                  
                  var h5 = document.createElement("h5");
                  h5.style.backgroundColor="#f5f5f5";
                  h5.style.padding="15px";
                  h5.style.borderRadius="4px";
                  h5.style.borderBottom="5px";
                  h5.style.height="200px";
                  h5.style.overflow="hidden";
                  
                  var a = document.createElement("a");
                  a.href="results.html";
                  a.style.color="black";
                  var titleDisplay = document.createTextNode(title);
                  a.appendChild(titleDisplay);
                  var p = document.createElement("p");
                  if(content.length<300){
                    var contentDisplay = document.createTextNode(content);
                  }
                  else{
                    var contentDisplay = document.createTextNode(content.substring(0,300)+" .......");

                  }


                //  var contentDisplay = document.createTextNode(content);
                  h4.appendChild(a);
                  p.appendChild(contentDisplay);

                  //var dots=document.createTextNode("...");

                 // p.appendChild(dots);

                  h5.appendChild(p);
                  div2.appendChild(h4);
                  div2.appendChild(h5);
                  div.appendChild(div2);
                  container.appendChild(div);
                  }
                
                  
                  
                  });
