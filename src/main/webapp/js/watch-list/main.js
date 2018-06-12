// added for malicious code
var allowedCharCode = [119,101,114,116,121,117,105,111,112,113,108,107,106,104,103,102,100,115,97,122,120,99,118,98,110,109,81,87,69,82,84,89,85,73,79,80,76,75,74,72,71,70,68,83,65,90,88,67,86,66,78,77,49,50,51,52,53,54,55,56,57,48,8216,45,65,97,352,338,381,353,339,382,376,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,248,249,250,251,252,253,254,255,39,32];

var dradtshipWcm = {};


hidePageLoader();

function registerLoadMoreEvent(){
    $$dom.jQ13('#load-more-watchlist').hammer().on('tap',function(event){
        event.preventDefault();
        var $currObj = $$dom.jQ13(this);
        $$dom.jQ13('#watchlist-loader').addClass('active_loader');
        var param = $currObj.data('toload');
        loadMoreRecords(param);
    });
}


$$dom.jQ13(document).on('myWatchListReady',function(){
	registerEvents();
    registerLoadMoreEvent();
});

function registerEvents(){
	$$dom.jQ13('#watchListRecord tr.watch-data-row td').hammer().on('tap', function(event) {
		event.preventDefault();
        var $currObj = $$dom.jQ13(this);
        var $parent = $$dom.jQ13(this).closest('tr');
        if (!$parent.hasClass('deleted-shipment')){
        	$currObj.addClass('relativePos');
            var consignmentId = $$dom.jQ13(this).parent().data('refnum');
            $$global.loader.show($currObj);
            var url = portalURL + "/shipment-details?consignmentId=" + consignmentId;
            window.location = "/shipment-details?consignmentId=" + consignmentId;
        }
	});
	$$dom.jQ13('.smart-loader-btn').each(function(item){
        $$dom.jQ13(this).find('.ico-loading').remove();
        $$dom.jQ13(this).append(btnLoader);
        $$dom.jQ13(this).addClass('relativePos');
    });
	$$dom.jQ13('.smart-loader-btn').hammer().on('tap', function(event){
        $$dom.jQ13(this).addClass('active_loader');
    });
}

//for toggling between tabs data
$("#featuresTab a").click(function(e){
    e.preventDefault();
    $(this).tab('show');
    if(this.id == 'savedSearchTabAnchor') {
    	return;
    }else if(this.id == 'draftshipmentAnchor') {
    	return;
    }
    loadSelectedList(this.id, "1");
    
    
    

   /* var contentId = $(this).attr("href");
    searchInputValidation(contentId); */

    $(".chosen-search-input,.chosen-choices,#pickupSearchDataId").on('blur',function(){
	    searchInputValidation('#'+ $(this).closest('.tab-pane').attr('id'));
	});
    
    $(".chosen-search-input,.chosen-choices,#pickupSearchDataId").keyup(function(){
    	if($(this).val.length !=0){
    		searchInputValidation('#'+ $(this).closest('.tab-pane').attr('id'));
    	}
	});

	$(".search-choice-close").on('click',function(){
		searchInputValidation('#' + $(this).closest('.tab-pane').attr('id'));
	});
	
	$('.chosen-choices, #pickupSearchDataId, #pickupFromDate, #pickupToDate').keydown(function(event){
		if(event.keyCode == 13){
		    $('#searchPickupTable').click();
		}
		if($(this).is('#pickupSearchDataId') && event.keyCode === 8){
			//if($(this).val() === ''){
				$(this).parent().removeClass('error');
				$(this).next('span').remove();
			//}
			
		}
	});

	$('.chosen-choices, #manifestNameID, #manifestFromDate, #manifestToDate').keydown(function(event){
	if(event.keyCode == 13){
		$('#searchManifestTable').click();
	}
	});
	$(".manifestt-toggle").click(function(){$('#manifestTollCarrier_chosen .chosen-search-input').focus()});
      
	$('#searchManifestTable, #searchPickupTable').click(function(){
		               $('html, body').animate({
		               scrollTop: $(".get-scoll-here").offset().top
		           }, 2000);
	});
});

function searchInputValidation(Obj){
	var selector = $(Obj);
	var el = selector.find("#pickupSearchDataId");
	// added for malicious code
	if(el.val() && allowedCharCode.indexOf(el.val().charCodeAt(0)) === -1){
		el.parent().addClass('error');	
		if(el.next('span.error-msg').length === 0){
			el.after('<span class="error-msg">Please enter a valid pickup ID. </span>');
		}
		return false;
	}
	
	if(selector.find(".search-choice").length > 0 || selector.find("#pickupSearchDataId").val() != "" || selector.find(".fromDateValidation").val() != ""){
		selector.find(".searchFilter").removeAttr("disabled");
    }
    else{
        selector.find(".searchFilter").attr("disabled","disabled");
    }
};



