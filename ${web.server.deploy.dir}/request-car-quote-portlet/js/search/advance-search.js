var sender = {};
var receiver = {};
var search_res = {}	// Not used, need to remove
var current_location_type="";
var editor_status = "";
var account_list =  {};
var current_search = {};
var search_criteria = {};	
var is_page_data_loaded = false;
var startRecord = 0;
var limit = 20;
var cuurent_search_name="";
var current_period="D@1";
var default_period="W@1";
var min_date = "-3m";
var ship_from_date;
var ship_to_date;
var settings = {};
var isSessionOut = false;
var errors = {};
var milestone_map={'SHPCRE':'Shipment created','PCKDUP':'Picked up',
'INTRNST':'In transit','OUTFDL':'Out for delivery',
'AWTCOL':'Awaiting collection','PRTDEL':'Partially delivered',
'DELVERD':'Delivered','COLLCTD':'Collected','CANCLD':'Cancelled'};

// function to initialze value
function initialise_value(){	
	showPageLoader();			
	if( current_search.saveSearchJson != undefined && current_search.saveSearchJson.length > 0){
		$('#savedsrchTopNoDatacont').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.nosavedsrchtopfound);
		$('#saved-search-row .select-label-grp').show();
		$('#get-advance-search').show();
		$('#savedsrchTopNoDataDiv').hide();
	} 	
	else{
		$('#saved-search-row .select-label-grp').hide();
		if($(window).width() < 767){
			$('#get-advance-search').hide();
			$('#savedsrchTopNoDataDiv').show();
		}
	}	
	settings = current_search.AdvanceSettings;
	set_date_service();	
	
	date_option_ele = $("#period-selector").find("li[data-id='"+ default_period +"']");
	date_option_ele.click();
	add_option_in_select("ms-carrier", current_search.carrierSettingJSON.carrierCodeNameJSON);	
	add_option_in_select("ms-service", current_search.carrierSettingJSON.carrierServiceJSON,current_search.carrierSettingJSON.carrierCodeNameJSON);	
	add_option_in_select("ms-milestone",  current_search.milestone);		

	var searches = {};	
	$('#saved-search ul option').remove();
	$('#advSecSavedSecDropdown li').remove();
	if( current_search.saveSearchJson != undefined && current_search.saveSearchJson.length > 0){	
		searches = current_search.saveSearchJson.sort(function (a, b) {
			return a.SearchName.toLowerCase().localeCompare(b.SearchName.toLowerCase());
		}); 
		for (var index = 0; index < searches.length; index++) {
			$('#saved-search .dropdown-list-ul').append('<li data-id='+ searches[index].SearchId +' >' +searches[index].SearchName +' <span class="delete-search" onclick="deleteSavedSearch(event,'+searches[index].SearchId+',\''+searches[index].SearchName.trim() +'\')" > &times; </span> </li>');					
		}
		
		if(cuurent_search_name != "" || cuurent_search_name != null ){
			saved_search_changed_by_name(cuurent_search_name);		
		}
		else{
			saved_search_changed(0,-1); 
			disable_clear_button()
		}		
	}
	else{
		$('#saved-search-value').val(null)
		$('#current-saved-search').val(null);
		populate_advance_search({});
		disable_clear_button()
	}	

	if(window.location.href.indexOf("#?t=as") !== -1){
		showPageLoader();
		history.pushState("", document.title, window.location.pathname);			
		search_criteria = JSON.parse(sessionStorage.getItem("bo"));
		
		//set startcount
		startRecord = search_res.startRecord;
		//set result string 
		
		// make empty
		sessionStorage.removeItem ("bo");
		sessionStorage.removeItem("results");
		// set search name
		if(search_criteria.advanceParams.saved_search !=""){
			$('#current-saved-search').val(search_criteria.advanceParams.saved_search );
			$('#saved-search-value').val(search_criteria.advanceParams.saved_search );			
			cuurent_search_name = search_criteria.advanceParams.saved_search ;
		}
		populate_advance_search(search_criteria.advanceParams);
		result_success(search_res.data);	
		$(".advscrhTotalCounter").text(search_res.rec_string);	
		$("#getMoreAvdSearch").css("display", search_res.isViewMore);
		/// adding code to avoid error because of wcm error
		$('#adl_advseavedsrchBtn').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading.saveSearch);

		$('#getMoreAvdSearch').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading.view_more);
		$('#advSchHasEditButton').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading.edit_search);
	
		
	}
	else{
		// make empty
		sessionStorage.removeItem ("bo");
		sessionStorage.removeItem("results");
	}
	hidePageLoader();
}

$('.custom-dropdown').customDropdown({
		filter: true
});


// --- End initialization

// --- Shipment Date Section ---

$('.thin-tab .tab').click(function(){

	$('.date-box').removeClass('error');		
	$('.date-box').siblings('.error-msg').hide();
	$(this).addClass('active').siblings().removeClass('active');
	//showdate
	var text = $('.thin-tab .active label').text();
	if(text=='Date period'){
		$('.thin-tab .search-input-date-period').show();
		$('.thin-tab .search-input-date-range').hide();		
	}
	else{
		$('.thin-tab .search-input-date-period').hide();
		$('.thin-tab .search-input-date-range').show();
		enable_clear_button();
	}	
});

$('#advsrchFromDate').change(function (){
	$('.date-box').removeClass('error');		
	$('.date-box').siblings('.error-msg').hide();	
}); 

$('.thin-tab .tab:nth-child(1)').click(function(){
	$('.date-box').removeClass('error');		
	$('.date-box').siblings('.error-msg').hide();
});
$('.thin-tab .tab:nth-child(4)').click(function(){
	$('.date-box').removeClass('error');		
	$('.date-box').siblings('.error-msg').hide();
});


$('#period-selector').on('click','.dropdown-list-ul li',function(){
	var rangeFrom = 0;	
	var rangeTo = 0;

	var data = $(this).attr('data-id');
	current_period = data;		
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
		dateFrom = new Date(new Date().setDate(today.getDate()+ rangeFrom));
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

});

function format_date(date){
	var currentDate = date;
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
	return currentFromToDate;
}

function set_date_service(){	
	$('#period-selector .dropdown-list-ul li').remove();	
	create_date_option("day",get_array_for_date_option(settings.allowedDaysList));
	create_date_option("week",get_array_for_date_option(settings.allowedWeeksList));
	create_date_option("month",get_array_for_date_option(settings.allowedMonthsList));
	create_date_option("year",get_array_for_date_option(settings.allowedYearsList));

	min_date = 0;
	if(settings.allowedYearRange.trim() != "0" && settings.allowedYearRange.trim()!=""){
		min_date = 12*(parseInt(settings.allowedYearRange.trim()));
	}
	if(settings.allowedMonthRange.trim() != "0" && settings.allowedMonthRange.trim()!=""){
		min_date = min_date + parseInt(settings.allowedMonthRange.trim());
	}
	
	min_date = "-"+min_date + "m"
	date_settings("advsrchFromDate", "advsrchToDate", false);
}
function get_array_for_date_option(period){
	var period_list  = period.split(",");
	var time_list=[]
	for (var index = 0; index < period_list.length; index++) {		
		time_list.push(parseInt(period_list[index]))		
	}
	return time_list;
}
function create_date_option(type,array){
	var date_options = [];
	var option_text ="";
	var option_value = "";
	for (var index = 0; index < array.length; index++) {
		var array_value = parseInt(array[index]);
		if(type=="day"){
			if(array_value == -1){
				option_text = "Yesterday";
			}
			if(array_value==1){
				option_text = "Today";
			}
			if(array_value>1){
				option_text = "Last "+ array_value + " days";
			}
			option_value = "D@"+array_value;
		}
		else{
			if(array_value==1){
				option_text = "Last "+ type;
			}
			if(array_value > 1){
				option_text = "Last "+ array_value + " "+ type +"s";
			}
			if(type=="month"){option_value="M@"+array_value;}
			if(type=="week"){option_value="W@"+array_value;}
			if(type=="year"){option_value="Y@"+array_value;}
		}
		if(array_value > 0 || array_value < 0 ){
			$('#period-selector .dropdown-list-ul').append('<li data-id="'+ option_value +'">'+ option_text +'</li>');
		}
	}
}

