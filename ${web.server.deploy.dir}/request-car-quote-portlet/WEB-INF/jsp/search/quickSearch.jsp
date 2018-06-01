<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page contentType="text/html" isELIgnored="false"%>
<%@ taglib prefix="portlet" uri="http://java.sun.com/portlet_2_0"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ page import="javax.portlet.PortletSession" %>

<portlet:defineObjects />
<portlet:resourceURL var="quickSearchUrl" id="quickSearch"/>

<c:if test='${not empty portletSession.getAttribute("quickSearchResponse", PortletSession.APPLICATION_SCOPE)}'>
	<c:set var="hasPreviousSearchResults" value="true" />
</c:if>
<c:set var="onLoadVar" value="startSrchCall('${quickSearchUrl}');"/>
	<div id="track-shipment" style="margin-top: 0px;">
		<div class="content-box boxShad">
			<div class="form-row row">
				
				<div class="col-sm-12 col-lg-7 col-md-7 col-xs-12">
					<div id="searchBannerMob" class="hidden-md hidden-lg">
						<div class="track-banner mobile searchBannerMob_img" ></div>
						<div class="searchBannerMob_con"><%=(String)jsonwcmHtmlTitleOrHeaders.get("trackurshipment") %></div>
					</div>
					
					<%-- <h2><liferay-ui:message key="quickSearchIntro" /></h2> --%>
					<div class="input-label-grp col-sm-12 col-xs-12">
						<form id="quickSearchForm" name="<portlet:namespace/>quickSearchForm">
							<div class="search-input-area">
								<textarea id="quickSearch" name="company" placeholder="<%=(String)jsonwcmPlaceholders.get("trackurshipment_placeholder") %>"></textarea>
								<input type="hidden" id="shipment-srch-trm" name="<portlet:namespace/>shipmentReferences" />
								<input type="hidden" id="externalSearchQuery" name="<portlet:namespace/>externalSearchQuery" value="${externalSearchQuery}" />
							</div>
						</form>
						<button class="search-button-icon" id="search-shipment-btn" disabled="disabled" onclick="fireQuickSearch('${quickSearchUrl}','newCall','');">
						</button>
						<div class="light-grey-text quick-error-msg">
						<%-- <liferay-ui:message key="search-upto-max-references-number" arguments="${searchKeywordLimit}" /> --%>
						<%=(String)jsonwcmPageContent.get("trackurshipment_limit_msg") %>
						</div>
						<!-- <div class="advance-search">
							<i class="ico-arrow-down-green"></i>
							<span>advanced search</span>
						</div> -->
					</div>
					
				</div>
				<div class="col-sm-4 col-lg-5 col-md-5 col-xs-12">
					<div class="track-banner">
						
					</div>
				</div>
			</div>
		</div>
	</div>
    <%-- <div class="quick-header-msg"><span><liferay-ui:message key="quickSearchIntro" /></span></div>
	<div class="quick-srch-back clearfix multuinput-wrapper">
		<form id="quickSearchForm" name="<portlet:namespace/>quickSearchForm">
			<div class="clearfix form-group quick-srch-box animate ">
				<div class="clearfix textarea-label-grp">
					<label for="quickSearch" class="quick-srch-inp animate"><liferay-ui:message key="searchGuide" /></label>
					<textarea id="quickSearch"  class="multiinput-box no-border no-mgn-btm track-shipment lrg-srch-font"></textarea>
					<input type="hidden" id="shipment-srch-trm" name="<portlet:namespace/>shipmentReferences" />
				</div>
				<span class="quick-error-msg"></span>
				<span class="search-ico"><i class="ico-search"></i></span>
			</div>
		</form>
		<div class="btn-wrapper">
			<button type="button" name="Track" id="search-shipment-btn" class="smart-btn srch-actn-btns" disabled="disabled" onclick="fireQuickSearch('${quickSearchUrl}','newCall');"><liferay-ui:message key="search" /><i class="ico-loading"></i></button>
		</div>
	</div> --%>
<input type="hidden" value="${hasPreviousSearchResults}" id="prvs-srch-rslt" />
<input type="hidden" value="${quickSearchUrl}" id="quick-srch-url" />
<script type="text/javascript">
	$(document).ready(function(event){
		if('${externalSearchQuery}' != null && '${externalSearchQuery}' != ""){
			fireQuickSearch('${quickSearchUrl}','newCall','web-api');
		}else{
			${(hasPreviousSearchResults ? onLoadVar : "")}
		}
	});
</script>