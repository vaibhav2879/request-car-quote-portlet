<%@ include file="/WEB-INF/jsp/watch-list/init.jsp"%>
<%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%>
<portlet:defineObjects />

<c:if test="${not empty manifestArray.manifests}">

	<c:forEach var="manifestRecord" items="${manifestArray.manifests}">
		<tr onclick="redirectToManifestPage('${manifestRedirectURl}', '${manifestRecord.manifestId}', '${manifestRecord.tollCarrierCode}')">
			<td style="word-wrap:break-word;" class="table100perMob"><label class="data-title visible-xs">Manifest name</label>
			<c:choose>
				<c:when test="${not empty manifestRecord.manifestName}">
					${manifestRecord.manifestName}
				</c:when>
				<c:otherwise>
					${manifestRecord.manifestId}
				</c:otherwise>
			</c:choose>
			</td>

			<td class="hidden" onclick="redirectToManifestPage('${manifestRedirectURl}', '${manifestRecord.manifestId}', '${manifestRecord.tollCarrierCode}')">
			<label class="data-title visible-xs">Manifest Id</label>
			${manifestRecord.manifestId}</td>

			<td>
			<label class="data-title visible-xs">Status</label>
			<c:choose>
					<c:when test="${manifestRecord.status eq 'O'}">
								In Progress
							</c:when>
					<c:otherwise>
					            Closed
					        </c:otherwise>
				</c:choose></td>
			<td><label class="data-title visible-xs">Toll carrier</label>${manifestRecord.tollCarrierName}</td>
			<td><label class="data-title visible-xs">Sender</label>
				<c:if test="${not empty manifestRecord.senderAddress.companyName}">
        				${manifestRecord.senderAddress.companyName}
        			</c:if>
			</td>
			<td><label class="data-title visible-xs">Sender location</label>
				<c:if test="${manifestRecord.senderAddress.suburb != null}">  
        			<c:if test="${not empty manifestRecord.senderAddress.suburb}">
        				<mytoll:titleCase message="${manifestRecord.senderAddress.suburb}"/>
        			</c:if>
        		</c:if>
				<c:if test="${manifestRecord.senderAddress.state != null}">  
        			<c:if test="${not empty manifestRecord.senderAddress.state}">
        				<c:choose>
							<c:when test="${fn:length(manifestRecord.senderAddress.state) le 3}">
								<c:out value="${fn:toUpperCase(manifestRecord.senderAddress.state)}" />
							</c:when>
							<c:otherwise>
								<mytoll:titleCase message="${manifestRecord.senderAddress.state}" />
							</c:otherwise>
						</c:choose>
        			</c:if>
        		</c:if>
        		<c:if test="${manifestRecord.senderAddress.postCode != null}">  
        			<c:if test="${not empty manifestRecord.senderAddress.postCode}">
        				&nbsp;${manifestRecord.senderAddress.postCode}
        			</c:if>
        		</c:if>
			</td>

			<td class="tableFullBtnMob"><label class="data-title visible-xs">Dispatch date</label>
				<fmt:formatDate pattern="dd MMM yyyy" value="${manifestRecord.dispatchDateFmt}" />
			</td>
			
			<td class="tableFullBtnMob hidden-xs">
				<!-- <label class="data-title visible-xs"></label> -->
			<c:choose>
					<c:when test="${manifestRecord.status eq 'O'}">
						<c:choose>
							<c:when test="${empty manifestRecord.shipments}">
								<a onClick="event.stopPropagation(); redirectToDetailsPage('${manifestRecord.manifestId}', redirectToShipmentUrl, 'addShipment')" href="javascript:void(0);" class="btnleftMob">
								Add Shipment</a>
							</c:when>
							<c:otherwise>
								<a id="${manifestRecord.manifestId}Print" onClick="event.stopPropagation(); closePrintManifestPopup(event,'${manifestRecord.manifestId}', '${manifestRecord.tollCarrierCode}')" 
								href="javascript:void(0);" class="btnleftMob">
								Print & Complete</a>
								
								<c:if test="${manifestRecord.isWebPickup}">
								<a id="${manifestRecord.manifestId}Book" class="hidden btnleftMob" href="javascript:void(0);" 
								onclick="event.stopPropagation(); redirectToDetailsPage('${manifestRecord.manifestId}', '${dashboardPickupUrl}', 'bookPickup')">Book a Pickup</a>
							</c:if>
							</c:otherwise>
						</c:choose>
					</c:when>
					<c:otherwise>
						<c:choose>
							<c:when test="${not empty manifestRecord.pickUpBookingNumber}">
								<a class="btnleftMob" href="javascript:void(0);" onclick="event.stopPropagation(); redirectToDetailsPage('${manifestRecord.pickUpBookingNumber}', '${dashboardPickupUrl}' , 'viewPickup')">View Pickup</a>
							</c:when>
							<c:otherwise>
							<c:if test="${manifestRecord.isWebPickup}">
								<a class="btnleftMob" href="javascript:void(0);" onclick="event.stopPropagation(); redirectToDetailsPage('${manifestRecord.manifestId}', '${dashboardPickupUrl}', 'bookPickup')">Book a Pickup</a>
							</c:if>
							</c:otherwise>
						</c:choose>
					</c:otherwise>
				</c:choose></td>
		</tr>
	</c:forEach>
</c:if>

<div id="manifestPageNum" class="hidden">${pageNum}</div>
<div id="manifestViewMore" class="hidden">${hasMoreManifest}</div>
<div id="manifestSearchParam" class="hidden">${manifestSearchParam}</div>
<div id="manifestDataAvailable" class="hidden">${manifestDataAvailable}</div>
<div id="manifestNoDataMsg" class="hidden">${manifestErrorMsg}</div>
<div id="mymanifestListCount" class="hidden">${manifestCount}</div>