function date_settings(fromDate, toDate, isFutureDateAllowed){
		
	console.log(min_date);
	if(isFutureDateAllowed){
		$$dom.jQ13('#'+fromDate).datepicker({
			minDate: min_date,
			maxDate: "+7d",
			dateFormat: "dd-mm-yy",
			onSelect: function (dateStr) {				
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
		  minDate: $$dom.jQ13( "#fromDate" ).datepicker( "getDate" )
		});
	}else{
		$$dom.jQ13('#'+fromDate).datepicker({
			minDate: min_date,
			maxDate: 0,
			dateFormat: "dd-mm-yy",
			onSelect: function (dateStr) {
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
			minDate: $$dom.jQ13("#"+fromDate).datepicker("getDate"),
			  onSelect: function (dateStr) {
				  var date_arr = dateStr.split("-");	
				  var newDate = date_arr[0]+"-"+date_arr[1]+"-"+(date_arr[2]-1);
				  
				  $$dom.jQ13('#'+fromDate).datepicker("option",'minDate', newDate);
				  $$dom.jQ13('#'+fromDate).datepicker("option",'defaultDate', dateStr);
				  
			}
		  //	minDate: "-1y"
		  });
	}
	
	$(".track-advacnce-search .dateRangeDetails").click(function(){
		//$(this).next('input').click();
		$(this).find('input').focus()
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

// --- End Date Section ---

// --- Saved Search Dropdown Section  --- 
// on change of saved serch option
$('#current-saved-search').change(function () {
	var li_text_array = $('#current-saved-search').val().split(",");
	var is_contain_close_sign =  ( li_text_array[li_text_array.length-1].trim() == "×" )?true:false;
	if(is_contain_close_sign){
		$('#current-saved-search').val($('#current-saved-search').val().split(",")[0]);	
		$('#saved-search-value').val($('#current-saved-search').val().split(",")[0]);
	}
});

$(".current-selected").focus(function(e){
	var id = $(this).parent().parent().attr("id"); 
	$("#" +id + " li").removeClass("traversing");
	$("#"+id+" li").siblings().first().addClass("traversing");
});

$('.custom-dropdown').on("mouseenter","li",function(e){
	$(this).parent().children().removeClass("traversing");	
	$(this).addClass("traversing");
});

$('.custom-dropdown').on("keydown",function(e) {
	var id = $(this).attr('id')
	var visible_list =  $("#"+id+" li:visible");
	var selected = $("#"+id+" .traversing:visible").last();
	var entered = $("#"+id+" .traversing").last();

	if(selected.length ==0){
		selected = $("#"+id+" li:visible").last();
	}

	if(visible_list.length > 0){

		$("#" +id + " li").removeClass("traversing");
		if (e.keyCode == 38) { // up		
		
			// if there is no element before the selected one, we select the last one	
			if(visible_list.index(selected) == 0 ){
				$(visible_list[(visible_list.length -1)]).addClass("traversing");
			}
			else{
				$(visible_list[visible_list.index(selected)-1]).addClass("traversing");
			}
		
		}
		if (e.keyCode == 40) { // down	
			
			if(visible_list.index(selected) == (visible_list.length -1) ){
				$(visible_list[0]).addClass("traversing");
			}
			else{ 
				if(selected.length > 0){
					$(visible_list[visible_list.index(selected)+1]).addClass("traversing");
				}
				else{
					$(visible_list[0]).addClass("traversing");
				}				
			}					
		}
	}
	if(visible_list.length == 0){
		if (e.keyCode == 13){
			if(entered.length > 0){
				entered.click();
			}
			else{
				$('#current-'+ id).val("");
			}
			return;
		}
	}

	if((e.keyCode == 38) || (e.keyCode == 40)){

		$('#' + id + ' ul').scrollTop(0);

		var offset = $('#'+ id +' .traversing').offset().top - $('#'+ id +' li').first().offset().top - $('#'+ id +" ul").height() + $('#'+ id +" ul li").outerHeight();
		if(offset > 0){
			$('#'+id+" ul").scrollTop(offset);
		}
	}
	if (e.keyCode == 13){	
		selected.click();
	}
	if (e.keyCode == 9){
		$("#"+id+" li").siblings().first().addClass("traversing");
	}

});

function saved_search_changed_by_name(name){
	var index = _.findIndex(current_search.saveSearchJson,function(s) {
		return s.SearchName == name ;	
	});
	if(index > -1){
		saved_search_changed(current_search.saveSearchJson[index].SearchId,index);
	}
	else{
		saved_search_changed(0,index);
	}
	
}


function saved_search_changed(serarchid,index){
	$('#saved-search').val($('#current-saved-search').val().split(",")[0]);
	
	if(index === undefined){		
	
		index =_.findIndex(current_search.saveSearchJson,function(s) {
			return s.SearchId == serarchid ;	
		});
	}			

	if(index > -1){
		$('#saved-search-value').val(current_search.saveSearchJson[index].SearchName)
		$('#current-saved-search').val(current_search.saveSearchJson[index].SearchName);
		populate_advance_search(current_search.saveSearchJson[index].SearchCriteria.advanceParams);
	}
	else{
		$('#saved-search-value').val(null)
		$('#current-saved-search').val(null);
		populate_advance_search({});
	}
}


function populate_advance_search(current_search_params)
{	
	$('#reference-number-list').empty();
	$('#sender-name-list').empty();
	$('#receiver-name-list').empty();

	if( current_search_params.hasOwnProperty('reference') && current_search_params.reference.length > 0){
		add_chips_into_list('reference-number-list',current_search_params.reference);	
	}			
	if(current_search_params.hasOwnProperty('senderName') && current_search_params.senderName.length > 0){
		add_chips_into_list('sender-name-list',current_search_params.senderName);
	}
	if(current_search_params.hasOwnProperty('receiverName') && current_search_params.receiverName.length > 0){			
		add_chips_into_list('receiver-name-list',current_search_params.receiverName);
	}

	sender = current_search_params.senderLocation;
	receiver = current_search_params.receiverLocation;	

	populate_to_location_for_adv_search(sender,"sender");
	populate_to_location_for_adv_search(receiver,"receiver");	
	if(current_search_params.hasOwnProperty('fromDate')){     
		if(current_search_params.hasOwnProperty('date_period')){            
			$('.thin-tab .tab:nth-child(1)').click();                   
			var period_li = $("#period-selector li[data-id='"+ current_search_params.date_period + "']"); 
			period_li.click();
		}
		else{   
			$('.thin-tab .tab:nth-child(2)').click();
			$("#advsrchToDate").val(current_search_params.toDate);
			$("#advsrchFromDate").val(current_search_params.fromDate);
		}
	}
	else{ 
		$('.thin-tab .tab:nth-child(1)').click();
	}		

	$('#advance-search input[type="checkbox"]').prop('checked', false);

	if( current_search_params.hasOwnProperty('senderNameInclude')){
		update_toggle("#include-exclude-sender", current_search_params.senderNameInclude ? false : true);
	}	
	if( current_search_params.hasOwnProperty('receiverNameInclude')){
		update_toggle("#include-exclude-receiver", current_search_params.receiverNameInclude ? false : true);
	}
	if( current_search_params.hasOwnProperty('senderLocationInclude')){
		update_toggle("#include-exclude-senderLocation", current_search_params.senderLocationInclude ? false : true);
	}
	if( current_search_params.hasOwnProperty('receiverLocationInclude')){
		update_toggle("#include-exclude-receiverLocation", current_search_params.receiverLocationInclude ? false : true);
	}
	if( current_search_params.hasOwnProperty('serviceTypeInclude')){
		update_toggle("#include-exclude-server-type", current_search_params.serviceTypeInclude ? false : true);
	}
	if( current_search_params.hasOwnProperty('tollCarrierInclude')){
		update_toggle("#include-exclude-toll-carrier", current_search_params.tollCarrierInclude ? false : true);
	}
	if( current_search_params.hasOwnProperty('milestoneInclude')){
		update_toggle("#include-exclude-milestone", current_search_params.milestoneInclude ? false : true);
	}
	
	
	// multi select
	$('#carrier-list').empty();
	$('#service-list').empty();
	$('#milestone-list').empty();

	add_option_in_select("ms-carrier", current_search.carrierSettingJSON.carrierCodeNameJSON);	
	add_option_in_select("ms-service", current_search.carrierSettingJSON.carrierServiceJSON,current_search.carrierSettingJSON.carrierCodeNameJSON);	
	add_option_in_select("ms-milestone",  current_search.milestone);
	
	if( current_search_params.hasOwnProperty('tollCarrier')){
		update_select_list("carrier", current_search_params.tollCarrier);
		add_option_in_select("ms-service", current_search.carrierSettingJSON.carrierServiceJSON,current_search.carrierSettingJSON.carrierCodeNameJSON);
	}
	if( current_search_params.hasOwnProperty('serviceType')){
		update_select_list("service", current_search_params.serviceType);
	}
	if( current_search_params.hasOwnProperty('milestone')){
		update_select_list("milestone", current_search_params.milestone);
	}
}

function update_toggle(id,value){
	if($(id).is(":checked") != value){
		$(id).next('.checkmark').click();
	}		
}

$('#advSecSavedSecDropdown').on("click","li",function(){
	saved_search_changed($(this).attr('data-id'))
});

// --- Saved Search Dropdown Section ---

// --- Free text List Control Section---


// For adding chips to list

$("#advance-search .input-label-grp input").on("keydown",function(e) {
	if(e.keyCode == 13) {
		var text = $(this).val().trim();
		if(appened_text_to_unordered_list($(this).parent().find('ul'),text))
		{				
			$(this).val("");
		}		
	}
});	

$("#advance-search").on("click",".add-data",function(e) {      
                
	var text = $(this).parent().find("input").val();
	if(appened_text_to_unordered_list($(this).parent().find('ul'),text))
	{				
		$(this).parent().find("input").val("")
	}

	get_location_for_adv_search();
});

// check if required
$(".delete-saved-search").click(function() {
	$(".token-items").remove();
});

    // To remove chip for advance search
    $("#advance-search").on("click",".delete-chip",function(e) {
		e.stopPropagation();
		var list_type=$(this).parent().parent().attr('id');
		var chip_value =  $(this).parent().find('.chip-value').text();
        $(this).parent().remove();  
		
	
		if(list_type=="sender-loc-list"){
			//get_location_for_adv_search();
			remove_chip_from_json(sender,chip_value);
			if(current_location_type=="sender"){
				populate_to_location_for_adv_search(sender,"sender");
			}
		}
		if(list_type=="receiver-loc-list"){

			remove_chip_from_json(receiver,chip_value);
			if(current_location_type=="receiver"){
				populate_to_location_for_adv_search(receiver,"receiver");
			}
		}
		if(list_type=="state-list" ||list_type=="suburb-list" || list_type=="postCode-list" ||list_type=="country-list"){
			if(current_location_type=="sender"){
				get_location_for_adv_search();
				populate_to_location_for_adv_search(sender,"sender");
			}
			if(current_location_type=="receiver"){
				get_location_for_adv_search();
				populate_to_location_for_adv_search(receiver,"receiver");
			}
		}
		if(list_type=="milestone-list"){
			add_option_in_select("ms-milestone",  current_search.milestone);
		}
		if(list_type=="service-list"){
			add_option_in_select("ms-service", current_search.carrierSettingJSON.carrierServiceJSON,current_search.carrierSettingJSON.carrierCodeNameJSON);
		}
		if(list_type=="carrier-list"){
			add_option_in_select("ms-carrier", current_search.carrierSettingJSON.carrierCodeNameJSON);	
			add_option_in_select("ms-service", current_search.carrierSettingJSON.carrierServiceJSON,current_search.carrierSettingJSON.carrierCodeNameJSON);
			$('#service-list li :contains('+chip_value.trim() +'_)').parent().remove();
		}        
	});

	
    function get_chip_list(list_type){
        var chip_list = [];
        $('#'+list_type+' li').each(function(){// id of ul
            var li = $(this).find('span.chip-value');//get each li in ul            
            chip_list.push(li.text().trim());///get text of each li and push into array       
        })      
        return chip_list;
	}
	

    function add_chips_into_list(id_name,chip_list){       
		$('#'+id_name)
		for (var i = 0; i < chip_list.length; ++i) {
			var chip = '<li> <span class="delete-chip"> &times; </span> <span class="chip-value">' + chip_list[i] +'</span> </li> ';
			$('#'+id_name).append(chip);	
		}		
	} 


	
	function appened_text_to_unordered_list(unordered_list,text){
		//var max_count = 20; // maximum number of tags
		var id = unordered_list.attr('id');
		if(id=="carrier-list" ||id=="service-list" || id=="milestone-list" ){
			var chips = '<li> <span class="delete-chip"> &times; </span> <span class="chip-value">' + text +'</span> </li> ';
			unordered_list.prepend(chips);
			if($('#reset-search').prop('disabled')){enable_clear_button();}
		}
		else{
			if (!inputValidation(unordered_list,text)){
				return;
			}		
			else{
				var chips = '<li><span class="delete-chip"> &times; </span>  <span class="chip-value">' + text +'</span> </li> ';
				unordered_list.prepend(chips);
				if($('#reset-search').prop('disabled')){enable_clear_button();}
				
				if(id=="state-list" ||id=="suburb-list" || id=="postCode-list" ||id=="country-list" )
				{
					get_location_for_adv_search();
					var id_string = current_location_type + '-loc-list';
					$('#'+id_string).empty();
					var loc_object ;
					if (current_location_type=="sender"){
						loc_object = sender;
					}
					else if(current_location_type=="receiver"){
						loc_object = receiver;
					}
	
					 for (var key in loc_object) {
						 if (loc_object	.hasOwnProperty(key)) {							
							add_chips_into_list(id_string,loc_object[key]);				
						}
					}				
				}
				return true;
			}

		}			
	}

// --- End Free text List Control ---

// --- Location Editor controls ---
	//Sender Location Editor Toggle

	$("#sender-receiver-loction-editor .close").click(function(){
		$("#sender-receiver-loction-editor").toggle(100);
	});

	$('#sender-location-value').click(function(e){		
		$('#sender-loc-add-op').click();
		e.stopPropagation();
	});
	$('#receiver-location-value').click(function(e){
		$('#receiver-loc-add-op').click();
		e.stopPropagation();
	});

	function close_loc_editor(e){
		if(  editor_status == "opeining"){
			editor_status = "opened";			
			return;
		}	
		
		if($('#sender-receiver-loction-editor').css("display") == "block"){
			var list_type=$(e.target).parent().parent().attr('id');
			if(list_type=="state-list" ||list_type=="suburb-list" || list_type=="postCode-list" ||list_type=="country-list"){
				return;
			}
		}
		var is_in_popup =  $(e.target).parents().is("#sender-receiver-loction-editor");
		if(!is_in_popup){
			$('#sender-loc-add-op').css('transform','rotate(0deg)');
			$('#receiver-loc-add-op').css('transform','rotate(0deg)');
			$('#receiver-loc-add-op .up-arrow-head').hide();
			$('#sender-loc-add-op .up-arrow-head').hide();
			$("#sender-receiver-loction-editor").hide();
			$("#sender-loc-list").show();
			$("#receiver-loc-list").show();
			editor_status = "closed";
			$("body").off( "click", close_loc_editor );
			current_location_type="";
		}		
	}
	
	$('.custom-dropdown input').click(function(e){close_loc_editor(e)});

	$(".location .add-data").click(function(e){
		
		$("#advance-search #sender-receiver-loction-editor .input-label-grp").removeClass('error');
		$("#advance-search #sender-receiver-loction-editor .input-label-grp input").val('');
		//e.stopPropagation();
		$("#sender-receiver-loction-editor").show(); //toggle(100);
		var id = $(this).attr('id');
		if((id=="sender-loc-add-op" && current_location_type=="sender") ||(id=="receiver-loc-add-op" && current_location_type=="receiver") ){
			$('#sender-loc-add-op').css('transform','rotate(0deg)');
			$('#receiver-loc-add-op').css('transform','rotate(0deg)');
			$('#receiver-loc-add-op .up-arrow-head').hide();
			$('#sender-loc-add-op .up-arrow-head').hide();
			$("#sender-receiver-loction-editor").hide();
			$("#sender-loc-list").show();
			$("#receiver-loc-list").show();
			editor_status = "closed";
			$("body").off( "click", close_loc_editor);
			current_location_type="";
			return;
		}
		
		if(id == "sender-loc-add-op"){	
			
			populate_to_location_for_adv_search(sender,"sender");
			current_location_type="sender";
			$('#sender-loc-add-op').css('transform','rotate(180deg)');
			$('#receiver-loc-add-op').css('transform','rotate(0deg)');
			$('#receiver-loc-add-op .up-arrow-head').hide();
			$('#sender-loc-add-op .up-arrow-head').show();
			$("#sender-loc-list").hide();
			$("#receiver-loc-list").hide();			
			if(editor_status != "opened"){
				$("body").on( "click", close_loc_editor);
			}
			editor_status = "opeining";			
			return;
		}
		else if(id=="receiver-loc-add-op"){			
			populate_to_location_for_adv_search(receiver,"receiver");
			current_location_type="receiver";
			$('#sender-loc-add-op').css('transform','rotate(0deg)');
			$('#receiver-loc-add-op').css('transform','rotate(180deg)');
			$('#receiver-loc-add-op .up-arrow-head').show();
			$('#sender-loc-add-op .up-arrow-head').hide();
			$("#sender-loc-list").hide();
			$("#receiver-loc-list").hide();	
			if(editor_status != "opened"){
				$("body").on( "click", close_loc_editor);
			}
			editor_status = "opeining";	
			return;
		}		
	});
	
// update chips in sender/receiver location list
function populate_to_location_for_adv_search(loc_object,type){	
	var id_string = type + '-loc-list';
	if(type=="sender" || type=="receiver"){
		$('#sender-receiver-loction-editor ul').empty();
	}

	$('#'+id_string).empty();		
	for ( key in loc_object) {
		if(key=="state" ||key=="suburb" || key=="postCode" ||key=="country"){								
			add_chips_into_list(key+ "-list",loc_object[key]);
			add_chips_into_list(id_string,loc_object[key]);				
		}
	}
}

// updating sender and receiver json object 
function get_location_for_adv_search(){
	obj = {};
	loc_list = ["suburb","state","postCode","country"];

	for (var index = 0; index < loc_list.length; index++) {
		var x = get_chip_list(loc_list[index]+"-list");
		if(x.length > 0){
			obj[loc_list[index]] = x;
		}			
	}
	if(current_location_type=="sender"){
		sender = obj;
	}
	else if (current_location_type=="receiver"){
		receiver = obj;
	}

}

function remove_chip_from_json(chip_collection,chip_value){
	for (key in chip_collection) {
		if (chip_collection.hasOwnProperty(key)) {
			var element = chip_collection[key];
			var new_element = []
			for(var i=0;i<element.length; i++){
				if(element[i].trim() != chip_value.trim()){
					new_element.push(element[i]);
				}					
			}		
			chip_collection[key] = new_element;				
		}
	}
}

// --- End Location Editor Control ---


// --- Search button click action ---	

$("#get-advance-search").click(function(){
		
	$("#advance-search .input-label-grp").removeClass('error');
	$('.date-box').removeClass('error');		
	$('.date-box').siblings('.error-msg').hide();	
	get_adv_search_req_data();			
});

// To get all related json for advance serach 
function get_adv_search_req_data(){
	var advanceParams = {};
	search_criteria = {};
	search_criteria.advanceParams = advanceParams;

	var reference_numbers = get_chip_list('reference-number-list');
	if(reference_numbers.length > 0){
		advanceParams.reference =reference_numbers;
	}

	var sender_names = get_chip_list('sender-name-list');
	if(sender_names.length > 0){
		advanceParams.senderName =sender_names;
	}
	
	var receiver_names = get_chip_list('receiver-name-list');
	if(receiver_names.length > 0){
		advanceParams.receiverName  = receiver_names;
	}

	var temp_sender =  get_json_format(sender);
	if( !jQuery.isEmptyObject(temp_sender)){
		advanceParams.senderLocation  = temp_sender;				
	}
	var temp_receiver =  get_json_format(receiver) 
	if( !jQuery.isEmptyObject(temp_receiver)){
		advanceParams.receiverLocation  = temp_receiver;				
	}	

	var toll_carrier = get_chosen_chips("#carrier-list");
	if(toll_carrier.length > 0){
		advanceParams.tollCarrier = toll_carrier;
	}
	var toll_service =  get_chosen_chips("#service-list");
	if(toll_service.length > 0){
		advanceParams.serviceType = toll_service;
	}
	var toll_milestone =  get_chosen_chips("#milestone-list");
	if(toll_milestone.length > 0){		
		advanceParams.milestone = toll_milestone;
	}
	
	advanceParams.senderNameInclude = $("#include-exclude-sender").is(":checked") ? false : true;
	advanceParams.receiverNameInclude = $("#include-exclude-receiver").is(":checked") ? false : true; //include-exclude-receiverLocation
	advanceParams.senderLocationInclude = $("#include-exclude-senderLocation").is(":checked")? false : true;
	advanceParams.receiverLocationInclude = $("#include-exclude-receiverLocation").is(":checked")? false : true;   
	advanceParams.serviceTypeInclude = $("#include-exclude-server-type").is(":checked")? false : true;              
	advanceParams.tollCarrierInclude = $("#include-exclude-toll-carrier").is(":checked")? false : true;
	advanceParams.milestoneInclude = $("#include-exclude-milestone").is(":checked")? false : true;
	if($('.thin-tab .tab:nth-child(2)').hasClass('active')){
		advanceParams.fromDate = $("#advsrchFromDate").val(); 
		advanceParams.toDate  =  $("#advsrchToDate").val();	
	}	
	else{
		advanceParams.fromDate =ship_from_date;
		advanceParams.toDate = ship_to_date;
	}	
	//default
	search_criteria.noOfRecordToFetch = 20; // hardcoded
	if(search_criteria=={}){
		console.log("backend service is not reachable")
	}
	else if( search_criteria.advanceParams.fromDate == undefined || search_criteria.advanceParams.toDate == undefined 	 || search_criteria.advanceParams.fromDate.trim()=="" || search_criteria.advanceParams.toDate.trim()=="" ){
	
		update_error ($('.date-box'), "Please select shipment created from date!");			
		return false;
	}
	else{
		$("#advance-search .input-label-grp input").not(".thin-tab .input-label-grp input").val('');
		$('#advanceSearchResults').css('display', 'block');
		$('#adl_advseavedsrchBtn').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading.saveSearch);
		$('#getMoreAvdSearch').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading.view_more);
		$('#advSchHasEditButton').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading.edit_search);
	
		get_data_for_adv_search(false);
		$('html,body').animate({
			scrollTop : $("#advanceSearchResults").offset().top
		}, 'slow');
	}
}

function get_json_format(obj){
	var obj_temp = {};
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if(obj[key].length > 0){
				obj_temp[key] = obj[key];
			}		
		}
	}
	if(!jQuery.isEmptyObject( obj_temp )){
		return obj_temp;
	}
	return {}
}


