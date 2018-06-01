// added for malicious code
var allowedCharCode = [119,101,114,116,121,117,105,111,112,113,108,107,106,104,103,102,100,115,97,122,120,99,118,98,110,109,81,87,69,82,84,89,85,73,79,80,76,75,74,72,71,70,68,83,65,90,88,67,86,66,78,77,49,50,51,52,53,54,55,56,57,48,8216,45,65,97,352,338,381,353,339,382,376,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,248,249,250,251,252,253,254,255,39,32];

$(document).ready(function() {	
	hidePageLoader();
	/*
	Get array of data and remove garbage values
	*/
	var maxSrchTrm = themeDisplay.isSignedIn() ? 100 : 30;
	//$('.quick-error-msg').text('You can search for up to '+maxSrchTrm+' shipments at a time by putting a comma after each shipment or reference number');

	if (themeDisplay.isSignedIn()) {
		$('head title').text("Dashboard - MyToll");
		applyGA();
	}
	if($$global.checkIfTouchDevice && !$$global.checkIfTouchDevice()){
		$('#quickSearch').parent().addClass('focused ok-green');
		$('#quickSearch').focus();
	}

	$('#quickSearch').on('focus',function(event){
		var $currObj = $(this);
		$currObj.parent().addClass('focused ok-green');
	 }).on('blur',function(event){
		var $currObj = $(this),
			currVal = $currObj.val();
		if(currVal.length > 0){
			var isValid = txtValidation(currVal);
			if(!isValid){
				$currObj.closest('.form-group').removeClass('ok-green').addClass('error');
			}else{
				$currObj.closest('.form-group').removeClass('focused ok-green error');
			}
		}else{
			$currObj.closest('.form-group').removeClass('focused ok-green error');
		}
	});

	
	/* 
	Bind the Quick Search Input for collecting 
	Different Search params seperated by , ; and enter press and pase-event
	 */
	$('#quickSearch').on('paste',function(event){
		var $currObj = $(this);
		setTimeout(function(){
			var	$parentParam = $currObj.data('parentmod'),
				inputVal = $currObj.val();
				var isValid = txtValidation(inputVal);
		},10);
	});

	$('#quickSearch').on('keypress input propertychange',function(event){
		var $currObj = $(this),
			$parentParam = $currObj.data('parentmod'),
			inputVal = $currObj.val(),
			code = event.keyCode || event.which;
		var	isValid = txtValidation(inputVal);
			if(code === 13 ||code === 188 ||code === 44) {
		 	    if(!isValid){
		 	    	disableSrchBtn();
		 	    	showSrchError();
					return false;
				}else{
			 	    if(code === 13 && event.shiftKey === false){
			 	    	$('#search-shipment-btn').click();
			 	    }
				}
		   }
	});
});


var maxSrchTrm = 30;
var lastSrchLength = 0;
function txtValidation(str){
	if(str === '' || str === ' '){
		disableSrchBtn();
		hideSrchError();
		return false;
	}else{
		while(str.charAt(0) === ','){
		    str = str.substr(1);
		}

		maxSrchTrm = themeDisplay.isSignedIn() ? 100 : 30;
		/*var enteredVal = str.replace(/\s\s+/g, ' ');*/
		var enteredVal = str.replace(/(?:\r\n|\r|\n)/g, ',');
			enteredVal = enteredVal.replace(/,\s*$/, "");
			enteredVal = enteredVal.replace(/,,/g, ',');

		if(enteredVal.length < 1){
			$('#quickSearch').closest('.form-group').removeClass('focused ok-green error');
			return false;
		}

		/*
			maximum allowed search term, 100 for logged in user and 30 for un-auth
		*/
		var terms = enteredVal.split(',');
		var termsValid = chkSerchTermValidation(terms);
		// console.log('from check txtValid: '+termsValid);

		if(terms.length > maxSrchTrm){
			$('#quickSearch').closest('.form-group').removeClass('ok-green').addClass('error');
			$('.quick-error-msg').text('You can only search '+maxSrchTrm+' terms at a time');
			$('.quick-error-msg').addClass('error-msg');
			disableSrchBtn();
			return false;
		}
		else{
			$('#quickSearch').closest('.form-group').removeClass('error');
			$('.quick-error-msg').removeClass('error-msg');
			$('.quick-error-msg').text('search up to '+maxSrchTrm+' shipments at a time by putting a comma after each shipment or reference number');
			if(!termsValid){
				disableSrchBtn();
				if(terms.length <= lastSrchLength){
					showSrchError();
					lastSrchLength = terms.length;
				}
				return false;
			}else{
				$('#shipment-srch-trm').val(enteredVal);
				enableSrchBtn();
				hideSrchError();
				lastSrchLength = terms.length;
				return true;
			}
		}
	}
}

