$(document).ready(function(){

	$('#txtAppUpload').fileuploadFile({
        dataType: 'json',
       	add: function (e, data) {
		           $('#btn-app-upload').click(function () {
		                    //data.context = $('<p/>').text('Uploading...').replaceAll($(this));
		                    data.submit();
		                });
		        },
		        done: function (e, data) {
		        	//appMetaData = data._response.result;
					$('#appmeta').val(JSON.stringify(data._response.result));
		        	//$('#txtWebapp').val(data._response.result[0]);
		            //alert();
		        }

	});

});