//remove table td padding if it has button
$(".tab-content table td").has("button,a").css("padding","0");




//get the pickup id and create URL for the same
/*$(".pickup-data-row").click(function(){
    $(this).each(function(){
        var PickupDataId = $(this).attr('data-id');
        var PickupUrl = $(this).attr('url-id');
        var urlPath = PickupUrl +'#view/'+ PickupDataId;
        window.location.href = urlPath;
    });
});*/
function redirectToDetailsPage(dataId, urlId, actionType) {
    var urlPath = '/'
    if(actionType == 'bookPickup') {
    	urlPath = urlId +'#createfrommanifest/'+ dataId;	
    } else if(actionType == 'viewPickup') {
    	urlPath = urlId +'#view/'+ dataId;
    }else if(actionType == 'addShipment') {
    	urlPath = urlId +'#add-shipment-to-manifest/'+ dataId;
    }
    
    
    window.location.href = urlPath;
}
function redirectToManifestPage(pageUrl, manifestId, tollCarrierCode){
	var urlPath = pageUrl+'&p_p_manifest_id='+manifestId+'&p_p_carrier_id='+tollCarrierCode;
	window.location.href = urlPath;
}

function redirectToPage(urlPath){
	window.location.href = urlPath;
}

//getting object to search manifest table

function getSearchDataTabs(searchDivId){
	var searchObj = {};
	
	if(searchDivId== "searchManifestTable"){
		
		searchObj.manifestNameId = $("#manifestNameID").val();
	    searchObj.fromDate = $("#manifestFromDate").val();
	    searchObj.toDate = $("#manifestToDate").val();
	    var manifestTollCarrier = $("#manifestTollCarrier").val();
	    var manifestTollCarrierStr = "";
	    if (null!= manifestTollCarrier && manifestTollCarrier.length > 0){
	    	manifestTollCarrierStr = manifestTollCarrier.toString();
	    }
	    searchObj.manifestTollCarrier = manifestTollCarrierStr;
	    /* console.log(searchObj); */
	    loadSelectedList("manifestTabAnchor", "1", searchObj);
	    
	}else if(searchDivId == "searchPickupTable"){
		
		searchObj.pickupNameId = $("#pickupSearchDataId").val();
	    searchObj.fromDate = $("#pickupFromDate").val();
	    searchObj.toDate = $("#pickupToDate").val();
	    var pickupTollCarrier = $("#pickupTollCarrier").val();
	    var pickupTollCarrierStr = "";
	    if (null!= pickupTollCarrier && pickupTollCarrier.length > 0){
	    	pickupTollCarrierStr = pickupTollCarrier.toString();
	    }
	    searchObj.pickupTollCarrier = pickupTollCarrierStr;
	    /* console.log(searchObj); */
	    loadSelectedList("pickupTabAnchor", "1", searchObj);
	    
	}
};

function getFromAndToDate(fromDate, toDate, isFutureDateAllowed){
	
	if(isFutureDateAllowed){
	    $$dom.jQ13('#'+fromDate).datepicker({
	        minDate: "-1y",
	        maxDate: "+7d",
	        dateFormat: "dd-mm-yy",
	        onSelect: function (dateStr) {
	        	searchInputValidation('#' + $(this).closest('.tab-pane').attr('id'));
	            var newDate = $$dom.jQ13(this).datepicker('getDate');
	               if (newDate) {
	                       newDate.setDate(newDate.getDate());
	               }
	               $$dom.jQ13('#'+toDate).datepicker("option",'minDate', newDate);
	            }
	    });
	
	    $$dom.jQ13('#'+toDate).datepicker({
	      dateFormat: "dd-mm-yy",
	      maxDate: "+7d",
	        //minDate: $$dom.jQ13( "#fromDate" ).datepicker( "getDate" )
	        minDate: "-1y"
	    });
	}else{
		$$dom.jQ13('#'+fromDate).datepicker({
	        minDate: "-1y",
	        maxDate: 0,
	        dateFormat: "dd-mm-yy",
	        onSelect: function (dateStr) {
	        	searchInputValidation('#' + $(this).closest('.tab-pane').attr('id'));
	            var newDate = $$dom.jQ13(this).datepicker('getDate');
	               if (newDate) {
	                       newDate.setDate(newDate.getDate());
	               }
	               $$dom.jQ13('#'+toDate).datepicker("option",'minDate', newDate);
	            }
	    });
	
	    $$dom.jQ13('#'+toDate).datepicker({
	      dateFormat: "dd-mm-yy",
	        maxDate: 0,
	        //minDate: $$dom.jQ13( "#fromDate" ).datepicker( "getDate" )
	        minDate: "-1y"
	    });
	}
	
    $(".dateRangeDetails .ico-date-range").click(function(){
        $(this).prev('input').focus();
    });

    var currentDate = new Date();
    var toDt = currentDate.getDate();
    if(toDt < 10){
        toDt = '0'+ toDt;
    }
    var toMonth = currentDate.getMonth()+1;
    if(toMonth < 10){
        toMonth = '0'+ toMonth;
    }
    var toYear = currentDate.getFullYear();

    var currentFromToDate = toDt + "-" + toMonth + "-"+ toYear;
    $("#"+toDate).val(currentFromToDate);
};


