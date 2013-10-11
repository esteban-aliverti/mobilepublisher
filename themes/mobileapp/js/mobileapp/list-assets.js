$(".btn-action" ).click(function(e) {
var app = $(this).data("app");
var action = $(this).data("action");

//alert(app + action);


	jQuery.ajax({
		url : '/publisher/api/lifecycle/'+ action +'/mobileapp/' + app,
		type : "PUT",
		async : "false",		
		contentType : "application/json",
     	dataType : "json"			
	});
	
	$( document ).ajaxComplete(function() {
		 location.reload();
	});

 e.stopPropagation();
});