function get_data_for_adv_search(isViewMore) {
	if(!isViewMore) {
		startRecord = 0;
		$("#getMoreAvdSearch").css("display", "block");
	}
	var searchName = $("#current-selected-search").val();	
	if(startRecord) {
		search_criteria.startRecord = startRecord;
	}
	
	showPageLoader();
	$.ajax({
        type : 'POST',
        url : advanceSearchResult.advancesearchUrl,
        data : {
              getadvanceSearchParams : JSON.stringify(search_criteria) 
        },
        cache : false,
        success : function(data) {
              try {

                     var savedSearch = JSON.parse(data);
                     if(savedSearch.success) { 
                            $('#advSearchResultsdiv').show();                                         
                            if(savedSearch.data.noOfRows == 0){
                                   $('#advscrhTabContentdiv').hide();
                                   $('#advScrhNoDataDiv').show();                                            
                                   $('#advScrhNoDataDivCon').html("No result found.");
                            }else{
                                   $('#advscrhTabContentdiv').show();
                                   $('#advScrhNoDataDiv').hide();
                            }
                     /* savedSearch.data.noOfRows = 100;    */
                            var numofreqview = startRecord+limit;
                            var numOfadvSeclist;
                            if(savedSearch.data.noOfRows <= startRecord+limit) {
                                          $(".getMoreAvdSearch").hide();
                                   numOfadvSeclist = savedSearch.data.noOfRows
                            }else{
                                   numOfadvSeclist = numofreqview;
                            }
                            $(".advscrhTotalCounter").text("1-"+ numOfadvSeclist +" of "+ savedSearch.data.noOfRows +" results found");

                            //populateSavedDataList(savedSearch.data, isViewMore);
                            hidePageLoader();
                            console.log(savedSearch); // to remove
                            search_res.isViewMore = $('#getMoreAvdSearch').css("display");
                            search_res.startRecord = startRecord;
                            search_res.current_search = current_search;
                            search_res.rec_string = "1-"+ numOfadvSeclist +" of "+ savedSearch.data.noOfRows +" results found";
                            if(!isViewMore){
                                   search_res.data = JSON.parse(data);
                            }
                            else{
                                   var add_res = search_res.data.data.results.concat(JSON.parse(data).data.results);
                                   search_res.data.data.results = add_res;
                            }
                            // for back functionality
                            bind_search_result (savedSearch.data, isViewMore);
                            addsavesearchcount();
                     } 

                     else {
                            var error_results = JSON.parse(data);
                            
                            hidePageLoader();
                            $('#advSearchResultsdiv').show();
                            $('#advScrhNoDataDiv').show();   
                            $('#advscrhTabContentdiv').hide();
                            $('#advScrhNoDataDivCon').html(JSON.parse(error_results.message.errorObject)[0].message);
                     }

              } catch(exception) {
                     hidePageLoader();
                     
                     $('#advSearchResultsdiv').show();
                     $('#advScrhNoDataDiv').show();   
                     $('#advscrhTabContentdiv').hide();
                     $('#advScrhNoDataDivCon').html(errors.unknown_error); //"Getting some server error, while fetching data. Please try again."
              }
        
        },
        error : function(error, t) {
              hidePageLoader();
              $('#advSearchResultsdiv').show();
              $('#advScrhNoDataDiv').show();   
              $('#advscrhTabContentdiv').hide();
              if (t === 'timeout') {
              $('#advScrhNoDataDivCon').html(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ErrorMessages.timeout_error);
              } else {
              $('#advScrhNoDataDivCon').html(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ErrorMessages.unknown_error);
              }
        },
        timeout: 120000
	});
}

