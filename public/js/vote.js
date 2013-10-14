//equal height columns come courtesy of http://www.cssnewbie.com/equal-height-columns-with-jquery

function equalHeight(group) {
    var tallest = 0;
    group.each(function() {
	var thisHeight = $(this).height();
	if(thisHeight > tallest) {
	    tallest = thisHeight;
	}
    });
    group.height(tallest);
}


function equalWidth(group) {
    var widest = 0;
    group.each(function() {
	var thisWidth = $(this).width();
	if(thisWidth > widest) {
	    widest = thisWidth;
	}
    });
    group.width(widest);
}

var myMatch;

$(document).ready(function() {
//    equalHeight($(".equalheight"));

    $.ajax( { url:"https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching?q={'needs-votes':'true'}&apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
              type: "GET",
              contentType: "application/json",
              async: false,
              success: function(data, textStatus, jqXHR) {
            
                  myMatch = data[0];
		  console.log(myMatch);
              }
            })

    if (myMatch == null){
	$("#info").html("No votes are currently needed. Please check back later. Thank you!");
	$("#vote1").attr("disabled", true);
	$("#vote2").attr("disabled", true);
	$("#submit").attr("disabled", true);

    } else{


	$("#topic").html("The Alaskan Flying Mantis Bear"); // TODO: still hardcoded lol
	$("#time").html(myMatch.time);
	$("#user-1").html(myMatch["user-1"]);
	$("#user-2").html(myMatch["user-2"]);
	$("#user-1-text").html(myMatch["user-1-text"]);
	$("#user-2-text").html(myMatch["user-2-text"]);
    }




    // When a vote button is clicked, it should respond accordingly. In particular,
    // the button should either change to a checkmark, change to a checkmark and
    // un-checkmark the other button, or un-checkmark the button.
    $("#vote1").click(function(){
	if($("#vote1").html()!="Vote"){
	    if($("#vote2").html()=="Vote"){
		$("#vote1").html("Vote");
		$("#vote1").removeClass("btn-custom");
		$("#vote1").addClass("btn-success");
	    }
	} else{
	    if($("#vote2").html()=="Vote"){
		$("#vote1").html("<p style='font-size:20px;'>&#10004;</p>");
		$("#vote1").removeClass("btn-success");
		$("#vote1").addClass("btn-custom");
	    } else{
		$("#vote1").html("<p style='font-size:20px;'>&#10004;</p>");
		$("#vote1").removeClass("btn-success");
		$("#vote1").addClass("btn-custom");
		$("#vote2").html("Vote");
		$("#vote2").removeClass("btn-custom");
		$("#vote2").addClass("btn-success");
	    }
	}
    });
    $("#vote2").click(function(){
	if($("#vote2").html()!="Vote"){
	    if($("#vote1").html()=="Vote"){
		$("#vote2").html("Vote");
		$("#vote2").removeClass("btn-custom");
		$("#vote2").addClass("btn-success");
	    }
	} else{
	    if($("#vote1").html()=="Vote"){
		$("#vote2").html("<p style='font-size:20px;'>&#10004;</p>");
		$("#vote2").removeClass("btn-success");
		$("#vote2").addClass("btn-custom");
	    } else{
		$("#vote2").html("<p style='font-size:20px;'>&#10004;</p>");
		$("#vote2").removeClass("btn-success");
		$("#vote2").addClass("btn-custom");
		$("#vote1").html("Vote");
		$("#vote1").removeClass("btn-custom");
		$("#vote1").addClass("btn-success");
	    }
	}
    });


    $("#submit").click(function(){


	
	var curVotes;

	if($("#vote1").html()!="Vote"){

	    if(myMatch["user-1-votes"] == null){
		curVotes = 1;
	    } else{
		curVotes = parseInt(myMatch["user-1-votes"]) + 1;
	    }

	    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                      data: JSON.stringify( { "$set":{
                          "user-1-votes":curVotes
                      }} ),
                      type: "PUT",
                      contentType: "application/json",
                      async: false,
                      success: function(data, textStatus, jqXHR) {
                      }
                    })

	} else if ($("#vote2").html()!="Vote"){
	    if(myMatch["user-2-votes"] == null){
		curVotes = 1;
	    } else{
		curVotes = parseInt(myMatch["user-2-votes"]) + 1;
	    }


	    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                      data: JSON.stringify( { "$set":{
                          "user-2-votes":curVotes
                      }} ),
                      type: "PUT",
                      contentType: "application/json",
                      async: false,
                      success: function(data, textStatus, jqXHR) {
                      }
                    })

	}
	location.reload();

    });
});
