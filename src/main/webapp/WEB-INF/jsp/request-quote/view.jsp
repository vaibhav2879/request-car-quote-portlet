<%@ include file="/WEB-INF/jsp/request-quote/init.jsp" %>

<portlet:resourceURL id="pickupList" var="pickupList"></portlet:resourceURL>
<portlet:resourceURL id="draftShipmentList" var="draftShipmentList"></portlet:resourceURL>
<portlet:resourceURL id="watchList" var="watchList"></portlet:resourceURL>
<portlet:resourceURL id="manifestList" var="manifestList"></portlet:resourceURL>
<portlet:resourceURL id="getSaveSearchList" var="getSaveSearchList"></portlet:resourceURL>
<portlet:resourceURL id="deleteSearchFilter" var="deleteSearchFilter"></portlet:resourceURL>
<portlet:resourceURL id="advancesearch" var="advancesearch"></portlet:resourceURL>
<%-- <portlet:resourceURL id="downloadAdavanceSearchResults" var="downloadAdavanceSearchResults"></portlet:resourceURL> --%>

<portlet:resourceURL escapeXml="false" id="getDraftShipment" var="getDraftShipmentURL"></portlet:resourceURL>

<script type="text/javascript" src="<%=themeDisplay.getPathThemeJavaScript() %>/weekdays-calender.js"></script>
<script type="text/javascript" src="<%=themeDisplay.getPathThemeJavaScript() %>/custom-dropdown.js"></script>
<script type="text/javascript" src="<%=themeDisplay.getPathThemeJavaScript() %>/address-dropdown.js"></script>
<script type="text/javascript" src="<%=themeDisplay.getPathThemeJavaScript() %>/numericInput.min.js"></script>
<script type="text/javascript" src="<%=themeDisplay.getPathThemeJavaScript() %>/chosen.jquery.min.js"></script>

<script>

</script>
<div id="tab-groups" class="get-scoll-here">
	<div id="" style="text-align:center;font-size:25px;font-family: fantasy;">
		Request a car quote <br/><br/>
	</div>
	<div id="dashboard-features-info">
       <div class="features-info-container">
	        <ul class="nav nav-tabs" id="featuresTab">
               <li id="watchList" class="active"><i class="ico-save"></i><a class="" href="#watchlist" id="watchlistTabAnchor"><span class="hidden-sm hidden-xs">Section 1</span></a></li>
               <li id="manifestLi"><i class="ico-save"></i><a class="" href="#manifest" id="manifestTabAnchor"><span class="hidden-sm hidden-xs">Section 2</span></a></li>
			   <li id="pickupLi"><i class="ico-save"></i><a class="" href="#mypickups" id="pickupTabAnchor"><span class="hidden-sm hidden-xs">Section 3</span></a></li>
			   <c:choose>
	                 <c:when test="${(isMobile eq 'false') && (isTablet eq 'true' || isNormal eq 'true' ) }">
						   <li id="draftshipmentLi"><i class="ikon ico-pod1"></i><a class="" href="#draft-shipment" id="draftshipmentAnchor"><span class="hidden-sm hidden-xs">draft shipments</span></a></li>
						   <li id="savedsearchLi"><i class="ikon ico-search"></i><a class="" href="#savedSearch" id="savedSearchTabAnchor"><span class="hidden-sm hidden-xs">saved searches</span></a></li>
		            </c:when>
					<c:otherwise></c:otherwise>
				</c:choose>	
               
	        </ul>
            <div class="tab-content mobremovemargin">
                
                <%@ include file="/WEB-INF/jsp/request-quote/watchlist.jsp" %>
                
                <%@ include file="/WEB-INF/jsp/request-quote/manifestList.jsp" %>
                
                <%@ include file="/WEB-INF/jsp/request-quote/pickuplist.jsp" %>
                
            </div>
       </div>
	</div>
</div>

<div class="tollDeletePopup" style="display:none;">
	<div class="tollDeletePopup-wrap">
	 <div class="tollDeletePopup-main">
		 <a class="tollDeletePopup-close"><i class="ico-delete"></i></a>
		 <header>
			 <h2>Are you sure you want to delete it</h2>
		 </header>
		 <footer class="tollDeletePopup-btnwrap">
			 <button class="yes-btn" id="yes-btn" data-delstatus="yes" data-val="">Confirm</button>
			 <a class="no-btn" data-delstatus="no">Cancel</a>
		 </footer>
	 </div>
 </div>