function result_success(data) {	

	try {
		var savedSearch = data ;	// JSON.parse(data);
		if(savedSearch.data.success) {	
			$('#advSearchResultsdiv').show(); 
			if(savedSearch.data.noOfRows == 0){
				$('#advscrhTabContentdiv').hide();
				$('#advScrhNoDataDivCon').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.noresultfound);
				
				$('#advScrhNoDataDiv').show();
			}else{
				$('#advscrhTabContentdiv').show();
				$('#advScrhNoDataDiv').hide();
			}
			var numofreqview = startRecord+limit;
			var numOfadvSeclist;
			if(savedSearch.data.noOfRows <= startRecord+limit) {
					$(".getMoreAvdSearch").hide();
				numOfadvSeclist = savedSearch.data.noOfRows;
			}else{
				numOfadvSeclist = numofreqview;
			}
			$(".advscrhTotalCounter").text("1-"+ numOfadvSeclist +" of "+ savedSearch.data.noOfRows +" results found");
			//search_res = data // for back functionality
			bind_search_result (savedSearch.data,search_res.isViewMore);
			addsavesearchcount();
			$('html,body').animate({
				scrollTop : $("#advanceSearchResults").offset().top
			}, 'slow');
		} else {
			$('#advscrhTabContentdiv').hide();
			$('#advScrhNoDataDiv').show();
			$('#advScrhNoDataDivCon').html(JSON.parse(savedSearch.message.errorObject)[0].message);
		}

	} 
	catch(exception) {
		console.log(exception);
		hidePageLoader();
	}
}