// setting ellips on table data
/*function charDataEllips(){
    $("table tbody td").each(function(){
        var charLength = $(this).text();
        var ellips = "...";
        var maxChar = 15;
        var newStr = "";
        if(charLength.length > maxChar ){
            charLength = charLength.substring(0,maxChar);
            newStr = charLength + ellips;
            $(this).text(newStr);
        }
    });
};
charDataEllips();*/

//select multiple value from select option
$(".select-tollcarrier").chosen().change(function(){
	searchInputValidation('#' + $(this).closest('.tab-pane').attr('id'));
}); 




//Draft shipment code
$('#featuresTab a#draftshipmentAnchor').on('click',function(){
	populateHeaderDraftShipment();
	getDraftShipmentFunction();
});

function populateHeaderDraftShipment() {
	if(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.draftShipmentTitle) {
		dradtshipWcm = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.draftShipmentTitle;
	} else {
		dradtshipWcm = { 
			"draftShipment": {
		    "tabname":"my draft shipments",
		    "tableheading":{
		      "shipment_id":"Shipment ID",
		      "toll_carrier":"Toll carrier",
		      "sender":"Sender",
		      "receiver":"Receiver",
		      "dispatch_date":"Dispatch date",
		      "continue_shipment":"COMPLETE SHIPMENT"
		    },
		    "draftdelpopup":{
		      "popcontent":"Are you sure you want to delete it",
		      "btn-yes":"Yes",
		      "btn-no":"NO"
		    }
		    
		  }
	   }
	}
   var wcmdraftTemplateScript = $("#draftTableHead-template").html();
   var wcldraftListTemplate = Handlebars.compile(wcmdraftTemplateScript);
   var wcmdraftListHtml = wcldraftListTemplate(dradtshipWcm);
   $("#draftTableHead").html(wcmdraftListHtml);
   }
   

Handlebars.registerHelper("changeformatDate", function(d) {
  var date = new Date(d);

 if ( isNaN( date .getTime() ) ) 
 {
    return d;
 }
 else
{
  
  var month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sept";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";

  day = date.getDate();
  
  if(day < 10)
  {
     day = "0"+day;
  }
  
  return    day  + " " +month[date.getMonth()] + " " + date.getFullYear();
  }
  
});

Handlebars.registerHelper("draftshipTruncate", function(value) {
  value = value.toString();
  if(value && value.length > 20){
        value = value.substring(11, 21);
    	return value;
   }
});



var draftoffset = 0;
var draftlimit = 20;
function getDraftShipmentFunction()
  {
	//$('.draftshipCount').html('');
	getDraftAjaxhit(false);
    }
