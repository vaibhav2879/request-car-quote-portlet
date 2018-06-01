<div class="track-advacnce-search track-shipment-dashboard content-box boxShad advsearchmaro">	
	<div class="track-advacnce-search" id="wrapper-advance-search" style="display:none" >
			
		<div id="advance-search">
			<div id="searchBannerMob" class="hidden-md hidden-lg">
				<div class="track-banner mobile searchBannerMob_img"></div>
				<div class="searchBannerMob_con">ADVANCED SEARCH</div>
			</div>

		  	<div id="savedsrchTopNoDataDiv" class="emptyDataInfo" style="display:none;">
				<div class="emptyDataImg"></div>          
				<%-- <p class="visitor-name">Hey ${userName}</p> --%>
				<p class="visitor-msg" id="savedsrchTopNoDatacont"></p>   
			</div>

			<div class="form-row" id="saved-search-row">
				<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12 mobpadding0">
					<div class="select-label-grp">
						<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="savedSearchPopover"></i>
				
						<div class="custom-dropdown" id="saved-search">
							<div class="label-wrapper">
								<input type="hidden" name="saved-search-value" id="saved-search-value" value="">
								<input type="text" class="current-selected" maxlength="40" name="placeholder-period" id="current-saved-search" readonly="readonly" tabindex="0" />
								
										<a class="toggler"><i class="ico-arrow-down-green"></i></a>
							</div>
							<div class="dropdown-list">
								<ul class="dropdown-list-ul" id="advSecSavedSecDropdown">
								
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="track-banner hidden-xs" ></div>
		
			</div>
			<div class="hidden-xs">			
				<div class="form-row">
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">							
						<div>
							<label id="adl_referenceNumber"></label>
							<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="refPopover"></i>
							<div class="input-label-grp">
								<input type="text" name="reference-number" id="reference-number" maxlength="40">
								<span class="add-data"><span>+</span></span>
								<ul id="reference-number-list">
										
								</ul>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">
						<label id="adl_sender"></label>
							<div class="input-label-grp input-switch-label">
								<label class="switch chk_container" tabindex="0">
									<input type="checkbox" id="include-exclude-sender" class="switch-input" tabindex="-1" >
									<span class="checkmark"></span>
									<span class="adl_exclude"></span>
									
								</label>
								<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="senderPopover"></i>
							</div>
							<div class="input-label-grp">
								<input type="text" name="sender-name" id="sender-name" maxlength="40">
								<span class="add-data"><span>+</span></span>
								<ul id="sender-name-list">
										
								</ul>
							</div>
					</div>
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">
							<label id="adl_receiver"></label>
							<div class="input-label-grp input-switch-label">
									<label class="switch chk_container" tabindex="0">
										<input type="checkbox" id="include-exclude-receiver" class="switch-input" tabindex="-1" >
										<span class="checkmark"></span> 							
										<span class="adl_exclude"></span>
										
									</label>
									<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="receiverPopover"></i>
							</div>
							<div class="input-label-grp">
									<input type="text" name="receiver-name" id="receiver-name" maxlength="40">
									<span class="add-data"><span>+</span></span>
									<ul id="receiver-name-list" >
											
									</ul>
							</div>
					</div>
				</div>
		
				<div class="form-row">
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">
						<label id="adl_shipmentCreatedDate"></label>				
						<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="createShipmentPopover"></i>
						<div class="date-box">
							<ul class="thin-tab">
								<li class="col-lg-3 col-sm-3 col-md-3 col-xs-3 tab active" >
									<label id="adl_datePeriod"></label>
								</li>
								<li class="col-lg-3 col-sm-3 col-md-3 col-xs-3 tab" >
									<label id="adl_dateRange"></label>
								</li>
								<li class="col-lg-6 col-sm-6 col-md-6 col-xs-6 search-input-date-period" >
									<div class="search-select-label-grp select-label-grp">
										<div class="custom-dropdown" id="period-selector" data-placeholder="">
											<div class="label-wrapper">
												<input type="hidden" name="period" id="period" value="000">
												<input type="text" class="current-selected" name="placeholder-period" placeholder="Today" readonly="readonly" tabindex="0" />
												<a class="toggler"><i class="ico-arrow-down-green"></i></a>
											</div>
											<div class="dropdown-list">
												<ul class="dropdown-list-ul"></ul>
											</div>
										</div>
									</div>
								</li>
								<li class="col-lg-6 col-sm-6 col-md-6 col-xs-6 search-input-date-range" >
									<div class="input-label-grp right-align">
										
										<div class="dateRangeDetails">
											<i class="ico-date-range field-icon" ></i>
											<label id="adl_dateTo"></label>
											<input id="advsrchToDate" type="text" placeholder="dd-mm-yyyy" readonly/>
											
										</div>		
										<div class="dateRangeDetails">
											<i class="ico-date-range field-icon" ></i>
											<label id="adl_dateFrom"> </label>
											<input id="advsrchFromDate" type="text" placeholder="dd-mm-yyyy" class="fromDateValidation" readonly/>
											
										</div>							
									</div>
								</li>
							</ul>
						</div>				
				
					</div>
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12 location">
							<label id="adl_senderLocation"></label>
							<div class="input-label-grp input-switch-label">
									<label class="switch chk_container" tabindex="0">
										<input type="checkbox" id="include-exclude-senderLocation" class="switch-input" tabindex="-1" >
										<span class="checkmark"></span> 							
										<span class="adl_exclude"></span>
										
									</label>
									<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="senderLocPopover"></i>
							</div>
							<div class="input-label-grp">
									<input type="text" name="sender-location-value" id="sender-location-value" maxlength="0">
									<span class="add-data" id="sender-loc-add-op" >
											<i class="ico-arrow-down-green"></i>
											<div class="up-arrow-head" ></div>
										
									</span>
									
									<ul id="sender-loc-list" >
											
									</ul>
							</div>	
					</div>
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12 location">
							<label id="adl_receiverLocation"></label>
							<div class="input-label-grp input-switch-label">
									<label class="switch chk_container" tabindex="0">
										<input type="checkbox" id="include-exclude-receiverLocation" class="switch-input" tabindex="-1" >
										<span class="checkmark"></span> 							
										<span class="adl_exclude"></span>
										
									</label>
									<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="receiverLocPopover"></i>
							</div>
							<div class="input-label-grp">
									<input type="text" name="receiver-location-value" id="receiver-location-value" maxlength="0">
									<span class="add-data" id="receiver-loc-add-op" >
											<i class="ico-arrow-down-green"></i>
											<div class="up-arrow-head" ></div>
									</span>
									
									<ul id="receiver-loc-list"  >
											
									</ul>
							</div>
					</div>	
					<div id="sender-receiver-loction-editor" data-type="">
					
						<div>
							<!-- <span class="close" >^</span> -->
						
							<div class="form-row">
								<div>
									<div class="col-lg-3 col-sm-12 col-md-3 col-xs-12">
										<label id="adl_suburb"></label>                               
										<div class="input-label-grp">
												<input type="text" name="suburb" maxlength="40" id="suburb">
												<span class="add-data"><span>+</span></span>
												<ul id="suburb-list">
														
												</ul>
										</div>
									</div>
									<div class="col-lg-3 col-sm-12 col-md-3 col-xs-12">
											<label id="adl_state"></label>                                
											<div class="input-label-grp">
													<input type="text" name="state" maxlength="40" id="state">
													<span class="add-data"><span>+</span></span>
													<ul id="state-list">
															
													</ul>
											</div>
									</div>
									<div class="col-lg-3 col-sm-12 col-md-3 col-xs-12">
											<label id="adl_postcode"></label>                             
											<div class="input-label-grp">
													<input type="text" name="postCode" maxlength="40" id="postCode">
													<span class="add-data"><span>+</span></span>
													<ul id="postCode-list">
																
													</ul>
											</div>
									</div>
									<div class="col-lg-3 col-sm-12 col-md-3 col-xs-12">
											<label id="adl_country"></label>                              
											<div class="input-label-grp">
													<input type="text" name="country" maxlength="40" pattern="[A-Za-z]*" id="country">
													<span class="add-data"><span>+</span></span>
													<ul id="country-list">
															
													</ul>
											</div>
									</div>
								</div>	
								<div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
									
									<h4 id="adv-max-filter"></h4>
								</div>
							</div>
							
						</div>

					</div>

				</div>		
			
				<div class="form-row ms-row">
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">
						<label id="adl_tollCarrier"></label>

						<div class="input-label-grp input-switch-label">
							<label class="switch chk_container" tabindex="0">
								<input type="checkbox" id="include-exclude-toll-carrier" class="switch-input" tabindex="-1" >
								<span class="checkmark"></span> 							
								<span class="adl_exclude"></span>
								
							</label>
							<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="tollCarrierPopover"></i>
						</div>				
				
						<div class="select-label-grp">
							<div class="custom-dropdown" id="ms-carrier">
								<div class="label-wrapper">
									<input type="hidden" name="ms-carrier-value" id="ms-carrier-value" value="">
									<input type="text" class="current-selected" placeholder="Select carriers" maxlength="40" name="placeholder-period" id="current-ms-carrier" readonly="readonly" tabindex="0" />
									
											<a class="toggler"><i class="ico-arrow-down-green"></i></a>
										</div>
										<div class="dropdown-list">
											<ul class="dropdown-list-ul" id="ms-carrier-ddl">
											
											</ul>
								</div>
							</div>
						</div>
						<div class="input-label-grp">
							<ul id="carrier-list">
												
							</ul>
						</div>					
				
					</div>
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">
						<label id="adl_serviceType"></label>
						<div class="input-label-grp input-switch-label">
								<label class="switch chk_container" tabindex="0">
									<input type="checkbox" id="include-exclude-server-type" class="switch-input" tabindex="-1" >
									<span class="checkmark"></span> 							
									<span class="adl_exclude"></span>
									
								</label>
								<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="serviceTypePopover"></i>
						</div>
				
						<div class="select-label-grp">
							<div class="custom-dropdown" id="ms-service">
								<div class="label-wrapper">
									<input type="hidden" name="ms-service-value" id="ms-service-value" value="">
									<input type="text" class="current-selected" placeholder="Select service type" maxlength="40" name="placeholder-period" id="current-ms-service" readonly="readonly" tabindex="0" />
									
											<a class="toggler"><i class="ico-arrow-down-green"></i></a>
										</div>
										<div class="dropdown-list">
											<ul class="dropdown-list-ul" id="ms-service-ddl">
											
											</ul>
								</div>
							</div>
						</div>
						<div class="input-label-grp">
							<ul id="service-list">
												
							</ul>
						</div>					
					</div>
					<div class="col-lg-4 col-sm-12 col-md-4 col-xs-12">
						<label id="adl_milestone"></label>
						<div class="input-label-grp input-switch-label">
							<label class="switch chk_container" tabindex="0">
								<input type="checkbox" id="include-exclude-milestone" class="switch-input" tabindex="-1" >
								<span class="checkmark"></span> 							
								<span class="adl_exclude"></span>
								
							</label>
							<i class="icon ico-not-found mytoll-tip pull-right" data-toggle="popover" data-placement="top" id="milestonePopover"></i>
						</div>
						<div class="select-label-grp">
							<div class="custom-dropdown" id="ms-milestone">
								<div class="label-wrapper">
									<input type="hidden" name="ms-milestone-value" id="ms-milestone-value" value="">
									<input type="text" class="current-selected" placeholder="Select milestones" maxlength="40" name="placeholder-period" id="current-ms-milestone" readonly="readonly" tabindex="0" />
									
											<a class="toggler"><i class="ico-arrow-down-green"></i></a>
										</div>
										<div class="dropdown-list">
											<ul class="dropdown-list-ul" id="ms-milestone-ddl">
											
											</ul>
								</div>
							</div>
						</div>
						<div class="input-label-grp">
							<ul id="milestone-list">
												
							</ul>
						</div>			
					</div>
				</div>
						
			</div>
						
		</div>		
		<div class="form-row">
			<button class="primary btn_adv_search" id="get-advance-search"></button>
			<button class="pull-right btn-reset" id="reset-search"> 
					<i class="ico-routing-details"></i>
					Clear
					
			</button>
		</div>		
	</div>

	<div id="error-box" >

	</div>
