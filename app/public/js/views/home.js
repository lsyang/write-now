
$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
			}
		}
	});

	$.get("/get-current-user", function(string) {
		if(string=="Guest"){
			$("#user-nav").html('<a class="btn btn-primary" href="/login">Log In Or Register</a>');
			$("#currentuser").text(string.charAt(0).toUpperCase() + string.slice(1));
		} else{
			$("#user-nav").html('<ul class="nav"><li class="dropdown"><a id="currentuser-nav" class="dropdown-toggle" data-toggle="dropdown" href="#"></a><ul class="dropdown-menu" role="menu" aria-labelledby="currentuser-nav"><li role="presentation"><a role="menuitem" href="/profile.html">Profile</a></li><li role="presentation"><a role="menuitem" href="/userpref">Preferences</a></li></ul></li></ul><a class="btn btn-primary" id="logout">Logout</a>');
			$("#currentuser").text(string.charAt(0).toUpperCase() + string.slice(1));
	    	$("#currentuser-nav").text(string.charAt(0).toUpperCase() + string.slice(1));
	    	$('#logout').click(function(){ console.log('attemptedlogout'); hc.attemptLogout(); });
		}
	});

	$('#name-tf').focus();

// customize the account settings form //
	
	$('#account-form h1').text('Account Settings');
	$('#account-form #sub1').text('Here are the current settings for your account.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

})