// --- End Search button click action ---
	

// --- Choosen Controls

// ------------need to remove -----
function update_carrier_ddl(){

	if(searches.length > 0){	
		
		for (var index = 0; index < searches.length; index++) {
			$('#saved-search .dropdown-list-ul').append('<li data-id='+ searches[index].SearchId +' >' +searches[index].SearchName +' </li>');					
		}
		
		if(cuurent_search_name != "" || cuurent_search_name != null){
			saved_search_changed_by_name(cuurent_search_name);		
		}
		else{
			saved_search_changed(0,-1); 
		}		
	}
}

function update_select_list(type, list){
	var value_list = [];
	for (var index = 0; index < list.length; index++) {
		// = list[index];
		text = $('#ms-'+type+'-ddl li[data-id="'+list[index]+'"]').text().trim();
		if (text != ""){
			value_list.push(text);
			$('#ms-'+type+'-ddl li[data-id="'+list[index]+'"]').remove();	
		}
		
	}
	add_chips_into_list( type+'-list',value_list);
}

function add_option_in_select(id,obj,service_list){
	if(id=="ms-carrier"){
		$('#ms-carrier ul li').remove();
		var selected_toll_carrier = get_chosen_chips("#carrier-list");
		for (key in obj) {
			var is_selected = -1;
			if(selected_toll_carrier != undefined){
				is_selected = jQuery.inArray(key, selected_toll_carrier) ;
			}
			if(obj[key]!= undefined && is_selected < 0 ){
					$('#ms-carrier-ddl').append('<li data-id='+ key +'>' + obj[key] +'</li>');
			}
		}		
		
	}
	else if(id=="ms-service"){					
		$('#ms-service ul li').remove();
	
		var selected_toll_carrier = get_chosen_chips("#carrier-list");
		var selected_services = get_chosen_chips("#service-list");
		for (var i = 0; i < selected_toll_carrier.length; i++) {
			var key = selected_toll_carrier[i];
			for (var index = 0; index <  obj[key].length; index++) {
				var is_selected = -1;
				if(selected_services != undefined){
					is_selected = jQuery.inArray(key+"@"+obj[key][index].name, selected_services) ;
				}
				if(obj[key][index].name != undefined && is_selected < 0 ){					
						$('#ms-service-ddl').append("<li data-id='"+  key+"@"+obj[key][index].name +"'>"+ service_list[key]+"_"+obj[key][index].name+"</li>");
			
				}	
			}			
		}			
		$('#select-service').trigger("chosen:updated");		
	}
	else if(id=="ms-milestone"){			
		$('#ms-milestone ul li').remove();
		obj = obj.replace("[","");
		obj = obj.replace("]","");
		var x = obj.split(",");
		var selected_milestones =  get_chosen_chips("#milestone-list");
		for (var i = 0; i < x.length; i++) {

			var is_selected = -1;
			if(selected_milestones != undefined){
				is_selected = jQuery.inArray(x[i], selected_milestones) ;
			}
			if(milestone_map[x[i]] != undefined && is_selected < 0 ){
				$('#ms-milestone-ddl').append('<li data-id='+ x[i] +' >' + milestone_map[x[i]] +'</li>');
			}					
			
		}
	}
}

