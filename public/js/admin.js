$(document).ready(function() {

    // TODO: REMOVE TEST
    $("#accounts").click(function(){
	$.get("/get-accounts", function(string) {
	    $("#accounts-well").text(string)
	})
    });

    // Add a user with the name benB.
    $("#add-user").click(function(){	
        $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/accounts?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                  data: JSON.stringify( { "name":"benB" } ),
                  type: "POST",
                  contentType: "application/json",
		  success: function(data, textStatus, jqXHR) { $("#add-user-well").text("Done!"); }
		})
    });

    $("#writings").click(function(){
        $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/writings?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                  type: "GET",
                  contentType: "application/json",
		  success: function(data, textStatus, jqXHR) { $("#writings-well").text(jqXHR.responseText); }
		})
    });


    // Add a writing
    $("#add-writing").click(function(){	
        $.ajax( { url: "https://api.mongolab.com/api/1/databases/heroku_app15381569/collections/writings?apiKey=CPBZJI2Y7k0K8NAlVZwM9QqHctUJrWUv",
                  data: JSON.stringify( { 
		      "prompt":$("#prompt").val(),
		      "category":$("#category").val(),
		      "time-limit":$("#time-limit").val(),
		      "user":$("#user").val(),
		      "opponent":$("#opponent").val(),
		      "opponent-writing-id":$("#opponent-writing-id").val(),
		      "win":$("#win").val(),
		      "time-start":$("#time-start").val(),
		      "text":$("#text").val(),
		      "votes":$("#votes").val(),
		      "comment-ids":$("#comment-ids").val(),
		  } ),
                  type: "POST",
                  contentType: "application/json",
		  success: function(data, textStatus, jqXHR) { $("#add-writing-well").text("Done!"); }
		})
    });

});