</div>

<script type="text/javascript">
	function loadSelectedList(tab, pageNum, searchParam) {
	/* console.log("tab : "+tab +"  : pageNum "+ pageNum); */
	var dashboardDetails = {
		pickupListUrl : "<%=pickupList %>",
		draftShipmentList : "<%=draftShipmentList %>",
		watchListUrl : "<%=watchList %>",
		manifestListUrl : "<%=manifestList %>"
	}
	var tabDivId;
	var resourceUrl;
	
	var paramData = {};
	paramData.pageNum = pageNum;
	paramData.searchParam = searchParam;
	var isFutureDateAllowed = false;
	
	if(tab == "manifestTabAnchor"){
		resourceUrl = dashboardDetails.manifestListUrl;
		tabDivId = "manifest";
		isFutureDateAllowed = true;
	}else if(tab == "pickupTabAnchor"){
		resourceUrl = dashboardDetails.pickupListUrl;
		tabDivId = "pickup";
		isFutureDateAllowed = true;
	}else if(tab == "watchlistTabAnchor"){
		resourceUrl = dashboardDetails.watchListUrl;
		tabDivId = "watchlist";
	}
	var tabDataBody = tabDivId+"DataTbody";
	//var viewMoreDiv = tabDivId+"HasMoreDiv";
	var viewMoreButton = tabDivId+"HasMoreButton";
	var pageNumDiv = tabDivId+"PageNum";
	var viewMoreFlagDiv=tabDivId+"ViewMore";
	var searchParamDiv=tabDivId+"SearchParam";
	var tableListId=tabDivId+"TableId";
	var dataAvailableFlag = tabDivId+"DataAvailable";
	var searchDiv = tabDivId+"SearchDiv";
	var downloadDiv = tabDivId+"DownloadDiv";
	var noDataContentDiv = tabDivId+"NoDataDiv";
	var fromDate = tabDivId+"FromDate";
	var toDate = tabDivId+"ToDate";
	var noDataMsgDiv = tabDivId+"NoDataMsgDiv";
	var noDataMsg = tabDivId+"NoDataMsg";
	
	if (searchParam == null || searchParam == ""){
		getFromAndToDate(fromDate, toDate, isFutureDateAllowed);
	} 

    //charDataEllips();
	//showPageLoader();
	/* if(pageNum == 1 && (searchParam == null || searchParam == "")){
		$("#"+tableListId).hide();
		$("#"+searchDiv).hide();
		$("#"+downloadDiv).hide();
		$("#"+viewMoreButton).hide();
		$("#watchlistHasMoreDiv").hide();
	} */
	//$("#"+noDataContentDiv).show();
	//$("#"+noDataContentDiv).css('visibility', 'visible');
    /* $.ajax({
    	type: 'GET',
    	url: resourceUrl,
    	data : {                
            <portlet:namespace/>paramData : JSON.stringify(paramData)
        },
        cache: false,
    	success : function(data) {
    		hidePageLoader();
        
    		 $("#"+pageNumDiv).remove();
    		 $("#"+viewMoreFlagDiv).remove();
    		 $("#"+searchParamDiv).remove();
    		 $("#"+dataAvailableFlag).remove();
    		 $("#"+noDataMsg).remove();
    	    var div = document.getElementById(tabDataBody);
    	    if(pageNum == 1){
    	    	div.innerHTML = data;
    	    }else{
    	    	div.innerHTML += data;
    	    }
    	   
    	    var isDataAvailable=$("#"+dataAvailableFlag).html();
    	    var searchParamData = $("#"+searchParamDiv).html();
    	    if(isDataAvailable != "true"){
    	    	if (searchParamData != null && searchParamData != ""){
    	    		$("#"+searchDiv).show();
    	    		$("#"+noDataMsgDiv).html($("#"+noDataMsg).html());
    	    	}
    	    	
    	    	$("#"+tableListId).hide();
        		$("#"+downloadDiv).hide();
        		$("#"+viewMoreButton).hide();
        		$("#watchlistHasMoreDiv").hide();
    	    	
    	    	$("#"+noDataContentDiv).show();
    	    	$("#"+noDataContentDiv).css('visibility', 'visible');
    	    }else{
    	    	$("#"+tableListId).show();
        		$("#"+searchDiv).show();
        		$("#"+downloadDiv).show();
        		$("#"+viewMoreButton).show();
        		$("#watchlistHasMoreDiv").show();
        		$("#"+noDataContentDiv).hide();
    	    	$("#"+noDataContentDiv).css('visibility', 'hidden');
    	    }
    	    showHideViewMore(tabDivId, viewMoreButton, $("#"+pageNumDiv).html(), $("#"+viewMoreFlagDiv).html(), searchParamData);
    	    setUpCounterForDashboardList();
    	},
	    error : function(data){
	    	hidePageLoader();
	    	
	    	 $("#"+pageNumDiv).remove();
    		 $("#"+viewMoreFlagDiv).remove();
    		 $("#"+searchParamDiv).remove();
    		 $("#"+dataAvailableFlag).remove();
    		 $("#"+noDataMsg).remove();
    	     //console.log(data); 
    	    var div = document.getElementById(tabDataBody);
    	    
	    	div.innerHTML = data.responseText;
	    	$("#"+noDataMsgDiv).html($("#"+noDataMsg).html());
	    	$("#"+tableListId).hide();
    		$("#"+downloadDiv).hide();
    		$("#"+viewMoreButton).hide();
    		$("#watchlistHasMoreDiv").hide();
    		
	    	$("#"+noDataContentDiv).show();
	    	$("#"+noDataContentDiv).css('visibility', 'visible');
	    	
		 }
    	}); */
  }
    /* var dashboardWcm = <c:out value="${MYTOLL_WCM_DASHBOARD}" escapeXml="false"/>; */
	var getDraftShipmentURL = '<%=getDraftShipmentURL.toString()%>';
	var getSaveSearchList = '<%=getSaveSearchList.toString()%>';
	var deleteSearchFilter = '<%=deleteSearchFilter.toString()%>';
	var advancesearch = '<%=advancesearch.toString()%>';
	var carsMasterData = <c:out value="${carMasterData}" escapeXml="false"/>;
	debugger;
	console.log(carsMasterData);
	