$('#current-ms-milestone').change(function () {
	var input_text = $('#current-ms-milestone').val();
	var li = $('#ms-milestone ul li').filter(function() { return $.text([this]) === input_text });
	if(input_text !=""){	
		if(li.length > 0){
			appened_text_to_unordered_list($('#milestone-list'),input_text);
			li.remove();
		}
		$('#current-ms-milestone').val("");		
	}

});
$('#current-ms-carrier').change(function () {
	var input_text = $('#current-ms-carrier').val();
	var li = $('#ms-carrier ul li').filter(function() { return $.text([this]) === input_text; });
	if(input_text !=""){		
		if(li.length > 0){
			appened_text_to_unordered_list($('#carrier-list'),$('#current-ms-carrier').val());
			li.remove();
			add_option_in_select("ms-service", current_search.carrierSettingJSON.carrierServiceJSON,current_search.carrierSettingJSON.carrierCodeNameJSON);
		}
		
	}
	$('#current-ms-carrier').val("");

});
$('#current-ms-service').change(function () {
	var input_text = $('#current-ms-service').val();
	var li = $('#ms-service ul li').filter(function() { return $.text([this]) === input_text });
	if(input_text != ""){		
		if(li.length > 0){
			appened_text_to_unordered_list($('#service-list'),input_text);
			li.remove();
		}				
	}
	$('#current-ms-service').val("");	

});
//on chip remove

function get_chosen_chips(id){
	var chips = [];	
	$.each($(id+" li .chip-value"),function(i,element) {
		var chip = $(element).text().trim(); 

	   if(chip != "" ){
			 if(id=="#service-list"){
				 var factors = chip.split("_");
				 var car =  get_value_by_key(current_search.carrierSettingJSON.carrierCodeNameJSON,factors[0]);
				 chip = car + "@" + factors[1];
			 }
			 else if(id=="#carrier-list"){
					chip = get_value_by_key(current_search.carrierSettingJSON.carrierCodeNameJSON,chip);											
			 }
			 else if(id=="#milestone-list"){
				chip = get_value_by_key(milestone_map ,chip);										
			 }		
		chips.push(chip);
	   }
	});
	return chips;
}

function get_value_by_key(obj,val){
	for (key in obj) {			
		if (val == obj[key]) {			
			return key;				
		}
	}
}

// --- End Choosen Controls	

	$("#advance-search .input-label-grp input").focusout("change",function(e){
		$(this).parent().removeClass('error');
	});
	
	var reg_ex_restricted = new RegExp("^[a-zA-Z0-9 \\[\\]\*\,\\\\\/.|'•\{\}\#\:\;\)\(\_\@\~\`\^\?\<\>\=\+\%\!\$\&\"`-]*$");

	function inputValidation(list_el,input_text){

		var max_40_char = "Maximum 40 charecters allowed for tags."; // WCM
		var required_text = "Enter text"; // WCM
		
		var el = list_el; //selector.find(id);
		var error_msg =  max_40_char;
		var max_count = 20;
		var ref_max_count = 100;
		

		if(input_text.length > 40){
			update_error(el, error_msg);			
			return false;
		}		
		if(input_text =="" || input_text == null ){				
			error_msg = required_text; 
			update_error(el, error_msg);	
			return false;		
		}
		var chips = list_el.find('li .chip-value').map(function(){return $.trim($(this).text().toLowerCase());}).get();
		if(chips.indexOf(input_text.trim().toLowerCase()) > -1){
			error_msg = errors.unique_tag ;//"Same text already exist.";
			update_error(el, error_msg);				
			return false;	
		}	
		if(((list_el.attr('id') =="suburb-list") || (list_el.attr('id') =="state-list") ||( list_el.attr('id') =="country-list" )   ) && !reg_ex_restricted.test(input_text) ){
			error_msg = errors.req_valid_char; //"Please enter valid charecters only.";		
			update_error (el, error_msg);
			return false;
		}
		if((input_text.trim().length < 3) && (list_el.attr('id')!="state-list") && (list_el.attr('id')!="country-list") ){
			error_msg = errors.min_3_char; //"Enter minimum value";			
			update_error (el, error_msg);
			return false;
		}
		if(((list_el.attr('id')=="state-list") ||(list_el.attr('id')=="country-list") ) && input_text.trim().length < 2 ){
			error_msg = errors.min_2_char; //"Enter minimum value.";
			update_error (el, error_msg);	
			return false;			
		}
		if((list_el.attr('id')!="reference-number-list") && $('#' +list_el.attr('id')+' li').length >= max_count){
			error_msg = errors.max_20_tag_allowed; //"Max 20 filters available.";
			update_error (el, error_msg);	
			return false;
		}
		if((list_el.attr('id') =="reference-number-list") && $('#' +list_el.attr('id')+' li').length >= ref_max_count){
			error_msg = "Only 100 tags are allowed per field."; //
			update_error (el, error_msg);	
			return false;
		}
		else{
			el.parent().removeClass('error');
			return true;
		}
	}

		
	function update_error(ele, msg){
		
		ele.parent().addClass('error');
		if(ele.next('span.error-msg').length === 0){
			ele.after('<span class="error-msg">'+msg+'</span>');
			
		}
		else{
			ele.next('span.error-msg').remove();
			ele.after('<span class="error-msg">'+msg+'</span>');
		}

		if((ele.attr('id') == "sender-loc-list") || (ele.attr('id') == "receiver-loc-list")){
			ele.parent().removeClass('error');
		}
	}	
	
	function viewMoreData() {
		startRecord+= limit;
		get_data_for_adv_search(true);
	}
	
	$(".track-advacnce-search .dateRangeDetails").click(function(){
		$(this).find('input').focus()
		
	});

	/// Search Result 
	//bind result json with table
	//bind_search_result (search_res);
	function bind_search_result (search_result, isViewMore){		
		
		var wcmTemplateScript = $("#tblAdvSerhResult-template").html();
		var wclListTemplate = Handlebars.compile(wcmTemplateScript);
		var wcmListHtml = wclListTemplate(search_result);
		if(isViewMore) {
			$("#tblAdvSerhResult").append(wcmListHtml);
		} else {
			$("#tblAdvSerhResult").html(wcmListHtml);
		}					
	}

	//all Ajax Call
	
	function get_page_data(){
		populateWcmData();
		showPageLoader();
		if(window.location.href.indexOf("#?t=as") > -1){
			
			search_res = JSON.parse(sessionStorage.getItem("results"));
			current_search = search_res.current_search;
			initialise_value(); 
			is_page_data_loaded = true;
			addsavesearchcount();
			return;
		}
		$.ajax({
			type: "GET",
			url: pageDataUrl,
			success: function( res ){
				var res_obj = JSON.parse(res);
				$('#error-box .section-error').remove();
				if(res_obj.success){
					$('#error-box').hide();
					$('#wrapper-advance-search').show();
					current_search = JSON.parse(res_obj.data);
					
					var prio,prinz;					
					if(current_search.carrierSettingJSON.carrierCodeNameJSON.PRIO){
						current_search.carrierSettingJSON.carrierCodeNameJSON.PRIO = "Toll Priority(AU & NZ)";
						prio = current_search.carrierSettingJSON.carrierServiceJSON.PRIO;
					}
					if(current_search.carrierSettingJSON.carrierCodeNameJSON.PRINZ){
						prinz = current_search.carrierSettingJSON.carrierServiceJSON.PRINZ;
						delete current_search.carrierSettingJSON.carrierCodeNameJSON.PRINZ ;

						for (var index = 0; index < prinz.length; index++) {						
							prio.push(prinz[index]);						
						}	
						prio = _.uniq(prio, 'name');						
						current_search.carrierSettingJSON.carrierServiceJSON.PRIO = prio;
					}	

					initialise_value(); 
					is_page_data_loaded = true;
					
					hidePageLoader();
					addsavesearchcount();					
					
				}
				else{

					hidePageLoader();
					var er_code = JSON.parse(res_obj.message.errorObject)[0].errorCode;
					var er_msg = errors.unknown_error; //"Getting some server error, while fetching data. Please try again.";
					var er_title = "Server Error";
					//res_obj.message.errorObject[0].message
					
					if(er_code == "TOLL-ERR-20007"){
						er_title = "Account Access";
						er_msg = "Your account is not authorised to access this function. Please update your Account Settings.";
					}
					//disable page

					$('#error-box').show();
					$('#wrapper-advance-search').hide();
					$$global.sectionErrorBox ({ 
						"parent":"error-box", 
						"title":er_title, 
						"msg":er_msg, 
					}); 
				}	
				
			},
			error: function(errorThrown) {			
				hidePageLoader();
			}
		});

	}
	//---- Helper for making sentence case --------//
	Handlebars.registerHelper('sentenceCase', function(obj) {
		if(obj.fn(this)) {
			return obj.fn(this).replace(/(\w)(\w*)/g,
					function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
		}  else {
			return obj.fn(this);
		}
	});

	//---- Helper for making sentence case --------//
	Handlebars.registerHelper('titleCase', function(obj) {
		if(obj.fn(this).length > 3) {
			return obj.fn(this).replace(/(\w)(\w*)/g,
					function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
		}  else {
			return obj.fn(this);
		}
	});

	//---- added code to display date as per milestone --
	Handlebars.registerHelper('dateAsPerMilestone', function(obj) {
		if(obj.fn(this.status) == 'DELVERD') {
			return changeDateFormat(obj.fn(this.shipmentDeliveryDate));
		} else if(obj.fn(this.status) == 'COLLCTD') {
			return changeDateFormat(obj.fn(this.shipmentCollectedDate));
		} else {
			return changeDateFormat(obj.fn(this.eta));
		}
	});
	
	
	function changeDateFormat(d) {
		if(d) {
			var splitDate = d.split("/");
			var newgetdate = splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2];
			var date = new Date(newgetdate);
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
				day = "0" + day;
			}
			return day +  " " + month[date.getMonth()] + " " + date.getFullYear();
		} else {
			return ;
		}
	}
	// ------added code to display date as per milestone-- finished---		
