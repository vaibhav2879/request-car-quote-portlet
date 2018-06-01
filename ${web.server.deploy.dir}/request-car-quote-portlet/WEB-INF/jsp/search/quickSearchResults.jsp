<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page contentType="text/html" isELIgnored="false"%>
<%@ taglib prefix="portlet" uri="http://java.sun.com/portlet_2_0"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%>
<%@ page import="javax.portlet.PortletSession" %>
<%@ page import="com.tollgroup.mytoll.ces.model.search.SearchResponse" %>

<portlet:defineObjects />

<c:if test='${not empty portletSession.getAttribute("quickSearchResponse", PortletSession.APPLICATION_SCOPE)}'>
	 <c:set var="quickSearchResponse" value='${portletSession.getAttribute("quickSearchResponse", PortletSession.APPLICATION_SCOPE)}'></c:set>
</c:if>
<c:if test='${not empty portletSession.getAttribute("hasSearchResults", PortletSession.APPLICATION_SCOPE)}'>
	 <c:set var="hasSearchResults" value='${portletSession.getAttribute("hasSearchResults", PortletSession.APPLICATION_SCOPE)}'></c:set>
</c:if>
<c:if test='${not empty portletSession.getAttribute("expandCollapseIndicator", PortletSession.APPLICATION_SCOPE)}'>
	 <c:set var="expandCollapseIndicator" value='${portletSession.getAttribute("expandCollapseIndicator", PortletSession.APPLICATION_SCOPE)}'></c:set>
</c:if>

<c:if test="${not empty quickSearchResponse}">
<portlet:renderURL var="clearResultsUrl">
	<portlet:param name="searchMode" value="clear-results" />
