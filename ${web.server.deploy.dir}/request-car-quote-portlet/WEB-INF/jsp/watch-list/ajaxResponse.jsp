<%@ include file="/WEB-INF/jsp/watch-list/init.jsp" %>
<%@ taglib prefix="mytoll" uri="http://www.tollgroup.com/mytoll"%>

<c:if test="${not empty myShipmentsWatching}">

	<c:forEach var="watchlistRecord" items="${myShipmentsWatching}">
		<!--	<tr>
			<td class="shipmentRef">
						<span class="ico-save flLeft ico-star-mob"></span>
						<span class="shipNo">${watchlistRecord.consignmentNumber} </span>
			</td>
			<td class="senderRef">
							<c:if test="${not empty watchlistRecord.senderRef}">
   								 <c:out value="${watchlistRecord.senderRef}" />
							</c:if>
							<c:if test="${(not empty watchlistRecord.senderRef) and (not empty watchlistRecord.receiverReferenceNumber)}">
   								 <c:out value="/" />
							</c:if>	
							<c:if test="${not empty watchlistRecord.receiverReferenceNumber}">
   								 <c:out value="${watchlistRecord.receiverReferenceNumber}" />
							</c:if>
						</td>-->
			<c:set var="deletedConsignment" value=""></c:set>
			<c:set var="hideException" value="IsHide-excptn"></c:set>
				<c:if test="${not empty watchlistRecord}">
					<c:set var="showException" value=""></c:set>
			    </c:if>
			    <c:if test="${empty watchlistRecord.status}">
					<c:set var="deletedConsignment" value="deleted-shipment"></c:set>
				</c:if>
		        <c:choose>
					<c:when test="${watchlistRecord.status eq \"SHPCRE\"}">
						<c:set var="headerIconClass" value="ico-shipment-created" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"PCKDUP\"}">
						<c:set var="headerIconClass" value="ico-picked-up" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"INTRNST\"}">
						<c:set var="headerIconClass" value="ico-in-transit" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"OUTFDL\"}">
						<c:set var="headerIconClass" value="ico-out-for-delivery" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"DELVERD\"}">
						<c:set var="headerIconClass" value="ico-delivered del-color" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"PRTDEL\"}">									
						<c:set var="headerIconClass" value="ico-partially-delivered" ></c:set>
					</c:when>	
					<c:when test="${watchlistRecord.status eq \"AWTCOL\"}">									
						<c:set var="headerIconClass" value="ico-awaiting-collection" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"COLLCTD\"}">									
						<c:set var="headerIconClass" value="ico-collected" ></c:set>
					</c:when>
					<c:when test="${watchlistRecord.status eq \"CANCLD\"}">									
						<c:set var="headerIconClass" value="ico-cancelled" ></c:set>
					</c:when>						
					<c:otherwise>
						<c:set var="headerIconClass" value="ico-delivered" ></c:set>
					</c:otherwise>
				</c:choose>
				
		 <tr class="grid-row watch-data-row ${deletedConsignment}" data-refnum="${watchlistRecord.consignmentId}" id="${watchlistRecord.consignmentId}" data-status="${watchlistRecord.status}">
		    <td class="mob-ico-save"><span class="ico-save"></span></td>
		    <td class="shipmentRef seocnd-cell mobdv-clearfix">
				<span class="ico-save flLeft ico-star-mob"></span>
		    	<div class="clearfix shipment-no-div">
		    		<span class="mob-label"><liferay-ui:message key="tollShipmentNo-mob"/></span>
					<span class="shipNo"><mytoll:truncateText message="${watchlistRecord.consignmentNumber}"/></span>
		    	</div>
		    	<div class="mob-sender-ref">
					<span class="mob-label"><liferay-ui:message key="senderReceiverRef-mob"/></span>
					<c:forEach items="${watchlistRecord.refrenceList}" var="references" varStatus="refCounter">
						<c:if test="${not empty references}">
							<span class="block-spn"><mytoll:sentenceCase message="${references}"/></span>
						</c:if>
					</c:forEach>
					<c:if test="${watchlistRecord.showMoreReferences}">
						<span class="block-spn"><liferay-ui:message key="more-text" />..</span>
					</c:if>			
				</div>
				<i class="mob-arrow-ico ico-right flLeft"></i>
		    </td>

	    	<td class="senderRef" >
	    		<div class="sender-ref">
					<c:forEach items="${watchlistRecord.refrenceList}" var="references" varStatus="refCounter">
						<c:if test="${not empty references}">
							<span><mytoll:sentenceCase message="${references}"/></span> <br>
						</c:if>
					</c:forEach>
					<c:if test="${watchlistRecord.showMoreReferences}">
						<span class="block-spn"><liferay-ui:message key="more-text" />..</span>
					</c:if>	
				</div>
			</td>
			    
			<td class="clear milestone">
				<c:if test="${not empty watchlistRecord.status}">
			    <!-- <span class="ico-exception excptn-row ${hideException} flLeft"></span> -->
			    <span class="${headerIconClass} ico-style flLeft"></span>
				<span class="status-content"><liferay-ui:message key="${watchlistRecord.status}" /></span>
				</c:if>
			</td>
			<td class="sender-delivery-Loc address">
				<div class="top-layer clearfix">
					<c:if test="${empty watchlistRecord.status}">
						<div class="deleted-shipment clearfix"><liferay-ui:message key="watchlist-delete-message"/></div>
					</c:if>
					<div class="left-cell">
						<span class="mob-label"><liferay-ui:message key="senderDetails"/></span>
						<div class="name"><mytoll:senderReceiverName message="${watchlistRecord.senderName}"/></div>
					</div>
					<div class="right-cell">
						<span class="mob-label"><liferay-ui:message key="receiverDetails"/></span>
						<div class="name"><mytoll:senderReceiverName message="${watchlistRecord.recieverName}"/></div>
					</div>
					
				</div>
				<div class="lower-layer clearfix">
					<div class="left-cell">
						<div class="location">
							<c:if test="${not empty watchlistRecord.senderLocation.suburb}">
								<mytoll:titleCase message="${watchlistRecord.senderLocation.suburb}"/>
							</c:if>
							<c:if test="${(not empty watchlistRecord.senderLocation.suburb) and (not empty watchlistRecord.senderLocation.state)}">
		 						<c:out value="," />
							</c:if>
							<c:if test="${not empty watchlistRecord.senderLocation.state}">
								<c:choose>
									<c:when test="${fn:length(watchlistRecord.senderLocation.state) le 3}">
										<c:out value="${fn:toUpperCase(watchlistRecord.senderLocation.state)}" />
									</c:when>
									<c:otherwise>
										<mytoll:titleCase message="${watchlistRecord.senderLocation.state}" />
									</c:otherwise>
								</c:choose>
							</c:if>
						</div>
					</div>
					<div class="right-cell deliveryLoc suburd-state">
						<div class="location">
							<c:if test="${not empty watchlistRecord.recieverLocation.suburb}">
								<mytoll:titleCase message="${watchlistRecord.recieverLocation.suburb}"/>
							</c:if>
							<c:if test="${(not empty watchlistRecord.recieverLocation.suburb) and (not empty watchlistRecord.recieverLocation.state)}">
		 						<c:out value="," />
							</c:if>
							<c:if test="${not empty watchlistRecord.recieverLocation.state}">
								<c:choose>
									<c:when test="${fn:length(watchlistRecord.recieverLocation.state) le 3}">
										<c:out value="${fn:toUpperCase(watchlistRecord.recieverLocation.state)}" />
									</c:when>
									<c:otherwise>
										<mytoll:titleCase message="${watchlistRecord.recieverLocation.state}" />
									</c:otherwise>
								</c:choose>
							</c:if>
						</div>
					</div>
				</div>
			</td>
			
			<td class="estimatedDeliveryDate">
				<span class="mob-label"><liferay-ui:message key="estimatedDeliveryDate"/></span>
				<span>
					<c:catch var="error">
					<fmt:parseDate value="${watchlistRecord.date}" var="parsedEstimatedDeliveryDate" pattern="dd/MM/yy"/>
                    <fmt:formatDate pattern="dd MMM YYYY"  var="estimatedDate" value="${parsedEstimatedDeliveryDate}" />                        
					</c:catch>
					<c:if test = "${error eq null}">
							<c:out value="${estimatedDate}"/>   
					</c:if>
				</span>
			</td>
			<td class="items">
				<span class="mob-label"><liferay-ui:message key="items"/></span>
				<span><c:out value="${watchlistRecord.noOfItems}" /></span>
			</td>
			</tr>
		</c:forEach>
		<c:if test="${hasMore}">
			<tr class="text-center result-loader clearfix">
				<td colspan="7" class="text-center pdng-top-20px">
				    <button type="button" name="loadmore" data-toload="${loadMoreRecords}" data-counter="${counter}" class="smart-btn toll-green-bg smart-loader-btn" id="load-more-watchlist"><liferay-ui:message key="loadmore-key"/><span class="ico-loading hidden-def"></span>
				    </button>
				</td>
			</tr>
		</c:if>
</c:if>