function draftViewmoreclick(){
	draftoffset+=draftlimit;
	getDraftAjaxhit(true);
	
	
}
function getDraftAjaxhit(isviewmore){
	
    var draftShipmentObject = {
               
                "carrier" : "All",
                "status" :  "D",
                "limit" : draftlimit,
                "offset":draftoffset,
                "sort" : "ASC"
    };
    try {
        
    
      $.ajax({
        url: getDraftShipmentURL,
        method: 'GET',
        dataType: 'HTML',
        data: {
          draftShipmentObject: JSON.stringify(draftShipmentObject)
        },
        beforeSend: function() {
      	showPageLoader();   
	        },
        success: function(res) {
          ress=JSON.parse(res);
          responseData = ress;

          	var numofreqview = draftoffset+draftlimit;
			var numOfadvSeclist;
			if(ress && ress.success && ress.data.count <= draftoffset+draftlimit) {
				numOfadvSeclist = ress.data.count;
			 }else{
				 numOfadvSeclist = numofreqview;
			 }

          if(ress && ress.success && ress.data.count) {
        	  $("#totaldraftshipment-count, #totaldraftshipment-countdown").text("1-"+ numOfadvSeclist +" of "+ ress.data.count +" draft shipments");  
          }
         
          if(ress && ress.success==false || draftlimit >= ress.data.count){
        		$('#draftHasMoreButton').hide();
            $('#draftHasMoreDiv').hide();
        		hidePageLoader();
        		}

          if (ress.success) {
          	$('#darftNoDataDiv').hide();
           	 $('#draftTableId').show();
           	 $('.draftshipcountDiv').show();
           	 
          	
          	hidePageLoader();

          	var wcmTemplateScript = $("#draftShipList-template").html();
       		var wclListTemplate = Handlebars.compile(wcmTemplateScript);
       		var xlength=ress.data.Shipments.length;
       		for(var x=0; x < xlength; x++){
       			ress.data.Shipments[x].buttonLabel=dradtshipWcm.draftShipment.tableheading.continue_shipment;
       		}
       		//console.log(ress.data);
       		var draftdata = {
       			"draftdata": ress.data.Shipments, 
       		}
       		var wcmListHtml = wclListTemplate(draftdata);
       		if(isviewmore){
            	$("#draftShipList").append(wcmListHtml);
            	
            }else{
            	$("#draftShipList").html(wcmListHtml);
            }
      
          }
          else{
             console.log("False");
             hidePageLoader();
              $('#draftTableId').hide();
              $('.draftshipcountDiv').hide();
              $('#draftHasMoreButton').hide();
              $('#draftHasMoreDiv').hide();
               $('#darftNoDataDiv').show();
               $("#totaldraftshipment-count, #totaldraftshipment-countdown").text('');
              
                if(ress.message.match(/10002/g)){
                  $('#darftNoDataDivcont').text("You don't have any draft shipments.");
                }else if(ress.message.match(/10009/g)){
                  $('#darftNoDataDivcont').text("You don't have any valid accounts.");
                }
          }
         
          
        },
        error: function(jqXHR, textStatus, errorThrown) {
          hidePageLoader();
         $('#draftTableId').hide();
      	$('.draftshipcountDiv').hide();
      	$('#draftHasMoreButton').hide();
      	$('#draftHasMoreDiv').hide();
      	 $('#darftNoDataDiv').show();	  
      	 $("#totaldraftshipment-count, #totaldraftshipment-countdown").text('');
          console.log(jqXHR, textStatus, errorThrown);
          //showAjaxAlert();
        },
	       complete: function() {

	        }
      });
    }
    catch(err) {
        console.log(err.message);
        $('#draftTableId').hide();
      	$('.draftshipcountDiv').hide();
      	$('#draftHasMoreButton').hide();
      	$('#draftHasMoreDiv').hide();
      	 $('#darftNoDataDiv').show();
      	 $("#totaldraftshipment-count, #totaldraftshipment-countdown").text('');
    }
}



//Delete call for shipment
function deleteShipmentById(shipmentID) {
	$$global.confirmBox({
        icon: 'ico-exception',
        title: 'Please Confirm',
        content: 'Are you sure you want to delete it?'
    }, function(result) {
    	if(result) {
    	showPageLoader();
    	var shipmentObject = {
			    "id": shipmentID
			  };
			  showPageLoader(); 
			  $.ajax({
			      url: deleteDraftShipmentURL,
			      method: "POST",
			      dataType : 'JSON',
			      async: false,
			      data: {
			        deleteShipment: JSON.stringify(shipmentObject)
			      },
			      success: function(data) {
			    	  getDraftShipmentFunction();
			    	  hidePageLoader();
			      },
			      fail: function(xhr) {
			    	  hidePageLoader();
			      }
			    });
    }
});
	
	
	/*
	
	$('.tollDeletePopup').fadeIn();
	$('.tollDeletePopup').on('click', '#yes-btn', function(){
		
		var shipmentObject = {
			    "id": shipmentID
			  };
			  showPageLoader(); 
			  $.ajax({
			      url: deleteDraftShipmentURL,
			      method: "POST",
			      dataType : 'JSON',
			      async: false,
			      data: {
			        deleteShipment: JSON.stringify(shipmentObject)
			      },
			      success: function(data) {
			    	  hidePageLoader();
			        console.log('Del sucess');
			        $('#draft'+shipmentID).remove();
			        $('.tollDeletePopup').fadeOut();
			      },
			      fail: function(xhr) {
			    	  hidePageLoader();
			        console.log('Del fail');
			      }
			    });
	});
	$('.tollDeletePopup').on('click', '.no-btn', function(){
		
		$('.tollDeletePopup').fadeOut();
	});
	$('.tollDeletePopup').on('click', '.tollDeletePopup-close', function(){
		
		$('.tollDeletePopup').fadeOut();
	});
	$(document).keyup(function(e) {
	     if (e.keyCode == 27) { 
	    	 $('.tollDeletePopup').fadeOut(); 
	    }
	});
	
	*/
	
	}
function redirectToshipmentPage(draftshipId){
	var urlPath = '/group/guest/shipment#edit/'+draftshipId;
	console.log(urlPath);
	window.location.href = urlPath;
}

// $('.draftshipDel').click(function(event){
// 	event.stopPropagation();
// });
  