</portlet:renderURL>
<div id="dashboard-features-info">
	<div class="features-info-container">
		 <ul class="nav nav-tabs" id="featuresTab">
			 <li class="active">
			 	<a class="clear-srch-res relativePos" id="clear-srch-res" onclick="<portlet:namespace/>clearResults('${clearResultsUrl}');">
			 		<span class="ico-cancelled tab-cnc"></span>
			 	</a>
			 	<span class="ico-loading"></span>
			 </li>
		</ul>
	</div>
	<div class="tab-content">
	    
		<div class="clearfix quick-srch-results">
			<div class="content-title">
				<span class="total-counter"><liferay-ui:message	key="displaymessage" arguments="${quickSearchResponse.searchKeywordResponse.size()}" /></span>
				<c:if test="${hasSearchResults eq true}">
					<a href='<portlet:resourceURL id="downloadSearchResults"/>'><span class="save-search-download-link"><i class="ico-download"></i><liferay-ui:message key="download" /></span></a>
				</c:if>
			</div>
			
			<table border="0" width="100%" id="quickSearchTableResult">
				<tr class="grid-header hide-in-mob hidden-xs">
					<th><span class="hide-in-mob"><liferay-ui:message key="tollShipmentNo" /></span></th>
					<th class="hide-in-mob"><liferay-ui:message key="senderReceiverRef" /></th>
					<th class="hide-in-mob"><liferay-ui:message key="milestone" /></th>
					<th><liferay-ui:message key="senderLocation" /></th>
					<th><liferay-ui:message key="deliveryLocation" /></th>
					<th><liferay-ui:message key="estimatedDeliveryDate" /></th>
					<th class="items"><liferay-ui:message key="items" /></th>
				</tr>
				<c:forEach var="searchKeywordResultSet" items="${quickSearchResponse.searchKeywordResponse}">
					<c:set var="str" value="${searchKeywordResultSet.noOfRows},${searchKeywordResultSet.searchKeyword}"/>
					<c:set var="termclass" value="single-term"></c:set>
					<c:if test="${expandCollapseIndicator eq true}">
					    <c:set var="termclass" value="multi-term"></c:set>
					</c:if>
					<c:choose>
						<c:when test="${searchKeywordResultSet.noOfRows eq 1}">
					  		<tr class="grid-row-header ${termclass}">
					  			<td colspan="7">
					    			<liferay-ui:message key="singleResultFound" arguments="${fn:split(str, ',')}" />
					    		</td>
					    	</tr>
					  	</c:when>
						<c:when test="${searchKeywordResultSet.noOfRows gt 20}">
					  		<tr class="grid-row-header ${termclass}">
					  			<td colspan="7" align="left">
					    			<liferay-ui:message key="moreThanTwentyResultsFound" arguments="${searchKeywordResultSet.searchKeyword}" />
					    		</td>
					    	</tr>
					  	</c:when>			  	
					  	<c:otherwise>
					  		<tr class="grid-row-header ${termclass}">
					  			<td colspan="7" align="left">
					    			<liferay-ui:message key="multipleResultsFound" arguments="${fn:split(str, ',')}" />
								</td>
					  		</tr>
					  	</c:otherwise>
					</c:choose>
					<c:if test="${searchKeywordResultSet.noOfRows eq 0}">
						<tr class="grid-row-header no-shipment">
							<td colspan="7" align="center" valign="middle" class="no-res-found">
								<div class="clearfix no-res-floter"><i class="ico-not-found"></i><div class="flLeft"><liferay-ui:message key="noShipmentsFound" /></div></div>
					  		</td>
						</tr>
					</c:if>
					<c:if test="${searchKeywordResultSet.noOfRows gt 0}">
						<c:forEach var="result" items="${searchKeywordResultSet.results}" 
					varStatus="counter"	>
							<c:set var="headerIconClass" value="" ></c:set>
							<c:choose>	
								<c:when test="${result.status eq \"SHPCRE\"}">									
									<c:set var="headerIconClass" value="ico-shipment-created" ></c:set>
								</c:when>								
								<c:when test="${result.status eq \"PCKDUP\"}">									
									<c:set var="headerIconClass" value="ico-picked-up" ></c:set>
								</c:when>
								<c:when test="${result.status eq \"INTRNST\"}">									
									<c:set var="headerIconClass" value="ico-in-transit" ></c:set>
								</c:when>
								<c:when test="${result.status eq \"OUTFDL\"}">									
									<c:set var="headerIconClass" value="ico-out-for-delivery" ></c:set>
								</c:when>
								<c:when test="${result.status eq \"DELVERD\"}">									
									<c:set var="headerIconClass" value="ico-delivered del-color" ></c:set>
								</c:when>
								<c:when test="${result.status eq \"PRTDEL\"}">									
									<c:set var="headerIconClass" value="ico-partially-delivered" ></c:set>
								</c:when>	
								<c:when test="${result.status eq \"AWTCOL\"}">									
									<c:set var="headerIconClass" value="ico-awaiting-collection" ></c:set>
								</c:when>
								<c:when test="${result.status eq \"COLLCTD\"}">									
									<c:set var="headerIconClass" value="ico-collected" ></c:set>
								</c:when>
								<c:when test="${result.status eq \"CANCLD\"}">									
									<c:set var="headerIconClass" value="ico-cancelled" ></c:set>
								</c:when>						
								<c:otherwise>
									<c:set var="headerIconClass" value="" ></c:set>
								</c:otherwise>
							</c:choose>
							<c:set var="firstRow" value=""></c:set>				
							<c:if test="${expandCollapseIndicator eq true && searchKeywordResultSet.noOfRows gt 1}">
								<c:set var="firstRow" value="hidden-def"></c:set>
								<c:if test="${counter.index eq 0}">
									<tr class="showresult" data-refterm="${searchKeywordResultSet.searchKeyword}">
										<td colspan="7">
											<span class="ico-accordian-down"></span><liferay-ui:message key="show-results"/>
										</td>
									</tr>
								</c:if>
							</c:if> 	
							<c:set var="hideException" value="IsHide-excptn"></c:set>
							<c:if test="${not empty result.inException}">
								<c:set var="showException" value=""></c:set>
						    </c:if>				
							<tr class="grid-row data-row IsCollapse ${firstRow} ${searchKeywordResultSet.searchKeyword}" data-refnum="${result.consignmentId}">
								<td class="shipmentRef mobdv-clearfix" >
								    <div class="shipment-no-div">
									    <!-- <i class="ico-save flLeft ico-star-mob"></i> 
									    <span class="device-label"><liferay-ui:message key="tollShipmentNo-mob"/></span>-->
									    <label class="data-title visible-xs"><liferay-ui:message key="tollShipmentNo-mob"/></label>
										<span class="shipNo"><mytoll:truncateText message="${result.consignmentNumber}"/></span>
								    </div>
									<%-- <div class="mob-sender-ref">
										<span class="mob-label"><liferay-ui:message key="senderReceiverRef-mob"/></span>
										<c:forEach items="${result.refrenceList}" var="references" varStatus="refCounter">
											<c:if test="${not empty references}">
												<span class="block-spn"><mytoll:sentenceCase message="${references}"/></span>
											</c:if>
										</c:forEach>
										<c:if test="${result.showMoreReferences}">
											<span class="block-spn"><liferay-ui:message key="more-text" />..</span>
										</c:if>
									</div>
									<i class="mob-arrow-ico ico-right flLeft"></i> --%>
								</td>
								<td class="senderRef">
									<div class="sender-ref">
										<!--<span class="device-label"><liferay-ui:message key="senderReceiverRef-mob"/></span>-->
										<label class="data-title visible-xs"><liferay-ui:message key="senderReceiverRef-mob"/></label>
										<c:forEach items="${result.refrenceList}" var="references" varStatus="refCounter">
											<c:if test="${not empty references}">
												<span class="block-spn"><mytoll:sentenceCase message="${references}"/></span>
											</c:if>
										</c:forEach>
										<c:if test="${result.showMoreReferences}">
											<span class="block-spn"><liferay-ui:message key="more-text" />...</span>
										</c:if>
									</div>
								</td>							
								<td class="clear milestone">
								    <!-- <span class="ico-exception excptn-row ${hideException} flLeft"></span> -->
								    <i class="${headerIconClass} ico-style flLeft hide-in-mob"></i>
		                            <span class="status-content hide-in-mob"><liferay-ui:message key="${result.status}" /></span>
		                        </td>
								<td class="senderLoc hide-in-mob">
									<!--<span class="mob-label"><liferay-ui:message key="senderLocation" /></span>-->
									<label class="data-title visible-xs"><liferay-ui:message key="senderLocation" /></label>
									<c:if test="${not empty result.senderLocation.suburb}">
										<mytoll:titleCase message="${result.senderLocation.suburb}"/>
									</c:if>
									<c:if test="${not empty result.senderLocation.state}">
										<c:choose>
			 								<c:when test="${fn:length(result.senderLocation.state) le 3}">
												<c:out value="${fn:toUpperCase(result.senderLocation.state)}" />
											</c:when>
											<c:otherwise>
												<mytoll:titleCase message="${result.senderLocation.state}" />
											</c:otherwise>
										</c:choose>
									</c:if>
								</td>
								<td class="deliveryLoc hide-in-mob">
									<!--<span class="mob-label"><liferay-ui:message key="deliveryLocation" /></span>-->
									<label class="data-title visible-xs"><liferay-ui:message key="deliveryLocation" /></label>
									<c:if test="${not empty result.recieverLocation.suburb}">
										<mytoll:titleCase message="${result.recieverLocation.suburb}"/>
									</c:if>
									
									<c:if test="${not empty result.recieverLocation.state}">
										<c:choose>
			 								<c:when test="${fn:length(result.recieverLocation.state) le 3}">
												<c:out value="${fn:toUpperCase(result.recieverLocation.state)}" />
											</c:when>
											<c:otherwise>
												<mytoll:titleCase message="${result.recieverLocation.state}" />
											</c:otherwise>
										</c:choose>
									</c:if>
								</td>
								<fmt:setLocale value="en_GB" />
								 <c:choose>	
									<c:when test="${result.status eq \"DELVERD\"}">									
										<fmt:parseDate value="${result.shipmentDeliveryDate}" pattern="dd/MM/yy" var="formattedDate"/>
									</c:when>
									
									<c:when test="${result.status eq \"COLLCTD\"}">									
									   <fmt:parseDate value="${result.shipmentCollectedDate}" pattern="dd/MM/yy" var="formattedDate"/>
									</c:when>	
									<c:otherwise>
										<fmt:parseDate value="${result.eta}" pattern="dd/MM/yy" var="formattedDate"/>
									</c:otherwise>
								</c:choose>
								<fmt:formatDate value="${formattedDate}" pattern="dd MMM YYYY" var="estimatedDeliveryDate"/>
								<td class="estimatedDeliveryDate">
									<!-- <span class="mob-label"><liferay-ui:message key="estimatedDelivery" /></span> -->
									<label class="data-title visible-xs"><liferay-ui:message key="estimatedDeliveryDate" /></label>
									<c:out value="${estimatedDeliveryDate}" />
								</td>
								<td class="items">
									<!-- <span class="mob-label"><liferay-ui:message key="items" /></span> -->
									<label class="data-title visible-xs"><liferay-ui:message key="items" /></label>
									<c:out value="${result.noOfItems}" />
								</td>
								<td class="clear milestone align-middle device-only">
								    <!-- <span class="ico-exception excptn-row ${hideException} flLeft"></span> -->
								    <i class="${headerIconClass} ico-style flLeft"></i>
		                            <span class="status-content"><liferay-ui:message key="${result.status}" /></span>
		                        </td>
								<td class="senderLoc align-middle device-only">
									<c:if test="${not empty result.senderLocation.suburb}">
										<mytoll:titleCase message="${result.senderLocation.suburb}"/>
									</c:if>
									<c:if test="${not empty result.senderLocation.state}">
										<c:choose>
			 								<c:when test="${fn:length(result.senderLocation.state) le 3}">
												<c:out value="${fn:toUpperCase(result.senderLocation.state)}" />
											</c:when>
											<c:otherwise>
												<mytoll:titleCase message="${result.senderLocation.state}" />
											</c:otherwise>
										</c:choose>
									</c:if>
								</td>
								<td class="deliveryLoc align-middle device-only">
									<c:if test="${not empty result.recieverLocation.suburb}">
										<mytoll:titleCase message="${result.recieverLocation.suburb}"/>
									</c:if>
									
									<c:if test="${not empty result.recieverLocation.state}">
										<c:choose>
			 								<c:when test="${fn:length(result.recieverLocation.state) le 3}">
												<c:out value="${fn:toUpperCase(result.recieverLocation.state)}" />
											</c:when>
											<c:otherwise>
												<mytoll:titleCase message="${result.recieverLocation.state}" />
											</c:otherwise>
										</c:choose>
									</c:if>
								</td>
		                    </tr>
						</c:forEach>
						<c:if test="${searchKeywordResultSet.noOfRows gt 20}">
					  		<tr class="refine-srch IsCollapse ${firstRow} ${searchKeywordResultSet.searchKeyword}">
					  			<td colspan="7" align="center">
					    			<liferay-ui:message key="refineSearch" />
					    		</td>
					    	</tr>
					  	</c:if>	
					</c:if>
				</c:forEach>
				<tr class="grid-row-footer hidden">
					<td colspan="7" align="center">
			  			
			  		</td>
				</tr>
			</table>
		</div>
	</div>
</div>
</c:if>


<script type="text/javascript">
function <portlet:namespace/>clearResults(clearResultsUrl) {
	$('#clear-srch-res .tab-cnc').addClass('hidden-def');
	$('#clear-srch-res').addClass('active_loader');
	$$dom.jQ13.ajax({
		type: "GET",
		url: clearResultsUrl,
		cache: false,
		success: function() {
			$( '#searchResults' ).empty();
			$('.progress-bar-image').addClass('hidden-def');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// console.log(jqXHR.responseText);
			$('#clear-srch-res .tab-cnc').removeClass('hidden-def');
			$('#clear-srch-res').removeClass('active_loader');
		}
	}); 
}
</script> 