<%@ include file="/WEB-INF/jsp/watch-list/init.jsp" %>
<%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%>
<portlet:defineObjects />
<portlet:resourceURL var="loadMoreRecords" id="loadMoreRecords"/>

<%--  <portlet:resourceURL escapeXml="false" id="getDraftShipment" var="getDraftShipmentURL"></portlet:resourceURL> --%>
<portlet:resourceURL escapeXml="false" id="deleteDraftShipment" var="deleteDraftShipmentURL"></portlet:resourceURL>
<script>
  <%-- var getDraftShipmentURL = '<%=getDraftShipmentURL.toString()%>'; --%>
var deleteDraftShipmentURL = '<%=deleteDraftShipmentURL.toString()%>';
</script>
<!-- HTML for Draft Shipment -->        
<div id="draft-shipment" class="tab-pane fade">
  <!--  <div class="content-title draftshipcountDiv">
    <span class="total-counter"><span class="draftshipCount">0</span> Draft Shipments</span>
   </div> -->
    <div class="saved-search-token clearfix">
      <div class="pull-left"><span id="totaldraftshipment-count" class="totaldraftshipment-count"></span></div>   
   </div> 
  <div id="darftNoDataDiv" class="emptyDataInfo" style="display:none;">
        <div class="emptyDataImg"></div>          
        <%-- <p class="visitor-name">Hey ${userName}</p> --%>
        <p class="visitor-msg" id="darftNoDataDivcont">Server error while fetching data. Please try again</p>   
    </div> 
   <table id="draftTableId">
    <thead class="hidden-xs">  
     <tr id="draftTableHead" class="dashboard-list">
     </tr>
    </thead>
    <script id="draftTableHead-template" type="text/x-handlebars-template">
      <th>{{draftShipment.tableheading.toll_carrier}}</th>
      <th>{{draftShipment.tableheading.sender}}</th>
      <th>{{draftShipment.tableheading.receiver}}</th>
      <th>{{draftShipment.tableheading.dispatch_date}}</th>
      <th></th>
      <th></th>
    </script>

    <tbody id="draftShipList" class="dashboard-list">
    </tbody>
    <script id="draftShipList-template" type="text/x-handlebars-template">
      {{#each this.draftdata}}
      <tr id="draft{{this.shipmentId}}" onclick="redirectToshipmentPage({{this.shipmentId}})">
      <td><label class="data-title visible-xs">Toll carrier</label>{{this.tollCarrierName}}</td>
      <td><label class="data-title visible-xs">Sender</label>{{this.senderAddress.companyName}}</td>
      <td><label class="data-title visible-xs">Receiver</label>{{this.receiverAddress.companyName}}</td>
      <td><label class="data-title visible-xs">Dispatch date</label>{{changeformatDate this.dispatchDate}}</td>
      <td class="tableFullBtnMob hidden-xs"><!-- <label class="data-title visible-xs"></label> --><a class="btnleftMob" onclick="redirectToshipmentPage({{this.shipmentId}})">{{this.buttonLabel}}</a></td>
      <td  class="draftCloseMob"><!-- <label class="data-title visible-xs"></label> --><span class="draftshipDel" onclick="event.stopPropagation(); deleteShipmentById({{this.shipmentId}}); window.event.cancelBubble=true;"><i class="ico-delete"></i></span></td>                              
  </tr>
  {{/each}}

    </script>
   </table>
   



   
   
   <div class="manual-manifest draftviewmorediv"  id="draftHasMoreDiv">
    <div class="draftviewmorediv_l pull-left"><!-- <span id="totaldraftshipment-countdown" class="totaldraftshipment-count"></span> --></div>
    <div class="draftviewmorediv_r pull-right"><button class="pull-right"  type="button" name="loadmore" id="draftHasMoreButton" onclick="draftViewmoreclick()">View More</button></div>
    <div class="clearfix"></div>

  </div>
  <div class="clearfix"></div>
   <!-- <button class="pull-left" onclick="getDraftShipmentFunction()">Draft Shipment</button>      ******for test Draft Shipment****-->
   <!-- <button class="pull-left" onclick="deleteShipmentById(1246)">Delete Draft Shipment</button> -->
           
</div>

