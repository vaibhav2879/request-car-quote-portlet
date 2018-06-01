<!-- HTML for Saved Searches -->				
<div id="savedSearch" class="tab-pane fade">
<div id="saved-data-section" style="display: none">
<div id="loading" ></div>
<div id="content" ></div>
<div class="saved-search-counter"></div>
<div class="form-row">
<ul id="saved-search-list">
							
</ul>
<div id="search-result-data">	
<!-- <div class="content-count-title col-xs-12" style="padding-left: 40px;">
	<span class="total-counter"></span>
</div> -->
   <div class="saved-search-token clearfix">
      <div class="pull-left"><span class="total-counter pull-left"></span></div>
      <div class="pull-right"><a href='<portlet:resourceURL  id="downloadAdavanceSearchResults"/>'  class="download-link hidden-sm hidden-xs"><i class="ico-download"></i>download</a></div>                                                                         
   </div>  
    <table id="savedSearchDataDiv" class="dashboard-list">
		<thead class="hidden-xs" id="savedSearchThId">
		
		 </thead>
		 <tbody id="savedSearchTbodyId">

		 </tbody>
   </table>
   <div class="saved-search-options edit-view-btns">
   	<!-- <div class="clearfix"><span id="savedSearchCountdown"></span></div> -->
   	
	  <button class="edit-search savedSrchEditbtn hidden-xs" onclick="savedSearchJs.editSavedSearch()"><!-- <i class="edit-icon ico-pencil"></i> --><span id="edit-search-text"></span></button>
	 <!--  <div class="pull-right"> -->
	  <!-- <button class="delete-saved-search pull-left" style="border: 1px solid;" onclick="deletedSavedSearch()">Delete Saved Search</button> -->
	  <button class="edit-search pull-right" id="getMoreSavedRecord" onclick="savedSearchJs.viewMoreData()"></button>
	<!--   </div> -->
   </div>
   </div>
   
   </div>
     
</div>
	 <div id="no-saved-data-error-msg" class="emptyDataInfo" style="display:none;">
	      	<div class="emptyDataImg"></div>          
	        <%-- <p class="visitor-name">Hey ${userName}</p> --%>
	        <p class="visitor-msg" id="saved-data-error"></p>   
	 </div>
	 
</div>
<script id="saved-search-wcm-header-template" type="text/x-handlebars-template">
  <tr>
	<th>{{toll_shipment_no}}</th>
	<th class="senderRef" >{{reference_number}}</th>
	<th>{{milestone}}</th>
	<th>{{sender_location}}</th>
	<th>{{delivery_location}}</th>
	<th class="estimatedDeliveryDate" >{{estimated_delivery }}</th>
	<th>{{items}}</th>
</tr>
</script>

<script id="saved-search-list-template" type="text/x-handlebars-template">
  {{#each searches}}
  <li class="saved-search-li"><a class="current-saved-selection" onclick="savedSearchJs.getDataForSavedSearch(event,false,'{{this.SearchName}}')">
				{{this.SearchName}}
  </a>&nbsp;<a class="current-saved-deletion" onclick=savedSearchJs.deletedSavedSearch(event,'{{this.SearchId}}')>
<i class="delete-saved-icon ico-delete"></i>
</a></li>
  {{/each}}
</script>

<script id="saved-search-list-data-template" type="text/x-handlebars-template">
  {{#each results}}
  <tr onclick=savedSearchJs.redirectToDetailSearchPage(savedSearchJs.checkUndefinedAndNull('{{this.consignmentId}}'))>
					<td><label class="data-title visible-xs">Toll shipment no.</label>{{this.consignmentNumber}}</td>
					<td><label class="data-title visible-xs">References</label>
                     {{#if this.refrenceList}}
                      {{#each this.refrenceList}}
                         <span>{{#sentenceCase}}{{this}}{{/sentenceCase}}</span>
                       {{/each}}
                      {{#if this.showMoreReferences}} <span>more...</span> {{/if}}
                    {{/if}}
                    </td>
					<td class="milestoneMob">
						<label class="data-title visible-xs"></label>
                        <i class="{{#getMilestoneIcon}}{{this.status}}{{/getMilestoneIcon}} ico-style flLeft hide-in-mob pdr2"></i>
                        <span>{{#getMilestoneText}}{{this.status}}{{/getMilestoneText}}</span>
                    </td>
					<td><label class="data-title visible-xs">Sender location</label>{{#titleCase}}{{this.senderLocation.suburb}}{{/titleCase}}&nbsp;&nbsp;{{#titleCase}}{{this.senderLocation.state}}{{/titleCase}}</td>
					<td><label class="data-title visible-xs">Delivery location</label>{{#titleCase}}{{this.recieverLocation.suburb}}{{/titleCase}}&nbsp;&nbsp;{{#titleCase}}{{this.recieverLocation.state}}{{/titleCase}}</td>
					<td><label class="data-title visible-xs">Estimated/Actual delivery</label>{{#dateAsPerMilestone}}{{this}}{{/dateAsPerMilestone}}</td>
					<td><label class="data-title visible-xs">Items</label>{{this.noOfItems}}</td>
  </tr>

  {{/each}}
</script>