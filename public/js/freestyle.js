$(document).ready(function() {
    var count;
    var selectCategory;
    var selectTime;
    var secondsTimeLimit;
    var topic;
    var user;
    var timeStart;

    // Get current user
    $.get("/get-current-user", function(string) {
	user = string;

	// Set username
	$("#username").html(user);

    })

    // Initialize Bootstrap-Select
    $(".selectpicker").selectpicker();


    $("a[rel='tooltip']").tooltip()

    // When "Start" is pressed, get the desired topic and time. Then, run a 3 second countdown. Then,
    // populate the Topic and Time and enable the input text. When the time is up, get and display the
    // results.
    $("#start").click(function() {

	timeStart = moment().format('M/D/YYYY h:mm:ss a');

	selectCategory = $("#select-category").val();
	selectTime = $("#select-time").val();
	
	seconds = getSeconds(selectTime);
	secondsTimeLimit = seconds;
	topic = getTopic(selectCategory);
	
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
	
    });
    
    $("#submit").click(function() {
	$("#you-box").attr("disabled", true);
	$("#submit").html("<h4>Thanks for your submission!</h4>(please wait until time runs out)");
	$("#submit").attr("submit", "true");
	$("#submit").attr("disabled", true);
	count = 0;
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
	count=time;
	$("#timer").html(toMinutes(count));		
	var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

	function timer()
	{
	    count=count-1;
	    if (count <= 0)
	    {
	    	$("#timer").html(toMinutes(count));
	    	clearInterval(counter);
	    	$("#info").removeClass("alert-info");
	    	$("#info").addClass("alert-success");
	    	$("#info").html("<div width='100%' style='font-size:2em;font-weight:bold;text-align:center;margin-bottom:15px'>Time's up!</div><div width='100%' style='font-size:1em;font-weight:bold;text-align:center'><a href='freestyle.html'>Play Again</a></div>");	            
	    	$("#you-box").attr("disabled", true);
	    	$("#submit").html("<h4>Thanks for your submission!</h4>");
	    	$("#submit").attr("submit", "true");
	    	$("#submit").attr("disabled", true);



		$.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/writings?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
			  data: JSON.stringify( {
			      "prompt":topic,
			      "category":selectCategory,
			      "time-limit":secondsTimeLimit,
			      "user":user,
			      "opponent":"",
			      "opponent-writing-id":"",
			      "win":'""',
			      "time-start":timeStart,
			      "text":$("#you-box").val(),
			      "votes":"",
			      "comment-ids":""
			  } ),
			  type: "POST",
			  contentType: "application/json",
			  success: function(data, textStatus, jqXHR) { $("#add-writing-well").text("Done!"); }
			})



	        return;
	    }

	    $("#timer").html(toMinutes(count));
	}
    };

    // Gets a topic related to the input category.
    // TODO: Actually implement categories and topics.
    var getTopic = function(category) {
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
});

