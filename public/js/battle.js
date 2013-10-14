$(document).ready(function() {
    var opponentFound = false;
    var selectCategory;
    var selectTime;
    var seconds;
    var topic;
    var selectSeconds;
    var user;
    var opponentName;
    var myMatch;
    var myMatchID;
    var userNum; //(1 or 2)
    var myVotes;
    var opponentVotes;
    var timeStart;

    // Initialize Bootstrap-Select
    $(".selectpicker").selectpicker();

    // Initialize tooltips.
    $("a[rel='tooltip']").tooltip();

    // Used to keep track of the opponent's text.
    var opponentText = "foo";

    // Get current user                                                  
    $.get("/get-current-user", function(string) {
        user = string;
        // Set username
        $("#username").html(user);
    })

    // When "Start" is pressed, get the desired topic and time. Then, run a 3 second countdown. Then,
    // populate the Topic and Time and enable the input text. When the time is up, get and display the
    // results.
    $("#start").click(function() {

	timeStart = moment().format('M/D/YYYY h:mm:ss a');


	selectCategory = $("#select-category").val();
	selectTime = $("#select-time").val();

	seconds = getSeconds(selectTime);
	topic = getTopic(selectCategory);
	selectSeconds = seconds;

	$("#info").html("<div width='100%' style='font-size:2em;font-weight:bold'><span style='text-align:center'>Looking for opponent...</span></div>");

	// Find opponent
	//	console.log(selectCategory);
	var opponents = [];

	
	var myUrl =  "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching?q={'category':'"+selectCategory+"','time':'"+selectTime+"','needs-users':'true','needs-votes':'false'}&apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv"
	$.ajax( { url:myUrl,
		  type: "GET",
		  contentType: "application/json",
		  async: false,
		  success: function(data, textStatus, jqXHR) { 
		      console.log(data);
		      myMatch = data[0];
		      opponents = data;
		  }
		})
	if (opponents.length != 0){
	    // update opponents to add itself to the user id.
	    // set needs users to false
	    // start battle
	    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                      data: JSON.stringify( { "$set":{
			  "user-2":user,
			  "needs-users":"false"
                      }} ),
                      type: "PUT",
                      contentType: "application/json",
		      async: false,
		      success: function(data, textStatus, jqXHR) { 
			  console.log(data);
			  }			  
                    })
	    userNum = 2;
	    console.log("user found!");
	    opponentName = myMatch["user-1"];
	    $("#opponent-name").html(opponentName);
	    $("#info").html("<div width='100%' style='font-size:2em;font-weight:bold'><span style='text-align:center'>Opponent Found!: "+opponentName+"</span></div>");
	    setTimeout(function(){opponentFound();},3000);
	} else {
	    // add self to the  matching table

	    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                      data: JSON.stringify( {
			  "category":selectCategory,
			  "time":selectTime,
			  "user-1":user,
			  "user-2":"",
			  "needs-users":"true",
			  "needs-votes":"false",
                      } ),
                      type: "POST",
                      contentType: "application/json",
		      async: false,
		      success: function(data, textStatus, jqXHR) { 
			  myMatch=data; 
		      }
                    })
	    userNum = 1;
	    // wait for update
	    myMatchID = myMatch._id.$oid;
	    console.log(myMatch);

	    var anotherUser = false;

		console.log(anotherUser);

	    var matching = setInterval(
		function(){
		    console.log("lol");
		    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching?q={'needs-users':'false','_id':{'$oid':'"+myMatchID+"'}}&apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
			      type: "GET",
			      contentType: "application/json",
			      async: false,
			      success: function(data, textStatus, jqXHR) { 

				  if (data.length>0){
				      console.log("opponent found!");
				      myMatch = data[0];
				      opponentName = myMatch["user-2"];	    

				      $("#opponent-name").html(opponentName);
				      $("#info").html("<div width='100%' style='font-size:2em;font-weight:bold'><span style='text-align:center'>Opponent Found!: "+opponentName+"</span></div>");
				      setTimeout(function(){opponentFound();},3000);
				      clearInterval(matching);
				  }
			      }
			    })
		}
		, 1000);
	    console.log("mymatch");
	    console.log(myMatch);


	}



	console.log(myMatch);
    });

    var opponentFound = function(){
	    console.log("startinggg");

	    countdown(); // Start the 3 second countdown.

	    setTimeout(function(){
		$("#submit").removeAttr("disabled");
		$("#submit").html("<h4>Submit</h4>(automatically submits when time's up)");

		$("#you-box").attr("disabled", false);
		$("#you-box").focus();

		$("#info").html("");
		$("#info").html("<div width='100%' style='font-size:2em;font-weight:bold'><span style='text-align:left'>Topic: "+topic+"</span><span style='float:right; position:relative'>Time Remaining: <span id='timer'></span></span></div>");
		countdownTimer(seconds); // Start the Time Remaining timer.

	    },4000); // 4 second wait to accomodate the countdown.
    }


    $("#submit").click(function() {
	if ($("#submit").attr("submit") == "false"){
	    $("#you-box").attr("disabled", true);
	    $("#submit").html("<h4>Thanks for your submission!</h4>(click to continue writing)");
	    $("#submit").attr("submit", "true");
	} else {
	    $("#you-box").attr("disabled", false);
	    $("#submit").html("<h4>Submit</h4>(automatically submits when time's up)");
	    $("#submit").attr("submit", "false");
	}
    });


    // Runs and displays the 3 second countdown in the info bar.
    var countdown = function(){
	$("#info").html("");
	$("#info").html("<div width='100%' style='font-size:2em;text-align:center;font-weight:bold' ><span id='countdown-3'>3</span> <span id='countdown-2'>2</span> <span id='countdown-1'>1</span> <span id='countdown-start'>START!</span></div>");

	setTimeout(function(){$("#countdown-3").css({"color":"#0044cc", "text-shadow":"0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #0044cc, 0 0 30px #0044cc, 0 0 40px #0044cc, 0 0 50px #0044cc, 0 0 75px #0044cc"})},1000);
	setTimeout(function(){$("#countdown-2").css({"color":"#0044cc", "text-shadow":"0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #0044cc, 0 0 30px #0044cc, 0 0 40px #0044cc, 0 0 50px #0044cc, 0 0 75px #0044cc"})},2000);
	setTimeout(function(){$("#countdown-1").css({"color":"#0044cc", "text-shadow":"0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #0044cc, 0 0 30px #0044cc, 0 0 40px #0044cc, 0 0 50px #0044cc, 0 0 75px #0044cc"})},3000);
	setTimeout(function(){$("#countdown-start").css({"color":"#0044cc", "text-shadow":"0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #0044cc, 0 0 30px #0044cc, 0 0 40px #0044cc, 0 0 50px #0044cc, 0 0 75px #0044cc"})},4000);
    }


    // Tracks and updates the timer.
    // Timer base from: http://stackoverflow.com/questions/1191865/code-for-a-simple-javascript-countdown-timer
    var countdownTimer = function(time) { 
	var count=time; 

	$("#timer").html(toMinutes(count));		
	var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

	function timer()
	{
	    count=count-1;
	    if (count <= 0)
	    {
	    	$("#timer").html(toMinutes(count));
	    	clearInterval(counter);
	        $("#info").html("<div width='100%' style='font-size:2em;text-align:center;font-weight:bold' >Time's up! Waiting for results...</div>");
	        $("#you-box").attr("disabled", true);
	        $("#submit").html("<h4>Thanks for your submission!</h4>");
	        $("#submit").attr("submit", "true");
	        $("#submit").attr("disabled", true);
		console.log("done!");

		console.log("getting results...");
		var myVotes;
		var opponentVotes;
		text = $("#you-box").val();
		if (userNum == "1"){
		    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
			      data: JSON.stringify( { "$set":{
				  "user-1-text":text,
				  "needs-votes":"true"
			      }} ),
			      type: "PUT",
			      contentType: "application/json",
			      async: false,
			      success: function(data, textStatus, jqXHR) {
				  console.log(data);
			      }
			    })
		} else {
		    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
			      data: JSON.stringify( { "$set":{
				  "user-2-text":text,
				  "needs-votes":"true"
			      }} ),
			      type: "PUT",
			      contentType: "application/json",
			      async: false,
			      success: function(data, textStatus, jqXHR) {
				  console.log(data);
			      }
			    })
		}

		var voting = setInterval(function(){
		    console.log("lol");
		    $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
			      type: "GET",
			      contentType: "application/json",
			      async: false,
			      success: function(data, textStatus, jqXHR) {
				  console.log(data);
				  if ((parseInt(data["user-1-votes"])+parseInt(data["user-2-votes"]))>=2){
				      console.log(data["user-1-votes"]);
				      console.log(data["user-2-votes"]);
				      if (userNum == "1"){
					  myVotes = data["user-1-votes"];
					  opponentVotes = data["user-2-votes"];
				      } else {
					  opponentVotes = data["user-1-votes"];
					  myVotes = data["user-2-votes"];
				      }
				      console.log(myVotes);
				      console.log(opponentVotes);   
				      $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
						data: JSON.stringify( { "$set":{
						    "needs-votes":"false"
						}} ),
						type: "PUT",
						contentType: "application/json",
						async: false,
						success: function(data, textStatus, jqXHR) {
						}
					      })
				      console.log(myVotes);
				      console.log(opponentVotes);
				      showWinner(myVotes, opponentVotes);				      
				      clearInterval(voting);
				  }
			      }
			    })
		}
					 , 1000);

		console.log("done2!");
	        return;
	    } 

	    $("#timer").html(toMinutes(count));