<%-- 	var downloadAdavanceSearchResults = '<%=downloadAdavanceSearchResults.toString()%>';  --%>


  
function showHideViewMore(tabDivId, viewMoreButton, pageNum, showViewMore, searchParam) {
	if(showViewMore == "false"){
		$("#"+viewMoreButton).hide();
		$("#watchlistHasMoreDiv").hide();
	}else{
		document.getElementById(viewMoreButton).onclick = function(){ viewMore(tabDivId+'TabAnchor', pageNum, searchParam); } ;
	}
}

function viewMore(tab, pageNum, searchParam) {
	
	var searchObj;
	if (searchParam != null && searchParam != ""){
		searchObj = JSON.parse(searchParam);
	}

	loadSelectedList(tab, pageNum, searchObj);
}

function loadCarMake(){
	let dropdown = $('#carMake');
	dropdown.empty();
	dropdown.append('<option selected="true">Choose Car Make</option>');
	dropdown.prop('selectedIndex', 0);
	for ( var i = 0; i < carsMasterData.brands.length; i++) {
		var obj = carsMasterData.brands[i];
		var brandId = obj.brandId;
		var brandName = obj.brandName;
		dropdown.append($('<option></option>').attr('value', brandId).text(brandName));
	}
}

function loadCarModel(carMakeObj){
	showPageLoader();
	let dropdown = $('#carModel');
	var carId = carMakeObj.value;
	dropdown.empty();
	dropdown.append('<option selected="true">Choose Car Model</option>');
	dropdown.prop('selectedIndex', 0);
	for ( var i = 0; i < carsMasterData.brands.length; i++) {
		var obj = carsMasterData.brands[i];
		var brandId = obj.brandId;
		if(brandId == carId){
			for ( var j = 0; j < obj.model.length; j++) {
				var modelObj = obj.model[j];
				var modelId = modelObj.modelId;
				var modelName = modelObj.modelName;
				
				dropdown.append($('<option></option>').attr('value', modelId).text(modelName));
			}
		}
	}
	hidePageLoader();
}

