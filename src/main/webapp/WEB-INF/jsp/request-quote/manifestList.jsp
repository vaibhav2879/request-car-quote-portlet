<%@ include file="/WEB-INF/jsp/request-quote/init.jsp" %>
<portlet:defineObjects />
<portlet:resourceURL var="loadMoreRecords" id="loadMoreRecords"/>
<portlet:resourceURL escapeXml="false" id="combinedJSON" var="combinedJSONURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="createManifest" var="createManifestURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="getManifest" var="getManifestURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="printShipment" var="printShipmentURL"></portlet:resourceURL>

<portlet:resourceURL escapeXml="false" id="printManifest" var="printManifestURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="savePDFPrintLabel" var="savePDFPrintLabelURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="savePDFPrintManifest" var="savePDFPrintManifestURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="savePDFPrintShipment" var="savePDFPrintShipmentURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="getUserSettingsList" var="getUserSettingsListURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="savePDFPrintShipmentWithLabel" var="savePDFPrintShipmentWithLabelURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="printShipmentWithLabel" var="printShipmentWithLabelURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="printLabel" var="printLabelURL"></portlet:resourceURL>
<portlet:resourceURL escapeXml="false" id="functionSettingInSession" var="functionSettingInSessionUrl"></portlet:resourceURL>

<script type="text/javascript" src="<%=request.getContextPath()%>/js/watch-list/manifest.js"></script>


<script>
var shipmentDataResourceUrl = '<%=combinedJSONURL.toString()%>';
var createManualManifestURL = '<%=createManifestURL.toString()%>';
var getManifestURL = '<%=getManifestURL.toString()%>';
var manifestPageURL = '${navigateToManifest}';
var searchNamespace = '<portlet:namespace/>';

//print 
	var printCloseManifestJSURL = '<%=printManifestURL.toString()%>';

	var printLabelManifestJSURL = "<%=savePDFPrintLabelURL.toString()%>";
	var printLabelManifestJSURLAppend = "${tempResourceMethodURL}";

	var redirectToShipmentUrl ="${dashboardShipmentUrl}";
	
	var printShipmentWithLabelJSURL = "<%=savePDFPrintShipmentWithLabelURL.toString()%>"; 
	var printShipmentWithLabelJSURLAppend = "${tempResourceMethodShipmentWithLabelURL}";
	
	var printManifestJSURL = "<%=savePDFPrintManifestURL.toString()%>";
	var printManifestJSURLAppend = "${tempResourceMethodManifestURL}";


	var printShipmentJSURL = "<%=savePDFPrintShipmentURL.toString()%>";
	var printShipmentJSURLAppend = "${tempResourceMethodShipmentURL}";

	var getThermalSetting = "<%=getUserSettingsListURL.toString()%>"; 
	var getFunctionalSetting = "<%=functionSettingInSessionUrl.toString()%>";
	var printLabelURL = "<%=printLabelURL%>";
	
	var manifestNamespace = '<portlet:namespace/>';
</script>
<!-- HTML for Manifest -->
<div id="manifest" class="tab-pane fade">
	<div class="manifest-table-search-filter mobileViewSearchStyle" id="manifestSearchDiv">
	  
   </div> 
   
   <div class="content-title" id="manifestDownloadDiv">
   <div class="pull-left"><span id="manifestlist-count">
  
   </span></div>
		<a href='<portlet:resourceURL id="downloadManifestSearchResults"/>' class="download-link hidden-sm hidden-xs"></a>
   </div>
   
   <div id="manifestNoDataDiv" class="emptyDataInfo" style="display:none;visibility:hidden;">
      	<div class="emptyDataImg"></div>          
        <%-- <p class="visitor-name">Hey ${userName}</p> --%>
        <p class="visitor-msg" id="manifestNoDataMsgDiv">You have no manifests.</p>   
    </div>

   <table id="manifestTableId" style="table-layout: fixed;" class="dashboard-list">
	  <thead class="hidden-xs">	 
		 <tr>
			<td>Your Vehicle Registration Number <br/>
				<input type="text" id="carRegNo" name="carRegNo"> </td>
			<td>Policy Expiry Date <br/><input type="date" id="expiryDate" name="expiryDate"> </td>
		 </tr>
		 <tr>
			<td>Claim In Previous Policy? <br/>
				Yes&nbsp;<input type="radio" id="prevClaim" name="prevClaim" value="Yes" />&nbsp;&nbsp;
				No&nbsp;<input type="radio" id="prevClaim" name="prevClaim" value="No" />
			</td>
			<td>Previous No Claim Bonus(NCB %)? <br/>
				<select id="prevNCB" name="prevNCB">
					<option>0</option>
					<option>20</option>
					<option>25</option>
					<option>35</option>
					<option>45</option>
					<option>50</option>
					<option>55</option>
					<option>65</option>
				</select> 
			</td>
		 </tr>
		 <tr>
			<td>Email Id <br/><input type="email" id="emailId" name="emailId"></td>
			<td>Mobile No <br/><input type="tel" id="phoneNo" name="phoneNo"/> </td>
		 </tr>
	  </thead>
	  <tbody id="manifestDataTbody">	 
		
	  </tbody>
   </table>
   
	<div class="manual-manifest pull-right" style="text-align: center;" id="manifestHasMoreDiv">
	    <button class=""  type="button" name="loadmore" id="manifestHasMoreButton">Continue</button>
	</div>
	<div class="clearfix"></div>		
	<!-- 		   
   <div class="manual-manifest">
   		
   </div> -->
   
    <div id="loading" ></div>
	<div id="content" ></div>
</div>
