<%@ include file="/WEB-INF/jsp/request-quote/init.jsp"%>
<%-- <%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%> --%>

<portlet:defineObjects />

<!-- HTML for Manifest -->
<div id="watchlist" class="tab-pane fade active in">

	<div class="content-title clearfix" id="watchlistDownloadDiv">
	    <div class="pull-left"><span id="watchlist-count"></span></div>   
		<%-- <a href='<portlet:resourceURL id="downloadManifestSearchResults"/>' class="download-link hidden-sm hidden-xs"><i class="ico-download"></i>download</a> --%>
   </div>
   
   <!--  <div class="saved-search-token hidden-xs">
      <div class="pull-left"><span id="watchlist-count"></span></div>   
   </div>  -->
   
   <div id="watchlistNoDataDiv" class="emptyDataInfo" style="display:none;visibility:hidden;">
      	<div class="emptyDataImg"></div>          
        <%-- <p class="visitor-name">Hey ${userName}</p> --%>
        <p class="visitor-msg" id="watchlistNoDataMsgDiv">Your watchlist is empty.</p>
    </div>
			   
   <%-- <table id="watchlistTableId" style="table-layout: fixed;"> --%>
   <table id="watchlistTableId" class="">
			 <tr>
				<td>Renew DIP Policy</td>
				<td>Renew Other Insurance Company Policy</td>
				<td>Brand New Car Policy</td>
			</tr>
			<tr>
				<td><input type="radio" id="policyReqType" name="policyReqType" value="1" /></td>
				<td><input type="radio" id="policyReqType" name="policyReqType" value="2" /></td>
				<td><input type="radio" id="policyReqType" name="policyReqType" value="3" /></td>
			</tr>
		<tbody id="watchlistDataTbody">
			
		</tbody>
	</table>
	
	<div class="manual-manifest" style="text-align: center;" id="watchlistHasMoreDiv"> 
			<button class="" type="button" name="loadmore" id="watchlistHasMoreButton">
			Continue</span>
		</button>
		<div class="clearfix"></div>
	</div>

	<div id="loading"></div>
	<div id="content"></div>
</div>
