<%@ include file="/WEB-INF/jsp/request-quote/init.jsp"%>
<%-- <%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%> --%>

<portlet:defineObjects />

<c:if test="${not empty myWatchList.results}">

	<c:forEach var="watchlisRecord" items="${myWatchList.results}" varStatus="counter">
		<c:set var="headerIconClass" value="" ></c:set>
		<c:choose>	
			<c:when test="${watchlisRecord.status eq \"SHPCRE\"}">									
				<c:set var="headerIconClass" value="ico-shipment-created" ></c:set>
			</c:when>								
			<c:when test="${watchlisRecord.status eq \"PCKDUP\"}">									
				<c:set var="headerIconClass" value="ico-picked-up" ></c:set>
			</c:when>
			<c:when test="${watchlisRecord.status eq \"INTRNST\"}">									
				<c:set var="headerIconClass" value="ico-in-transit" ></c:set>
			</c:when>
			<c:when test="${watchlisRecord.status eq \"OUTFDL\"}">									
				<c:set var="headerIconClass" value="ico-out-for-delivery" ></c:set>
			</c:when>
			<c:when test="${watchlisRecord.status eq \"DELVERD\"}">									
				<c:set var="headerIconClass" value="ico-delivered del-color" ></c:set>
			</c:when>
			<c:when test="${watchlisRecord.status eq \"PRTDEL\"}">									
				<c:set var="headerIconClass" value="ico-partially-delivered" ></c:set>
			</c:when>	
			<c:when test="${watchlisRecord.status eq \"AWTCOL\"}">									
				<c:set var="headerIconClass" value="ico-awaiting-collection" ></c:set>
			</c:when>
			<c:when test="${watchlisRecord.status eq \"COLLCTD\"}">									
				<c:set var="headerIconClass" value="ico-collected" ></c:set>
			</c:when>
			<c:when test="${watchlisRecord.status eq \"CANCLD\"}">									
				<c:set var="headerIconClass" value="ico-cancelled" ></c:set>
			</c:when>						
			<c:otherwise>
				<c:set var="headerIconClass" value="ico-delivered" ></c:set>
			</c:otherwise>
		</c:choose>
		<c:set var="firstRow" value=""></c:set>
		<tr onclick="redirectToPage('${dashboardShipmentDetailsUrl}?consignmentId=${watchlisRecord.consignmentId}')">
			<td style="word-wrap:break-word;"><label class="data-title visible-xs">Shipment no.</label>
			<%-- <span class="ico-save"></span> --%>
			<c:choose>
				<c:when test="${not empty watchlisRecord.consignmentNumber}">
					<mytoll:truncateText message="${watchlisRecord.consignmentNumber}"/>
				</c:when>
				<c:otherwise>
					<span>--</span>
				</c:otherwise>
			</c:choose>
			</td>

			<td><label class="data-title visible-xs">References</label>
			<c:if test="${not empty watchlisRecord.refrenceList}">
			<c:forEach items="${watchlisRecord.refrenceList}" var="references" varStatus="refCounter">
					<c:if test="${not empty references}">
						<span class="block-spn"><mytoll:sentenceCase message="${references}"/></span>
					</c:if>
			</c:forEach>
			<c:if test="${watchlisRecord.showMoreReferences}">
				<span class="block-spn"><liferay-ui:message key="more-text" />...</span>
			</c:if>
			</c:if>
	
			</td>
			
             <td class="milestoneMob"><!-- <label class="data-title visible-xs"></label> -->
				<c:if test="${not empty watchlisRecord.status}">
					<i class="${headerIconClass} ico-style flLeft hide-in-mob pdr2"></i>
					<span><liferay-ui:message key="${watchlisRecord.status}" /></span>
				</c:if>
			</td>

            <td><label class="data-title visible-xs">Sender location</label>			    
			    <c:if test="${watchlisRecord.senderLocation.suburb != null}">  
        			<c:if test="${not empty watchlisRecord.senderLocation.suburb}">
        				<mytoll:titleCase message="${watchlisRecord.senderLocation.suburb}"/>
        			</c:if>
        		</c:if>
				<c:if test="${watchlisRecord.senderLocation.state != null}">  
        			<c:if test="${not empty watchlisRecord.senderLocation.state}">
        				<c:choose>
							<c:when test="${fn:length(watchlisRecord.senderLocation.state) le 3}">
								<c:out value="${fn:toUpperCase(watchlisRecord.senderLocation.state)}" />
							</c:when>
							<c:otherwise>
								<mytoll:titleCase message="${watchlisRecord.senderLocation.state}" />
							</c:otherwise>
						</c:choose>
        			</c:if>
        		</c:if>
			</td>
			
			 <td><label class="data-title visible-xs">Delivery location</label>
			    <c:if test="${watchlisRecord.recieverLocation.suburb != null}">  
        			<c:if test="${not empty watchlisRecord.recieverLocation.suburb}">
        				<mytoll:titleCase message="${watchlisRecord.recieverLocation.suburb}"/>
        			</c:if>
        		</c:if>
				<c:if test="${watchlisRecord.recieverLocation.state != null}">  
        			<c:if test="${not empty watchlisRecord.recieverLocation.state}">
        				<c:choose>
							<c:when test="${fn:length(watchlisRecord.recieverLocation.state) le 3}">
								<c:out value="${fn:toUpperCase(watchlisRecord.recieverLocation.state)}" />
							</c:when>
							<c:otherwise>
								<mytoll:titleCase message="${watchlisRecord.recieverLocation.state}" />
							</c:otherwise>
						</c:choose>
        			</c:if>
        		</c:if>
			</td>
			<fmt:setLocale value="en_GB" />
			<c:catch var="error">
				<fmt:parseDate value="${watchlisRecord.date}" pattern="dd/MM/yy" var="formattedDate"/>
				<fmt:formatDate value="${formattedDate}" pattern="dd MMM YYYY" var="estimatedDeliveryDate"/>
			</c:catch>
			<td><label class="data-title visible-xs">Estimated delivery</label>
				<c:if test = "${error eq null}">
					<c:out value="${estimatedDeliveryDate}" />
				</c:if>
			</td>
			
			<td><label class="data-title visible-xs">Items</label>
				${watchlisRecord.noOfItems}			
			</td>
		</tr>
	</c:forEach>
</c:if>

<div id="watchlistPageNum" class="hidden">${pageNum}</div>
<div id="watchlistViewMore" class="hidden">${hasMoreWatchlist}</div>
<div id="watchlistSearchParam" class="hidden">${watchlistSearchParam}</div>
<div id="watchlistDataAvailable" class="hidden">${watchlistDataAvailable}</div>
<div id="watchlistNoDataMsg" class="hidden">${watchlistErrorMsg}</div>
<div id="mywatchListCount" class="hidden">${resultSizeWatchList}</div>