// date format code
	Handlebars.registerHelper("advChangeformatDate", function(d) {
		if(d) {
			var splitDate = d.split("/");
			var newgetdate = splitDate[1]+"/"+splitDate[0]+"/"+splitDate[2];
			var date = new Date(newgetdate);
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
		else {
			return "";
		}
	});

	function addsavesearchcount(){
		if(current_search && current_search.saveSearchJson){
			maxNoAllowedSavedSearch = settings.allowedNoOfSavedSearch;
			numberOfSavedSearch = current_search.saveSearchJson.length;
			$('#savedSearchCount').fadeIn().text(current_search.saveSearchJson.length +"/"+ settings.allowedNoOfSavedSearch +" saved searches");
			$('#savedSearchCount').popover({
				content:  function() {
					return "You have saved "+ numberOfSavedSearch +" out of "+ maxNoAllowedSavedSearch +" saved searches limit.";
				},            
				trigger: 'manual'
			}).off('mouseenter').on('mouseenter', function(e) {
				$(this).popover('show');            
				$('#savedSearchCount').mouseleave(function(e) {
				$('#savedSearchCount').popover('hide');
				});
			});
		}
	}

	function advsrchSavedSearch (){
		$('#adl_saveSearch').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.savedSearch.savedpopup.savedpopupheading);
		$('#adl_saveSearchName').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.savedSearch.savedpopup.savedpopupname);
		$('#adl_savedSearchChangeName').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.savedSearch.savedpopup.savedsearchcheckbox);
		$('#advSrchSaveBtn').text(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.savedSearch.savedpopup.savedsearchbtn);
		$('.tollSaveSearchPopup').fadeIn();
		$('.tollSaveSearch-close').click(function(){
			$('.tollSaveSearchPopup').fadeOut();
			$("#ifEditSavedname").attr("checked", false);
		});
		$('#advSrchCancelBtn').click(function(){
			$('.tollSaveSearchPopup').fadeOut();
			$("#ifEditSavedname").attr("checked", false);
		});
		
		$("#ifEditSavedname").on("change", function(){
			if($(this).is(':checked')){
				$("#advSaveSearch").attr("disabled", false);
				$('#advSrchSaveBtn').text("SAVE");
			}else{
				$("#advSaveSearch").attr("disabled", true);
				$('#advSrchSaveBtn').text("UPDATE");
				$('#advSaveSearch').val($('#saved-search-value').val());
			}
		
		});
		var checksaveId = $('#saved-search-value').val();
		
		if(!checksaveId == ""){
			var getsavedsechval = $('#current-saved-search').val();
			$("#advSaveSearch").val(getsavedsechval);
			$("#advSaveSearch").attr("disabled", true);
			$('#advSrchSaveBtn').text("UPDATE");
			$(".ifEditSavednameDiv").show();
			$("#advSaveSearch").removeClass('advSavedSearch-error');
			$('#advSaveSearch-errorMg').hide();	
		}else{
			$("#advSaveSearch").val("");
			$("#advSaveSearch").attr("disabled", false);
			$('#advSrchSaveBtn').text("SAVE");
			$(".ifEditSavednameDiv").hide();
			$("#advSaveSearch").removeClass('advSavedSearch-error');
			$('#advSaveSearch-errorMg').hide();
		}

	}
	function advSrchSaveBtnclick(){
		var advchecksaveId = $('#saved-search-value').val();
		var inputvaild = false;
		var inputfield = $('#advSaveSearch');
		if( inputfield.val() == ""){
			inputvaild = false;
			inputfield.addClass('advSavedSearch-error');
			$('#advSaveSearch-errorMg').fadeIn().text(errors.req_valid_search); 
			//return false;
		}	
		else if(current_search && current_search.saveSearchJson && current_search.saveSearchJson.length >= settings.allowedNoOfSavedSearch ){
			
			if(advchecksaveId != ""){
				if($('#ifEditSavedname').is(":checked")== false){
					inputvaild = true;
					inputfield.removeClass('advSavedSearch-error');
					$('#advSaveSearch-errorMg').fadeOut();
					searchSaveAjaxReq();
					addsavesearchcount();
					return;
				}
			}			
			inputvaild = false;
			inputfield.addClass('advSavedSearch-error');
			$('#advSaveSearch-errorMg').fadeIn().text("You Have Exceeded Saved Search Limit"); //wcm

		}else if(advchecksaveId == "" || $('#ifEditSavedname').is(":checked")){
			if(checkSearchName()){
				inputvaild = false;
				inputfield.addClass('advSavedSearch-error');
				$('#advSaveSearch-errorMg').fadeIn().text("Search Name Already Exists"); //WCM
			}else{
				inputvaild = true;
				inputfield.removeClass('advSavedSearch-error');
				$('#advSaveSearch-errorMg').fadeOut();
				searchSaveAjaxReq();
				addsavesearchcount();
			}
		}		
		else{
			inputvaild = true;
			inputfield.removeClass('advSavedSearch-error');
			$('#advSaveSearch-errorMg').fadeOut();
			searchSaveAjaxReq();
			addsavesearchcount();
		}
	}

	function checkSearchName(){
		var checkSearch = false;
		if(current_search && current_search.saveSearchJson && current_search.saveSearchJson.length > 0){
			$.each(current_search.saveSearchJson, function(i, ele){
				if($('#advSaveSearch').val().toLowerCase().trim() == ele.SearchName.toLowerCase().trim()){
					checkSearch = true;
				}
			});
		} 	

		return checkSearch;
	}
	
	function searchSaveAjaxReq(){

		//if date period selected
		var criteria_to_save = search_criteria;
		if($('.thin-tab .active label').text()=='Date period'){
			criteria_to_save.advanceParams.date_period = current_period;
		}

		$.ajax({
		url: saveSearch,
		type: 'POST',
		cache: false,
		data: {"getadvanceSearchParams" : JSON.stringify({
		"Function": "SHIPMENT",
		"Feature": "Shipment",
		"SearchName": $('#advSaveSearch').val().trim(),
		"SearchCriteria": search_criteria

	})},
	beforeSend: function() {
		showPageLoader();
	},
	success: function(data) {
		hidePageLoader();
		$('.tollSaveSearchPopup').fadeOut();
		cuurent_search_name = $('#advSaveSearch').val().trim();		
		$('#advSaveSearch').val("");
		$("#ifEditSavedname").attr("checked", false);
		//change cuurent search in dropdown
		get_page_data();		
		savedSearchJs.getSavedSearches();		
	},
	error: function(data) {
		hidePageLoader();
		$('#advSaveSearch-errorMg').fadeIn().text("Something went wrong");
	},
	complete: function() {}
	});
}

