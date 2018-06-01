<%@ include file="/WEB-INF/jsp/watch-list/init.jsp" %>
  
<div class="error-title">
	<h1><liferay-ui:message key="oops-something-gone-wrong"/></h1>
</div>
<div class="clearfix white-background toll-exception-block">
	<div>
		<c:choose>
			<c:when test="${not empty errorMap}">
				<div><span class="ico-alert"></span></div>
				<div class="error-title">
					<p>
						<liferay-ui:message key="unfortunately-something-went-wrong-with-our-system"/>
					</p>
					<p><c:if test="${not empty errorMap.message}"><!-- ${errorMap.message} --></c:if><br/></p>
					<p><liferay-ui:message key="plz-try-again"/></p>
				</div>
				<div class="exception-details">
					<div class="error-code">
						<liferay-ui:message key="error-code"/><br />
					</div>
					<span class='warning'><c:if test="${not empty errorMap.errorcode}"><c:out value="${errorMap.errorcode}" /></c:if></span> 
				</div>
			</c:when>
			<c:otherwise>
				<div><span class="ico-alert"></span></div>
				<div class="error-title">
					<p>
						<liferay-ui:message key="unfortunately-something-went-wrong-with-our-system"/>
					</p>
					<p><br/></p>
					<p><liferay-ui:message key="plz-try-again"/></p>
				</div>
			</c:otherwise>
		</c:choose>
	</div>
</div>