</div>
</div>
<div id="advanceSearchResults">
<div class="result-section" id="advSearchResultsdiv" style="display: none;">
					<div id="dashboard-features-info">
						<div class="features-info-container">
							<ul class="nav nav-tabs" id="featuresTab">
								<li class="active"><span id="advSearchRelClose">
										<span class="ico-cancelled tab-cnc"></span>
								</span> <span class="ico-loading"></span></li>
							</ul>
						</div>
						<div class="tab-content clearfix" id="advscrhTabContentdiv" style="display: none;">

							<div class="clearfix quick-srch-results">
								<div class="content-title">
								<div class="advheadCol1"><span class="total-counter advscrhTotalCounter"></span></div>
								<div class="advheadCol2">
								<a href='<portlet:resourceURL  id="downloadAdvanceSearchRecords"/>'  class="download-link hidden-sm hidden-xs"><i class="ico-download"></i>download</a></div>
								<div class="advheadCol3 hidden-xs"> 
									<a onclick="advsrchSavedSearch()"><span
										class="save-search-download-link advSrchSaveBtn" id="adl_advseavedsrchBtn"></span></a>
								</div>
								<div class="advheadCol4 hidden-xs" id="savedSearchCount" data-toggle="popover" data-placement="top" style="display: none;">
								</div>
									 
									<div class="clearfix"></div>
								</div>

								<table border="0" width="100%" id="tbl_adv_search_result">
									<thead id="adv-search-result-header" class="hidden-xs">
										<!-- <tr class="grid-header hide-in-mob">
											<th><span class="hide-in-mob">Toll&nbsp;shipment&nbsp;no.</span></th>
											<th class="hide-in-mob">Reference&nbsp;Number</th>
											<th class="hide-in-mob"  width="20%">Milestone</th>
											<th>Sender&nbsp;location</th>
											<th>Delivery&nbsp;location</th>
											<th>Estimated&nbsp;delivery</th>
											<th class="items">Items</th>
										</tr> -->
									</thead>
									<tbody id="tblAdvSerhResult">

									</tbody>
	<script id="tblHeaderAdvSerhResult-template" type="text/x-handlebars-template">
			<tr class="grid-header hide-in-mob">
											<th><span class="hide-in-mob">{{toll_shipment_no}}</span></th>
											<th class="hide-in-mob senderRef">{{reference_number}}</th>
											<th class="hide-in-mob">{{milestone}}</th>
											<th>{{sender_location}}</th>
											<th>{{delivery_location}}</th>
											<th class="estimatedDeliveryDate" >{{estimated_delivery}}</th>
											<th class="items">{{items}}</th>
			  </tr>
	 </script>									
	<script id="tblAdvSerhResult-template" type="text/x-handlebars-template">
		{{#each results}}
			<tr onclick=redirectToDetailSearchPage(('{{this.consignmentId}}'))>
			<td><label class="data-title visible-xs">Toll shipment number</label>{{this.consignmentNumber}}</td>
			<td><label class="data-title visible-xs">Reference number</label>
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
			<span class="status-content hide-in-mob">{{#getMilestoneText}}{{this.status}}{{/getMilestoneText}}</span>

			</td>
			<td><label class="data-title visible-xs">Sender location</label>{{#titleCase}}{{this.senderLocation.suburb}}{{/titleCase}}&nbsp;&nbsp;{{#titleCase}}{{this.senderLocation.state}}{{/titleCase}}</td>
			<td><label class="data-title visible-xs">Delivery location</label>{{#titleCase}}{{this.recieverLocation.suburb}}{{/titleCase}}&nbsp;&nbsp;{{#titleCase}}{{this.recieverLocation.state}}{{/titleCase}}</td>
			<td><label class="data-title visible-xs">Estimated delivery</label>{{#dateAsPerMilestone}}{{this}}{{/dateAsPerMilestone}}</td>
			<td><label class="data-title visible-xs">Items</label>{{this.noOfItems}}</td>
			</tr>

{{/each}}
           
	 </script>										
													</table>
							</div>

							<div class="manual-manifest draftviewmorediv pull-right"
								id="">
								<!-- <div class="advSrchTotalCounter">
									<span class="total-counter advscrhTotalCounter"></span>
									<div class="clearfix"></div>
								</div> -->

								<button class="pull-right getMoreAvdSearch" 
									type="button" name="loadmore" id="getMoreAvdSearch"
									onclick="viewMoreData()"></button>
								<button class="pull-left advSrchEditbtn hidden-xs"
									 type="button" name="loadmore"
									id="advSchHasEditButton" onclick="scrollToTop()"></button>
								<div class="clearfix"></div>

							</div>

						</div>
						<div class="tollSaveSearchPopup" style="display: none;">
								<div class="tollSaveSearch-wrap">
									<div class="tollSaveSearch-main">
										<a class="tollSaveSearch-close"><i class="ico-delete"></i></a>
										<header>
											<h2 id="adl_saveSearch"></h2>
										</header>
										<div >
											<div >
												<div class="input-label-grp">
													<div id="adl_saveSearchName" class="pull-left"></div>
                                                    <div class="ifEditSavednameDiv focused pull-right">
													<input type="checkbox" name="ifEditSavedname" id="ifEditSavedname">
													<label id="adl_savedSearchChangeName" for="ifEditSavedname"></label>
												</div>
													<input type="text" name="advSave-search" id="advSaveSearch" maxlength="50" placeholder="" value="" class="advSavedSearch-error">
													<div class="error-msg" id="advSaveSearch-errorMg"></div>
												</div>
										
											</div>
											<div class="alignleft">
												<button class="advSrchSavebtn" onclick="advSrchSaveBtnclick()" id="advSrchSaveBtn">
														<button class="advSrchSavebtn" id="advSrchCancelBtn">CANCEL</button>

											</div>



									</div>
								</div>
							</div>
						
					</div>
					<div id="advScrhNoDataDiv"> 
							<div class="advNodatasaveSearch pull-right"> 
							<a onclick="advsrchSavedSearch()"><span
										class="save-search-download-link advSrchSaveBtn" data-toggle="popover" data-placement="top">SAVE
											SEARCH </span></a></div>
							<div class="clearfix"></div>
							<div class="emptyDataImg"></div> <p class="visitor-msg" id="advScrhNoDataDivCon"></p> </div>
			</div>	
			</div>		