//	    updateOpponentBox();
	    text = $("#you-box").val();
            if (userNum == "1"){
                $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0\
K8NAlVZwM9QqHctUJrWUv",
                          data: JSON.stringify( { "$set":{
                              "user-1-text":text,
                          }} ),
                          type: "PUT",
                          contentType: "application/json",
                          async: false,
                          success: function(data, textStatus, jqXHR) {

                          }
                        })

		$.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0\
K8NAlVZwM9QqHctUJrWUv",
                          type: "GET",
                          contentType: "application/json",
                          async: false,
                          success: function(data, textStatus, jqXHR) {
                              $("#opp-box").html(data["user-2-text"]);
                          }
			})
                      



            } else {
                $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0\
K8NAlVZwM9QqHctUJrWUv",
                          data: JSON.stringify( { "$set":{
                              "user-2-text":text,
                          }} ),
                          type: "PUT",
                          contentType: "application/json",
                          async: false,
                          success: function(data, textStatus, jqXHR) {
                                       }
                        })

		$.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/matching/"+myMatch._id.$oid+"/?apiKey=CPBZJI2Y7k0\
K8NAlVZwM9QqHctUJrWUv",
                          type: "GET",
                          contentType: "application/json",
                          async: false,
                          success: function(data, textStatus, jqXHR) {
                              $("#opp-box").html(data["user-1-text"]);
                          }
			})
            }







	}
    };

    var myFinalVotesResults;
    var opponentFinalVotesResults;
    var showWinner = function(myFinalVotes, opponentFinalVotes){
	var win;
	console.log(myFinalVotes);
	console.log(opponentFinalVotes);
	myFinalVotesResults = myFinalVotes;
	opponentFinalVotesResults = opponentFinalVotes;
	if (parseInt(myFinalVotes)>parseInt(opponentFinalVotes)) {
	    $("#info").removeClass("alert-info");
	    $("#info").addClass("alert-success");
	    $("#info").html("<div width='100%' style='font-size:2em;font-weight:bold;text-align:center;margin-bottom:15px'>You win!</div><div width='100%' style='font-size:1em;font-weight:bold;text-align:center'><a href='#' id='results'>View Results</a> | <a href='battle.html'>Play Again</a></div>");
	    win = "true";
	} else {
	    $("#info").removeClass("alert-info");
	    $("#info").addClass("alert-error");
	    $("#info").html("<div width='100%' style='font-size:2em;font-weight:bold;text-align:center;margin-bottom:15px'>Sorry, you lose.</div><div width='100%' style='font-size:1em;font-weight:bold;text-align:center'><a href='#' id='results'>View Results</a> | <a href='battle.html'>Play Again</a></div>");
	    win = "false";
	}



    $("#results").click(function(){
	$("#results-well-user").html("<div class='well alert-info'>Votes:"+myFinalVotesResults+"</div>");
	$("#results-well-opponent").html("<div class='well alert-info'>Votes:"+opponentFinalVotesResults+"</div>");
    });



        $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/writings?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                  data: JSON.stringify( {
                      "prompt":topic,
                      "category":selectCategory,
                      "time-limit":selectSeconds,
                      "user":user,
                      "opponent":opponentName,
                      "win":win,
                      "time-start":timeStart,
                      "text":$("#you-box").val(),
                      "votes":myFinalVotesResults,
                      "comment-ids":""
                  } ),
                  type: "POST",
                  contentType: "application/json",
                  success: function(data, textStatus, jqXHR) { $("#add-writing-well").text("Done!"); }
                })
    }



    

    // Gets the results of a writing battle.
    // TODO: Actually get results.
    var getResults = function() {
	return true;
    }

    // Gets a topic related to the input category.
    // TODO: Actually implement categories and topics.
    var getTopic = function(category) {
	// TODO: Implement actual random categories. Also make sure both clients get the same category.
	// categories = ["Technology","Nature","History"];
	// if (category == "All"){
	//     category = categories[Math.floor(Math.random()*categories.length)];
	// }

	console.log(category);
	switch(category){
	case "All": // TODO: implement random category and topic getting.
	    return "Richard Stallman's Crusade for Free Software";

	case "Technology":
	    return "Richard Stallman's Crusade for Free Software";

	case "Nature":
	    return "The Alaskan Flying Mantis Bear";

	case "History":
	    return "The Rise of Prophet Zachary Comstock";

	}

	
    }

    // Parses the input minute string and converts into a number of seconds.
    // For example, "1 minute" becomes 60.
    var getSeconds = function(timeLimitString) {
	return parseInt(timeLimitString.split(/\b/)[0])*60;
    }

    // Converts seconds into a string in the form "minutes:seconds".
    // For example, 80 becomes "1:20"
    var toMinutes = function(secondsRaw) {
	minutes = Math.floor(secondsRaw/60);
	seconds = secondsRaw-minutes*60;

	if (seconds.toString().length == 1){
	    seconds = "0"+seconds;
	}

	return minutes+":"+seconds;
    }

    // Update the opponent box's text.
    var updateOpponentBox = function() {
	opponentText = getOpponentText();
	$("#opp-box").html(getOpponentText);
    }

    // Get the opponent's text. 
    // TODO: Actually get the opponent's text.
    var getOpponentText = function() {
	if (Math.floor(Math.random() * 3) == 1){
	    return opponentText+" "+['foo','bar','baz'][Math.floor(Math.random() * 3)];
	} else {
	    return opponentText;
	}
    }

});

