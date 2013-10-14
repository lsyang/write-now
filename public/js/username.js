$(document).ready(function() {
	//replace the user's name on the navigation of every page
	$.get("/get-current-user", function(string) {
		if(string=="Guest"){
			$("#user-nav").html('<a class="btn btn-primary" href="/login">Log In Or Register</a>');
		} else{
			$("#user-nav").html('<ul class="nav"><li class="dropdown"><a id="currentuser-nav" class="dropdown-toggle" data-toggle="dropdown" href="#"></a><ul class="dropdown-menu" role="menu" aria-labelledby="currentuser-nav"><li role="presentation"><a role="menuitem" href="/profile.html">Profile</a></li><li role="presentation"><a role="menuitem" href="/userpref">Preferences</a></li></ul></li></ul><a class="btn btn-primary" id="logout">Logout</a>');
	    	$("#currentuser-nav").text(string.charAt(0).toUpperCase() + string.slice(1));
	    	$("#currentuser-nav").append("<b class='caret'></b>");
	    	$('#logout').click(function(){ console.log('attemptedlogout'); attemptLogout(); });
		}
	});
});

// bind event listeners to button clicks //
	function attemptLogout()
	{
		$.ajax({
			url: "/userpref",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			console.log('You are now logged out.<br>Redirecting you back to the homepage.');
	 			window.location.href = '/';//redirected to front page
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}