function scrollToTop(){
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
}

$('#advSearchRelClose').click(function() {
		$('#advanceSearchResults').css('display', 'none'); 
				
}); 

$('#advSchHasEditButton').click(function(){
	$('#reference-number').focus();
});

//******** Clear Button start **********/

disable_clear_button();

$('#reset-search').click(function(){

	$$global.confirmBox({
			icon: 'ico-exception',
			title: 'Please Confirm',			
			continueBtnTxt: 'Confirm',
			content: 'This action will clear all advanced search fields, do you want to continue?'
		}, function(result) {
			if(result) {
			cuurent_search_name = "";	
			initialise_value();	
			disable_clear_button()
			}
		});
	
});

function enable_clear_button(){

	if(is_any_field_change()){
		$('#reset-search').prop('disabled', false);
		$("#advance-search").off( "click", enable_clear_button);
		$('#reset-search').css('color','#222');
		$('#reset-search .ico-routing-details').css('color','#222');
		$('#advance-search .current-selected').off('change',enable_clear_button);		
		$('.input-switch-label .switch-input').off("click",enable_clear_button);
	}
}
function disable_clear_button(){
	$('#reset-search').prop('disabled', true);
	$('#reset-search').css('color','#d7d7d7');
	$('#reset-search .ico-routing-details').css('color','#d7d7d7');
	//attaching
	$('#advance-search .current-selected').on('change',enable_clear_button);
	$('.input-switch-label .switch-input').on("click",enable_clear_button);
}
function is_any_field_change(){
	
	var tab_text = $('.thin-tab .active label').text(); //Date period
	var date_text = $('.thin-tab .current-selected').val().trim(); //Last week
	var dafault_text = $('#period-selector ul li[data-id="'+default_period+'"]').text().trim();

	if($('#current-saved-search').val() !="" || 
		$('.input-label-grp ul li').length > 0 || 
		$('.input-switch-label .switch-input').is(":checked") ||
		tab_text !="Date period" ||
		date_text != dafault_text  ){

		return true;
	}
	else{
		return false;
	}
	
}

//******** Clear Button end **********/

function popover_init(id, tt_content){
	$('#'+id).popover({
		content: tt_content,
		html: true,
		trigger: 'manual'
	  }).off('click').on('click', function(e) {
		$(this).popover('show');
		//e.stopPropagation();
		$('.close').click(function(e) {
		  $('#'+id).popover('hide');
		});
	  });
}

popover_init('refPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.refPopover);
popover_init('senderPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.senderPopover);
popover_init('receiverPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.receiverPopover);
popover_init('createShipmentPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.createShipmentPopover);
popover_init('senderLocPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.senderLocPopover);
popover_init('receiverLocPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.receiverLocation);
popover_init('tollCarrierPopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.msCarrier);
popover_init('serviceTypePopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.msService);
popover_init('milestonePopover',dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ToolTip.msMilestone);

//

popover_init('savedSearchPopover',"<i class='close ico-delete'></i><h3>Saved searches</h3><div><p>Load a search which is previously saved by you.</p><i class='ico-question' aria-hidden='true'></i><a href='/web/guest/helptips' target='_blank'><i class='icon ico-not-found' aria-hidden='true'></i>My Help & Tips</a></div>");


$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

/**Delete Functionality */

function deleteSavedSearch(e,searchId,delSearchName) {
	e.stopPropagation();
	e.preventDefault();
	$$global.confirmBox({
		icon: 'ico-exception',
		title: 'Please Confirm',
		continueBtnTxt: 'Confirm',
		content: 'Are you sure you want to delete "'+delSearchName+'" saved search?'
	}, function(result) {
		if(result) {
			showPageLoader();
			  $.ajax({
				  url: deleteSearchUrl,
				  method: "GET",
				  dataType : 'JSON',
				  async: false,
				  data: {
					deleteSearchFilter: searchId
				  },
				  success: function(data) {
						try {	
							searchObj = data;
							if(searchObj.success) {
								get_page_data();
								savedSearchJs.getSavedSearches();
							} else {
								$('#saved-data-section').css("display", "none");
								$('#no-saved-data-error-msg').css("display", "none");
								$('#no-saved-data').css("display", "block");
							}
					  //hidePageLoader();
					  $('.tollDeletePopup #yes-btn').removeAttr("disabled");
					} catch(exception) {
						hidePageLoader();
						$('#saved-data-section').css("display", "block");
						$('#search-result-data').css("display", "none");
						$('#no-saved-data-error-msg').html("Getting some server error, while fetching data. Please try again.");
						$('#no-saved-data-error-msg').css("display", "block");
					}
					$('.tollDeletePopup').fadeOut();
				  },
				  fail: function(xhr) {
					  hidePageLoader();
					$('.tollDeletePopup').fadeOut();
				  }
				});
		}
	})
}

function bindAdvanceSearchLevels(id, value) {
	$("#"+id).text(value);	
}

function bindAdvanceSearchPlaceHolders(id, value) {
	$("#"+id).attr("placeholder", value);	
}

function bindAdvanceSearchSelectPlaceHolders(id, value) {
	$("#"+id).attr("data-placeholder", value);	
}

function populateWcmData() {
	if(dashboardWcm) {
	errors = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.ErrorMessages;
	var adLevels = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.formLevels;
	var adPlaceHolders = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.formPlaceholders;
	
	var wcmTemplateScript = $("#tblHeaderAdvSerhResult-template").html();
	var wclListTemplate = Handlebars.compile(wcmTemplateScript);
	var wcmListHtml = wclListTemplate(dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.tableheading);
	$("#adv-search-result-header").html(wcmListHtml);
	
	$(".adl_exclude").text(adLevels.adl_exclude);
	var levelIds = ["adl_referenceNumber", "adl_sender", "adl_receiver", "adl_shipmentCreatedDate", "adl_datePeriod", "adl_dateRange", "adl_dateFrom", "adl_dateTo", "adl_senderLocation", "adl_receiverLocation", "adl_tollCarrier", "adl_serviceType", "adl_milestone", "adl_suburb", "adl_state", "adl_postcode",  "adl_country", "get-advance-search", "delete-saved-search", "adl_savedSearchChangeName", "adl_saveSearchName", "adv-max-filter"];
	var adPlaceholderIds = ["current-saved-search", "reference-number", "sender-name", "receiver-name", "sender-location-value", "receiver-location-value", "current-ms-carrier", "current-ms-service", "current-ms-milestone", "suburb", "state", "postCode", "country"];
	
	for(var i=0; i<adPlaceholderIds.length; i++) {
		if(adPlaceHolders[adPlaceholderIds[i]]) {
			if(adPlaceholderIds[i].match(/select/g)) {
				bindAdvanceSearchSelectPlaceHolders(adPlaceholderIds[i], adPlaceHolders[adPlaceholderIds[i]]);
			} else {
				bindAdvanceSearchPlaceHolders(adPlaceholderIds[i], adPlaceHolders[adPlaceholderIds[i]]);
			}			
		}
	}
	
	for(var i=0; i<levelIds.length; i++) {
		if(adLevels[levelIds[i]]) {
			bindAdvanceSearchLevels(levelIds[i], adLevels[levelIds[i]]);
		}
	 }
	}
}

// ----------- Back button functionlity --------- //

function preserve_page_history(){
	window.history.pushState({},"","#?t=as");
	var criteria_to_save = search_criteria;
		if($('.thin-tab .active label').text()=='Date period'){
			criteria_to_save.advanceParams.date_period = current_period;
		}
		if($('#current-saved-search').val().trim()!=""){
			criteria_to_save.advanceParams.saved_search = $('#current-saved-search').val();
		}

	//fill seassion variable
	sessionStorage.setItem("bo", JSON.stringify(criteria_to_save));
	sessionStorage.setItem("results",JSON.stringify(search_res));

}
function redirectToDetailSearchPage(consignmentId) {
	preserve_page_history();
	var baseRelativeUrl = '/web/guest/shipment-details';
	window.location.href = baseRelativeUrl+"?consignmentId="+consignmentId;
}


