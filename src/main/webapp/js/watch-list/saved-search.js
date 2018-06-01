var savedSearchJs = (function() {
var limit = 20;
var startRecord = 0;
var searchCriteria = {};
var searchObj = {};
var searchName = "";
var isSessionOut = false;
var savedSearchLevels, errorMessages;
// function to populates levels from WCM data
function initialize() {
	if(!(dashboardWcm && dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard && dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.savedSearch)) {
		savedSearchLevels = {
				  toll_shipment_no: 'Toll shipment no',
				  reference_number: 'Reference',
				  milestone: 'Milestone',
				  sender_location: 'Sender location',
				  delivery_location: 'Delivery location',
				  estimated_delivery: 'Estimated delivery',
				  items: 'Items',
				  edit_search: 'Edit Search',
				  view_more: 'View More',
				  download: 'Download'
				};
		errorMessages = {
				"generic_error_title": "Error Occoured",
				"unknown_error": "Getting some server error, while fetching data. Please try again.",
				"no_saved_search": "You don't have any saved search.",
				"many_records_found": "Your search has too many results. Please change your search and try again.",
				"no_result_saved_search": "You don't have any saved search result for selected saved search."
			};
		
	} else {
		savedSearchLevels = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.savedSearch.tableheading;
		errorMessages = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ErrorMessages;
	}
	$("#getMoreSavedRecord").text(savedSearchLevels.view_more);
	$("#edit-search-text").text(savedSearchLevels.edit_search);
	$("#edit-search-text").text(savedSearchLevels.edit_search);
	var wcmTemplateScript = $("#saved-search-wcm-header-template").html();
	 var wclListTemplate = Handlebars.compile(wcmTemplateScript);
	 var wcmListHtml = wclListTemplate(savedSearchLevels);
	$("#savedSearchThId").html(wcmListHtml);
	}
	
	function getDataForSavedSearch(event, isViewMore, currentName) {
		event.preventDefault();
		if(!isViewMore) {
			startRecord = 0;
			$("#getMoreSavedRecord").css("display", "block");
		}
		 searchName = currentName;
		searchCriteria = searchObj.data.saveSearchJson[_.findIndex(searchObj.data.saveSearchJson, function(savedObj) {
			return savedObj.SearchName == searchName;
		})].SearchCriteria;
		if(startRecord) {
			searchCriteria.startRecord = startRecord;
		} else {
			delete searchCriteria.startRecord;
		}
		
		if(searchCriteria.advanceParams  && searchCriteria.advanceParams.date_period) {
			searchCriteria.advanceParams.fromDate = getFromAndToDate(searchCriteria.advanceParams.date_period).fromDate;
			searchCriteria.advanceParams.toDate	= getFromAndToDate(searchCriteria.advanceParams.date_period).toDate;
		}
		
		showPageLoader();
		var sessionout = setTimeout(function() { 
			isSessionOut = true;
			displayErrorMessage(errorMessages.timeout_error);
		}, 20000);
		$.ajax({
					type : 'POST',
					url : advancesearch,
					data : {
						getadvanceSearchParams : JSON.stringify(searchCriteria) 
					},
					cache : false,
					success : function(data) {
						if(!isSessionOut) {
							clearTimeout(sessionout);
							try {	
							var savedSearch = JSON.parse(data);
							if(savedSearch.data && savedSearch.data.success) {
								if(parseInt(savedSearch.data.noOfRows) <= (startRecord+limit)) {
									$("#getMoreSavedRecord").css("display", "none");
							 }
							if(parseInt(savedSearch.data.noOfRows)) {
								populateSavedDataList(savedSearch.data, isViewMore);
							} else {
								displayErrorMessage(errorMessages.no_result_saved_search);
							}
							} else {
								displayErrorMessage(JSON.parse(savedSearch.message.errorObject)[0].message);
							}
							
							hidePageLoader();
						} catch(exception) {
							hidePageLoader();
								displayErrorMessage(errorMessages.unknown_error);
						}
						} else {
							isSessionOut = false;
							hidePageLoader();
							displayErrorMessage(errorMessages.timeout_error);
						}
						
					},
					error : function(data) {
						displayErrorMessage(errorMessages.unknown_error);
						hidePageLoader();
					}
				});
	}
	
	function displayErrorMessage(msg) {
		$("#saved-data-section").css("display", "block");
		$('#search-result-data').css("display", "none");
		$('#no-saved-data-error-msg').css("display", "block");
		$('#saved-data-error').html(msg);
		isSessionOut = false;
	}
	
	function editSavedSearch() {
		//  $("#quicksearch").removeClass("active");
    	//  $("#advancesearch").addClass("active");
    	//  $(".track-advacnce-search").css("display", "block");
    	//  $("#track-shipment").css("display", "none");
    	//  $("#searchResults").css("display", "none");
		//  $("#advanceSearchResults").css("display", "block");
		cuurent_search_name = searchName;
		$('#advancesearchTabAnchor').click();
		initialise_value();
		   //get_page_data();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$('#reference-number').focus();

	}
	
	//Delete call for deletedSavedSearch
	function deletedSavedSearch(event, searchId) {
		event.preventDefault();
		var delSearchName = searchObj.data.saveSearchJson[_.findIndex(searchObj.data.saveSearchJson, function(savedObj) {
			return savedObj.SearchId == searchId;
		})].SearchName;
		$$global.confirmBox({
            icon: 'ico-exception',
            title: 'Please Confirm',
            content: 'Are you sure you want to delete "'+delSearchName+'" saved search?'
        }, function(result) {
        	if(result) {
        	showPageLoader();
			  $.ajax({
			      url: deleteSearchFilter,
			      method: "GET",
			      dataType : 'JSON',
			      async: false,
			      data: {
			    	  deleteSearchFilter: searchId
			      },
			      beforeSend: function() {
			        	showPageLoader();   
			  	  },
			      success: function(data) {
							getSavedSearches();
							var index = _.findIndex(current_search.saveSearchJson,function(s) {
								return s.SearchId == searchId ;	
							});
							
							if(current_search.saveSearchJson.length > 0){
								//delete current_search.saveSearchJson[index];
								
								if(cuurent_search_name == current_search.saveSearchJson[index].name ){
									cuurent_search_name="";
									disable_clear_button()
								}
								current_search.saveSearchJson.splice(index, 1);
							}
							else{
								current_search.saveSearchJson={};
								//console.log("reading this");
								cuurent_search_name="";
								disable_clear_button()
							}
							
							initialise_value();
							is_page_data_loaded = true;
							addsavesearchcount();
			      },
			      fail: function(xhr) {
			    	  hidePageLoader();
			      }
			    });
        }
	})
		}
	
	$("#featuresTab a#savedSearchTabAnchor").click(function(e) {
		   e.preventDefault();
		     getSavedSearches();
        	})
	
    function getSavedSearches() {
		initialize();
		startRecord = 0;
		showPageLoader();
		$.ajax({
					type : 'GET',
					url : getSaveSearchList,
					cache : false,
					success : function(data) {
						searchObj = JSON.parse(data);
						try {	
							if(searchObj.success) {
								if(searchObj.data.saveSearchJson.length) {
								$(".saved-search-counter").text("Showing "+ searchObj.data.saveSearchJson.length +" saved searches");	
								populateSavedSearchDropDown(searchObj.data.saveSearchJson);
								searchName = searchObj.data.saveSearchJson[0].SearchName;
								var event = document.createEvent("Event");
								getDataForSavedSearch(event, false, searchName);
							} else {
								$('#saved-data-section').css("display", "none");
								$('#no-saved-data-error-msg').css("display", "block");
								$('#saved-data-error').html(errorMessages.no_saved_search);
								hidePageLoader();
							}
							} else {
								$('#saved-data-section').css("display", "none");
								$('#no-saved-data-error-msg').css("display", "block");
								$('#saved-data-error').html(JSON.parse(searchObj.message.errorObject)[0].message);
								hidePageLoader();
							}
					} catch(exception) {
						hidePageLoader();
						$('#search-result-data').css("display", "none");
						$('#no-saved-data-error-msg').css("display", "block");
						$('#saved-data-error').html(errorMessages.unknown_error);
					}
					},
					error : function(data) {
						$('#search-result-data').css("display", "none");
						$('#saved-data-error').html(errorMessages.unknown_error);
						$('#no-saved-data-error-msg').css("display", "block");
						hidePageLoader();
					}
				});
	}
	
	function checkUndefinedAndNull(value) {
		if(value) {
			return value;
		} else {
			return "";
		}
	}
	
	function getMilestoneTextAndIcon(milestone) {
		if(!milestone) {
			return {text: '', icon: ''};
		}
		if(milestone == 'SHPCRE') {
			return {text: 'Shipment created', icon: 'ico-shipment-created'};
		} else if(milestone == 'PCKDUP') {
			return {text: 'Picked up', icon: 'ico-picked-up'};
		} else if(milestone == 'INTRNST') {
			return {text: 'In transit', icon: 'ico-in-transit'};
		} else if(milestone == 'OUTFDL') {
			return {text: 'Out for delivery', icon: 'ico-out-for-delivery'};
		} else if(milestone == 'DELVERD') {
			return {text: 'Delivered', icon: 'ico-delivered del-color'};
		} else if(milestone == 'PRTDEL') {
			return {text: 'Partially Delivered', icon: 'ico-partially-delivered'};
		} else if(milestone == 'AWTCOL') {
			return {text: 'Await Collect', icon: 'ico-awaiting-collection'};
		} else if(milestone == 'COLLCTD') {
			return {text: 'Collected', icon: 'ico-collected'};
		} else if(milestone == 'CANCLD') {
			return {text: 'Cancelled', icon: 'ico-cancelled'};
		} else {
			return {text: '', icon: ''};
		}
	}
	
	function viewMoreData() {
		startRecord+= limit;
		var event = document.createEvent("Event");
		getDataForSavedSearch(event, true, searchName);
	}
	
	function redirectToDetailSearchPage(consignmentId) {
		var baseRelativeUrl = '/web/guest/shipment-details';
		window.location.href = baseRelativeUrl+"?consignmentId="+consignmentId;
	}
	
	Handlebars.registerHelper('getMilestoneText', function(options) {
	    return getMilestoneTextAndIcon(options.fn(this)).text;
	  });
	
	Handlebars.registerHelper('getMilestoneIcon', function(options) {
	    return getMilestoneTextAndIcon(options.fn(this)).icon;
	  });
	
	function populateSavedDataList(savedSearch, isViewMore) {
		var savedDataTemplateScript = $("#saved-search-list-data-template").html();
		 var dataTemplate = Handlebars.compile(savedDataTemplateScript);
		if(savedSearch) {
			var numofreqview = startRecord+limit;
			var numOfadvSeclist;
				if(savedSearch.noOfRows <= startRecord+limit) {
					numOfadvSeclist = savedSearch.noOfRows
					//console.log(numOfadvSeclist);
				 }else{
					 numOfadvSeclist = numofreqview;
					 //console.log(numOfadvSeclist);
				 }
			$(".saved-search-token .total-counter, #savedSearchCountdown").text("1-"+ numOfadvSeclist +" of "+ savedSearch.noOfRows +" results found");
			 var mySavedData = dataTemplate(savedSearch);
		if(isViewMore) {
			$("#savedSearchTbodyId").append(mySavedData);
		} else {
			$("#savedSearchTbodyId").html(mySavedData);
		}
		$('#saved-data-section').css("display", "block");
		$('#search-result-data').css("display", "block");
		$('#no-saved-data').css("display", "none");
		$('#no-saved-data-error-msg').css("display", "none");
		hidePageLoader();
    	}
	}
	
	function populateSavedSearchDropDown(searches) {
		var savedListTemplateScript = $("#saved-search-list-template").html();
		 var savedListTemplate = Handlebars.compile(savedListTemplateScript);
		 var searchListHtml = savedListTemplate({searches: searches});
		 $('#saved-search-list').html(searchListHtml);
		 $('#saved-search-list li:eq(0)').addClass('active-search');
		 
		 $('#saved-search-list li a.current-saved-selection').click(function() {
			 $("#saved-search-list li").removeClass("active-search");
			 $(this).parent('.saved-search-li').addClass("active-search");
			 
		 })
	}
	
	function getFromAndToDate(date_period) {
		var rangeFrom = 0;	
		var rangeTo = 0;
		var data = date_period;		
		var params = data.split("@"); 
		var today  = new Date();
		var dateTo = new Date(new Date().setDate(today.getDate()+ rangeTo));
		var dateFrom = new Date(new Date().setDate(today.getDate()+ rangeFrom));
		rangeFrom = 1 - params[1];

		if(params[0]=="D"){
			if(params[1]==-1){	
				rangeFrom = -1;
				rangeTo= -1;
			}
			dateFrom = new Date(new Date().setDate(today.getDate()+ rangeFrom));	
			dateTo = new Date(new Date().setDate(today.getDate()+ rangeTo));	
		}
		if(params[0]=="W"){
			rangeFrom = 1 - (params[1]*7);
			//console.log("rngfrm "+rangeFrom);
			dateFrom = new Date(new Date().setDate(today.getDate()+ rangeFrom));
			//console.log("from date" + dateFrom);
		}
		if(params[0]=="M"){		
			rangeFrom =  - (params[1]);		
			dateFrom = new Date(new Date().setMonth(today.getMonth()+ rangeFrom));
		}
		if(params[0]=="Y"){
			rangeFrom =  - (params[1]);	
			dateFrom = new Date(new Date().setYear(today.getYear()+ rangeFrom));
		}
		ship_from_date = format_date(dateFrom);
		ship_to_date = format_date(dateTo);
		
		return {fromDate: ship_from_date, toDate: ship_to_date}
		
		}
	
	return {
		viewMoreData: viewMoreData,
		deletedSavedSearch: deletedSavedSearch,
		editSavedSearch: editSavedSearch,
		getDataForSavedSearch: getDataForSavedSearch,
		checkUndefinedAndNull: checkUndefinedAndNull,
		redirectToDetailSearchPage: redirectToDetailSearchPage,
		getSavedSearches: getSavedSearches
		}
}());