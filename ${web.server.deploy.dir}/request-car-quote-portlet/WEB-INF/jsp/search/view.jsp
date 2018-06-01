<%@ include file="/WEB-INF/jsp/search/init.jsp" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page contentType="text/html" isELIgnored="false"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui"%>
<%@ taglib prefix="portlet" uri="http://java.sun.com/portlet_2_0"%>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme"%>

<portlet:resourceURL id="saveSearch" var="saveSearch"></portlet:resourceURL>
<portlet:resourceURL id="clearAdvanceSearchResults" var="clearAdvanceSearchResults"></portlet:resourceURL>
<portlet:resourceURL id="downloadAdvanceSearchRecords" var="downloadAdvanceSearchRecords"></portlet:resourceURL>
<portlet:resourceURL id="advancesearchData" var="advancesearchData"></portlet:resourceURL>
<portlet:resourceURL id="getPageData" var="getPageData"></portlet:resourceURL>
<portlet:resourceURL id="deleteSearchFilter" var="deleteSearchFilter"></portlet:resourceURL>
<portlet:resourceURL id="loadDefaultView" var="loadDefaultView"></portlet:resourceURL>
<script type="text/javascript" src="<%=themeDisplay.getPathThemeJavaScript() %>/chosen.jquery.min.js"></script>
<% 
	boolean signedIn = themeDisplay.isSignedIn();
%>
<liferay-theme:defineObjects />
<portlet:defineObjects />

<div class="static-portlet-box target-003">
	<!-- <h3 class="portlet-heading"><liferay-ui:message key="trackTrace"/></h3> -->
	<%-- <div class="no-padding">
		<div class="smart-tab">
			<div class="search-tab clearfix">
					<ul>
			             <li class="current ">
				             <div class="left-box col-sm-6 col-md-6 brdr-btm-1px">
				             </div>
			             </li>
					</ul>
			</div>
		
			<div class="tab-content-c no-bottom-border">
				<jsp:include page="quickSearch.jsp" />
				 <jsp:include page="advanceSearch.jsp" />
			</div>
			<!-- <input type="text" placeholder="type to advance search"/><button onclick="loadAdvanceSearchData();" name="Advance Search" value="Advance Search">Advance Search</button> -->
	    </div>
	</div> --%>
	
	<div id="tab-groups">
	<div id="dashboard-features-info">
       <div class="features-info-container">
	        <ul class="nav nav-tabs" id="quick-advance-search-tab">
               <li id="quicksearch" class=" col-xs-6 col-sm-3 active pull-left"><a class="" href="#quicksearch" id="quicksearchTabAnchor"><%=(String)jsonwcmHtmlTitleOrHeaders.get("trackurshipment") %></a></li>			   
			        <%if(signedIn){ %>
							<li id="advancesearch" class="col-xs-6 col-sm-3 pull-left"><a class="" href="#advancesearch" id="advancesearchTabAnchor"><%=(String)jsonwcmHtmlTitleOrHeaders.get("advancesearch") %></a></li>     
						<%} %>
	        </ul>
            <div class="tab-content">
                
                <%@ include file="/WEB-INF/jsp/search/quickSearch.jsp" %>
                
                <%@ include file="/WEB-INF/jsp/search/advanceSearch.jsp" %>
                
            </div>
       </div>
	</div>
</div>
	
</div>
<div class="progress-bar-image hidden-def"></div>
<div id="searchResults"></div>

	<script type="text/javascript">
	var dashboardWcm = <c:out value="${MYTOLL_WCM_DASHBOARD}" escapeXml="false"/>;
	var saveSearch = "<%=saveSearch.toString() %>"
	var	clearAdvanceSearchResults = "<%=clearAdvanceSearchResults.toString() %>"
	var	downloadAdavanceSearchResults = "<%=downloadAdvanceSearchRecords.toString() %>"
	var	pageDataUrl  = "<%=getPageData.toString() %>"		
	var deleteSearchUrl = '<%=deleteSearchFilter.toString()%>';
	var loadDefaultView = "<%=loadDefaultView.toString()  %>" 
	var advanceSearchResult = {
			advancesearchUrl : "<%=advancesearchData.toString() %>"
		  }
	$("#quick-advance-search-tab li a").click(function(e){
        e.preventDefault();
        console.log("click on li");
        if(this.id == 'quicksearchTabAnchor') {
        	 $("#advancesearch").removeClass("active");
        	 $("#quicksearch").addClass("active");
        	 $(".track-advacnce-search").css("display", "none");
        	 $("#track-shipment").css("display", "block");
        	 $("#searchResults").css("display", "block");
        	 $("#advanceSearchResults").css("display", "none");
        } else {
        	 $("#quicksearch").removeClass("active");
        	 $("#advancesearch").addClass("active");
        	 if(!is_page_data_loaded) {
        		 get_page_data(); 
        	 }
        	 $(".track-advacnce-search").css("display", "block");
        	 $("#track-shipment").css("display", "none");
        	 $("#searchResults").css("display", "none");
        	 $("#advanceSearchResults").css("display", "block");
        }
    });
	var advanceSearchParams = {
			"customerid": "ACC-2014-0000079",
			"userid": "liferay@hcl.com",
			"noOfRecordToFetch": "20",
			"searchKeywords": ["2922248805", "2090300787"],
			"advanceSearch": true,
			"startRecord": 1,
			"advanceParams": {
				"senderName": ["Jack", "Mack"],
				"recieverName": ["Jack", "Mack"],
				"createFromDate": "12-05-2015",
				"createToDate": "20-05-2015",
				"senderLocation": ["Jack", "Mack"],
				"recieverLocation": ["Jack", "Mack"],
				"tollCarrier": ["Toll NQX | Toll Express", "Toll Intermodal"],
				"serviceType": ["DG General", "General"],
				"milestone": ["DELVERD", "SHPCRE"],
				"senderNameInclude": true,
				"receiverNameInclude": true,
				"senderLocationInclude": true,
				"receiverLocationInclude": true,
				"milestoneInclude": true
			}
		};
	
	function loadAdvanceSearchData() {
	        $.ajax({
	            url : advanceSearchResult.advancesearchUrl,
	            method: 'POST',
	        	dataType : 'JSON',
	            data: {"<portlet:namespace/>getadvanceSearchParams" : JSON.stringify(advanceSearchParams)},
	            success : function(data){
	            	$('#advanceSearchResults').text(JSON.stringify(data, null, 3));
	            	console.log(data);
	            },
	            fail : function(xhr){
	            	console.log("erriorrrrrrrrrr");
	                done([]);
	            }
	        });
	        }
	
	$( document ).ready(function() {
	    var quicksearchtab = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.quickSearchTab;
	    var advsearchtab = dashboardWcm.MYTOLL_WCM_DASHBOARD.dashboard.Labels.advancedSearch.advanceSearchTab;
		$("#quicksearchTabAnchor").text(quicksearchtab);
		$("#advancesearchTabAnchor").text(advsearchtab);
		if(window.location.href.indexOf("#?t=as") !== -1){			
			$('#advancesearchTabAnchor').click();
		}

	});

	
			


	</script>