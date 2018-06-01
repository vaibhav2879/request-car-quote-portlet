<%@ include file="/WEB-INF/jsp/watch-list/init.jsp"%>
<%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%>

<c:if test="${not empty pickupArray.pickups}">

	<c:forEach var="pickupRecord" items="${pickupArray.pickups}">
		<tr class="pickup-data-row" onclick="redirectToDetailsPage('${pickupRecord.pickupId}', '${dashboardPickupUrl}', 'viewPickup')">
			<td><label class="data-title visible-xs">Booking reference</label>${pickupRecord.reference}</td>
			<td><label class="data-title visible-xs">Toll carrier</label>${pickupRecord.tollCarrier.tollCarrierName}</td>

			<td class="fullWidthtd"><label class="data-title visible-xs">Sender</label>
				<c:if test="${not empty pickupRecord.companyName}">
							${pickupRecord.companyName}
						</c:if>
			</td>
			<td><label class="data-title visible-xs">Sender location</label>
				<c:if test="${not empty pickupRecord.pickupAddress}">
					<c:if test="${pickupRecord.pickupAddress.suburb != null}">  
	        			<c:if test="${not empty pickupRecord.pickupAddress.suburb}">
	        				<mytoll:titleCase message="${pickupRecord.pickupAddress.suburb}"/>
	        			</c:if>
	        		</c:if>
					<c:if test="${pickupRecord.pickupAddress.state != null}">  
	        			<c:if test="${not empty pickupRecord.pickupAddress.state}">
	        				<c:choose>
							<c:when test="${fn:length(pickupRecord.pickupAddress.state) le 3}">
								<c:out value="${fn:toUpperCase(pickupRecord.pickupAddress.state)}" />
							</c:when>
							<c:otherwise>
								<mytoll:titleCase message="${pickupRecord.pickupAddress.state}" />
							</c:otherwise>
						</c:choose>
	        			</c:if>
	        		</c:if>
	        		<c:if test="${pickupRecord.pickupAddress.postcode != null}">  
	        			<c:if test="${not empty pickupRecord.pickupAddress.postcode}">
	        				&nbsp;${pickupRecord.pickupAddress.postcode}
	        			</c:if>
	        		</c:if>
        		</c:if>
			</td>
			<td><label class="data-title visible-xs">Pickup date</label>
				<fmt:formatDate pattern="dd MMM yyyy" value="${pickupRecord.pickUpDate1}" />
			</td>

			<td><label class="data-title visible-xs">Ready time</label>
				<fmt:formatDate pattern="HH:mm" value="${pickupRecord.pickupReadyTime1}" /></td>

			<td><label class="data-title visible-xs">Items</label>
				${pickupRecord.totalItemsCount}</td>
		</tr>
	</c:forEach>
</c:if>
<div id="pickupPageNum" class="hidden">${pageNum}</div>
<div id="pickupViewMore" class="hidden">${hasMorePickup}</div>
<div id="pickupSearchParam" class="hidden">${pickupSearchParam}</div>
<div id="pickupDataAvailable" class="hidden">${pickupDataAvailable}</div>
<div id="pickupNoDataMsg" class="hidden">${pickupErrorMsg}</div>
<div id="mypickupListCount" class="hidden">${pickupCount}</div>