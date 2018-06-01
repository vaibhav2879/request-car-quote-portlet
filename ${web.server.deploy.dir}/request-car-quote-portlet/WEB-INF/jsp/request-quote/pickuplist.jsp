<%@ include file="/WEB-INF/jsp/request-quote/init.jsp" %>


<!-- HTML for Pickup -->
<div id="mypickups" class="tab-pane fade">
   <div class="pickup-table-search-filter mobileViewSearchStyle" id="pickupSearchDiv">
	  <div class="row">
		 <div class="col-lg-1 hidden-md hidden-xs">&nbsp;</div>
	  </div>
	</div>
	
   <div class="content-title" id="pickupDownloadDiv">
   <div class="pull-left"><span id="pickuplist-count">
   </span></div>
		<%-- <span class="total-counter">${fn:length(pickupArray)} pickups</span> --%>
		<a href='<portlet:resourceURL id="downloadPickupResults"/>' class="download-link hidden-sm hidden-xs"></a>
   </div>
   
   <div id="pickupNoDataDiv" class="emptyDataInfo" style="display:none;visibility:hidden;">
      	<div class="emptyDataImg"></div>          
        <%-- <p class="visitor-name">Hey ${userName}</p> --%>
        <p class="visitor-msg" id="pickupNoDataMsgDiv">You have no booked pickups.</p>   
    </div>
     
   <table id="pickupTableId" class="dashboard-list">
		<thead class="hidden-xs">
			 <tr>
				<td>Vehicle Registration Number <br/>
					UP14AC2213
				</td>
				<td>Existing NCB(No Claim Bonus) % <br/>
					20
				</td>
				<td>
					Policy Expiry Date <br/>
					30/06/2018
				</td>
			 </tr>
			 <tr>
				<td>Your Car(Make) <br/>
					<select>
						<option>select</option>
						<option>Maruti Suzuki</option>
						<option>Hyundai</option>
						<option>Honda</option>
						<option>Toyota</option>
						<option>Nissan</option>
					</select> 
				</td>
				<td>Your Car(Model) <br/>
					<select>
						<option>select</option>
						<option>Wagon-R</option>
						<option>Alto</option>
						<option>Ciaz</option>
						<option>Swift</option>
						<option>Dizire</option>
					</select> 
				</td>
				<td>Your Car(Variant) <br/>
					<select>
						<option>select</option>
						<option>LX</option>
						<option>Lxi</option>
						<option>Vxi</option>
						<option>Zxi</option>
						<option>Vdi</option>
					</select> 
				</td>
			 </tr>
			 <tr>
				<td>Car Fuel Type <br/>
					<select>
						<option>select</option>
						<option>Petrol</option>
						<option>Diesel</option>
						<option>CNG</option>
						<option>LPG</option>
					</select> 
				</td>
				<td>City Of Registration <br/>
					<input type="text" />
				</td>
				<td>
					Car Manufactured Year <br/>
					<select>
						<option>select</option>
						<option>2018</option>
						<option>2017</option>
						<option>2016</option>
						<option>2015</option>
					</select> 
				</td>
			 </tr>
			 <tr>
				<td>Your Car's Estimated Value(IDV) <br/>
					<input type="text" /> 
				</td>
				<td>Email Id <br/>
					<input type="text" />
				</td>
				<td>
					Your Mobile Number <br/>
					<input type="text" /> 
				</td>
			 </tr>
		</thead>
		<tbody id="pickupDataTbody"> 
		 
	  </tbody>
   </table>
   
   <div class="manual-manifest pull-right" id="pickupHasMoreDiv" style="text-align: center;">
	    <button class="" style="margin-right: 0px" type="button" name="loadmore" id="pickupHasMoreButton">Get Quote
		    </button>
	</div>
   <div class="clearfix"></div>
</div>