function enableSrchBtn(){
	$("#search-shipment-btn").removeClass('toll-login-bg').addClass('toll-green-bg');
	$("#search-shipment-btn").prop('disabled', false);
}
function disableSrchBtn(){
	$("#search-shipment-btn").addClass('toll-login-bg').removeClass('toll-green-bg');
	$("#search-shipment-btn").prop('disabled', true);
}
function showSrchError(){
	$('#quickSearch').closest('.form-group').removeClass('ok-green').addClass('error');	
	$('.quick-error-msg').text(Liferay.Language.get('plz-enter-a-text-that-is-between-3-and-50-characters'));
	$('.quick-error-msg').addClass('error-msg');
}
function hideSrchError(){
	$('#quickSearch').closest('.form-group').removeClass('error').addClass('ok-green');
	$('.quick-error-msg').text('Search up to '+maxSrchTrm+' shipments at a time by putting a comma after each shipment or reference number');
	$('.quick-error-msg').removeClass('error-msg');
}

function chkSerchTermValidation(terms){
	for(var i = 0; i < terms.length; i++){
		if(terms[i].length > 0){
			if(terms[i].length < 3 || terms[i].length > 50){
				return false;
			}
			if(i === (terms.length - 1)){
				return true;
			}
		}
	}
}

function fireQuickSearch(quickSearchUrl,newCall,cmd) {
	if(newCall == 'newCall'){
		var inputVal = $('#quickSearch').val();
		var externalSearchQuery = $('#externalSearchQuery').val();
		if(cmd=="web-api" && externalSearchQuery!=null && externalSearchQuery!=""){
			var terms = externalSearchQuery.split(',');
			var termsValid = chkSerchTermValidation(terms);
			var isValid = txtValidation(externalSearchQuery);
			if(!termsValid){
				disableSrchBtn();
				showSrchError();
				return false;
			}else if(!isValid){
				//$currObj.closest('.form-group').removeClass('ok-green').addClass('error');
				return false;
			}else{
				inputVal = externalSearchQuery;
			}
		}
		// added for malicious code
		if(allowedCharCode.indexOf(inputVal.charCodeAt(0)) === -1){
			$('#quickSearch').closest('.form-group').removeClass('ok-green').addClass('error');	
			$('.quick-error-msg').addClass('error-msg').text(Liferay.Language.get('plz-enter-valid-shipment-terms'));
			return false;
		}

		if ($$global.checkForMalicious(inputVal)){
			if(txtValidation(inputVal)){
				$('#search-shipment-btn').addClass('active_loader');
				setTimeout(function(){
					startSrchCall(quickSearchUrl,true);
					$('#quickSearch').text('');
					$('#quickSearch').val('');
					$('#externalSearchQuery').text('');
					$('#externalSearchQuery').val('');
					hideSrchError();
					disableSrchBtn();
					$('#quickSearch').css('height','55px');
				},100);
				$('head title').text("Track your Shipment - MyToll");
				applyGA();
			}else{
				disableSrchBtn();
				$('#quickSearch').closest('.form-group').removeClass('ok-green').addClass('error');
				$('.quick-error-msg').addClass('error-msg').text(Liferay.Language.get('plz-enter-shipment-terms'));
			}
		}else{
			$('#quickSearch').closest('.form-group').removeClass('ok-green').addClass('error');
			$('.quick-error-msg').addClass('error-msg').text(Liferay.Language.get('plz-enter-valid-shipment-terms'));
		}
	}else{
		startSrchCall(quickSearchUrl,false);
		$('#quickSearch').text('');
		$('#quickSearch').val('');
		$('#quickSearch').css({'height':'55px','overflow-y':'hidden'});
	}
}

function startSrchCall(quickSearchUrl,scroll){
	$.ajax({
		type: "GET",
		url: quickSearchUrl,
		data: $('#quickSearchForm').serialize(),
		cache: false,
		success: function( data ){
			$('#searchResults').empty().html(data);
			if(scroll){
				$$global.scrollToDiv('searchResults');
			}
			setTimeout(function(){
				registerTblEvent();
				$('#quickSearch').css({'height':'55px','overflow-y':'hidden'});
				$('#shipment-srch-trm').val('');

			},1000);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// $('.progress-bar-image').addClass('hidden-def');
			if(jqXHR.status === 500){
                $$global.showInPopup({
                    content: $$global.exceptionContentService(jqXHR.responseText)
                });
			}
		}
	});
}

function registerTblEvent(){
	$('#searchResults tr.data-row td').on('click', function(event) {
		event.preventDefault();
	    if (!$(this).hasClass('bared-cell')) {
	    	$(this).addClass('relativePos');
	        $$global.loader.show($(this));
	        var consignmentId = $(this).parent().data('refnum');
	        window.location = "/web/guest/shipment-details?consignmentId=" + consignmentId;
	    }
	});

	$('#searchResults tr.showresult td').on('click', function(event) {
		event.preventDefault();
		if($(this).find("span").hasClass("ico-accordian-down")==true){
			$(this).html("<span class='ico-accordian-up'></span>Hide results");
		}else{
			$(this).html("<span class='ico-accordian-down'></span>Show results");
		}
	     var term = $(this).parent().data('refterm');
	     $('.IsCollapse').each(function() {
	    	if($(this).hasClass(term)==true){
	    		if($(this).hasClass("hidden-def")==true){
	    			$(this).removeClass("hidden-def");
	    		}else{
	    		  $(this).addClass("hidden-def");
	    		}
	    	 }
	     });  
	});

	$('#searchResults a.lnkclearresult').on('click', function(event) {
		event.preventDefault();
		$('#searchResults').empty();
		return false;
	});
}