function loadCarVariant(carModelObj){
	showPageLoader();
	let dropdown = $('#carVariant');
	var carModelId = carModelObj.value;
	alert(carModelId);
	dropdown.empty();
	dropdown.append('<option selected="true">Choose Car Variant</option>');
	dropdown.prop('selectedIndex', 0);
	for ( var i = 0; i < carsMasterData.brands.length; i++) {
		var obj = carsMasterData.brands[i];
		//var brandId = obj.brandId;
		//if(brandId == carId){
			for ( var j = 0; j < obj.model.length; j++) {
				var modelObj = obj.model[j];
				var modelId = modelObj.modelId;
				if(modelId == carModelId){
					alert(modelId);
					for ( var k = 0; k < modelObj.variants.length; k++) {	
						var variantObj = modelObj.variants[k];
						var fuelType = variantObj.fuelType;
						var variantId = variantObj.variantId;
						var variantName = variantObj.variantName;
						
						dropdown.append($('<option></option>').attr('value', variantId).text(variantName+" - "+fuelType));
					}
				}
			}
		}
	//}
	hidePageLoader();
}

/* function setUpCounterForDashboardList() {
	try {
	if(!$("#mywatchListCount").text() == "") {
		console.log("watchList: "+ $("#mywatchListCount").text());
	    if((($("#watchlistPageNum").text() -1)*20) < ($("#mywatchListCount").text())){
			$("#watchlist-count").text("1 - "+(($("#watchlistPageNum").text() - 1)*20)+ " of "+ $("#mywatchListCount").text() +" shipments watching");	
		} else {
			$("#watchlist-count").text("1 - "+($("#mywatchListCount").text())+ " of "+ $("#mywatchListCount").text() +" shipments watching");
		}
	} 

	if(!$("#mypickupListCount").text() == "") {
		console.log("pickupCount: "+ $("#mypickupListCount").text());
	    if((($("#pickupPageNum").text() -1)*20) < ($("#mypickupListCount").text())){
			$("#pickuplist-count").text("1 - "+(($("#pickupPageNum").text() - 1)*20)+ " of "+ $("#mypickupListCount").text() +" pickups");	
		} else {
			$("#pickuplist-count").text("1 - "+($("#mypickupListCount").text())+ " of "+ $("#mypickupListCount").text() +" pickups");
		}
	}

	if(!$("#mymanifestListCount").text() == "") {
		if((($("#manifestPageNum").text() -1)*20) < ($("#mymanifestListCount").text())){
			$("#manifestlist-count").text("1 - "+(($("#manifestPageNum").text() - 1)*20)+ " of "+ $("#mymanifestListCount").text() +" manifests");	
		} else {
			$("#manifestlist-count").text("1 - "+($("#mymanifestListCount").text())+ " of "+ $("#mymanifestListCount").text() +" manifests");
		}
	}
	
	} catch(e) {
		console.log("exception occured: "+e);
	}
} */

/* $("#searchManifestTable").click(function(){
    var searchObj = {};
    searchObj.manifestNameId = $("#manifestNameID").val();
    searchObj.fromDate = $("#manifestFromDate").val();
    searchObj.toDate = $("#manifestToDate").val();
    var manifestTollCarrier = $("#manifestTollCarrier").val();
    var manifestTollCarrierStr = "";
    if (null!= manifestTollCarrier && manifestTollCarrier.length > 0){
    	var manifestTollCarrierStr = manifestTollCarrier.toString();
    }
    searchObj.manifestTollCarrier = manifestTollCarrierStr;
    console.log(searchObj);
    loadSelectedList("manifestTabAnchor", "1", searchObj);
}); */

$( document ).ready(function() {
   // var params = (new URL(document.location)).searchParams;
   var params = window.location.search.split("=")[1];
    if(params && params == "draftshipment") {
                    $('#draftshipmentAnchor').trigger('click');
    } else {
    	loadSelectedList("watchlistTabAnchor", "1");
    }
    
    loadCarMake();
});

var partialsPath ='<%=request.getContextPath()%>/partials/';
</script>
<div id="create-manifest-placeholder"></div>
