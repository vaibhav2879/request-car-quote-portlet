<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<%@ page import="java.util.List" %>
<%@ page import="com.liferay.portal.kernel.util.StringUtil" %>
<%@ page import="com.liferay.portal.kernel.util.PropsUtil" %>
<%@ page import="com.liferay.portal.kernel.portlet.LiferayWindowState" %>
<%@ page import="com.liferay.portal.kernel.json.*"%>

<portlet:defineObjects />
<liferay-theme:defineObjects />

<%
	String mytollwcmDashboard= (String)request.getAttribute("MYTOLL_WCM_DASHBOARD");
	java.util.Map<String,String> jsonwcmTooltip=new java.util.HashMap<String,String>();
	java.util.Map<String,String> jsonwcmLabels=new java.util.HashMap<String,String>();
	java.util.Map<String,String> jsonwcmErrorMessages=new java.util.HashMap<String,String>();
	java.util.Map<String,String> jsonwcmHtmlTitleOrHeaders = new java.util.HashMap<String,String>();
	java.util.Map<String,String> jsonwcmPlaceholders = new java.util.HashMap<String,String>();
	java.util.Map<String,String> jsonwcmMiscellaneous = new java.util.HashMap<String,String>();
	java.util.Map<String,String> jsonwcmPageContent = new java.util.HashMap<String,String>();
	java.util.Map<String,JSONObject> jsonwcmData=new java.util.HashMap<String,JSONObject>();
	if(null!=mytollwcmDashboard && mytollwcmDashboard.length()>0){
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject(mytollwcmDashboard);
		JSONObject getRootParent = jsonObject.getJSONObject("MYTOLL_WCM_DASHBOARD");
		JSONObject getParent = getRootParent.getJSONObject("dashboard");
		for(int i = 0; i<getParent.names().length(); i++){
			jsonwcmData.put(getParent.names().getString(i), JSONFactoryUtil.createJSONObject(getParent.get(getParent.names().getString(i)).toString()));
		}	
		//For ToolTip
		JSONObject tooltipObject = jsonwcmData.get("ToolTip");
		if(null!=tooltipObject && tooltipObject.length() > 0){			
			for(int i = 0; i<tooltipObject.names().length(); i++){
				jsonwcmTooltip.put(tooltipObject.names().getString(i), (String)tooltipObject.get(tooltipObject.names().getString(i)).toString());
			}
		}
		//For Labels
		JSONObject labelsObject = jsonwcmData.get("Labels");
		if(null!=labelsObject && labelsObject.length() > 0){			
			for(int i = 0; i<labelsObject.names().length(); i++){
				jsonwcmLabels.put(labelsObject.names().getString(i), (String)labelsObject.get(labelsObject.names().getString(i)).toString());
			} 
		}
		//For ErrorMessages
		JSONObject errorMessagesObject = jsonwcmData.get("ErrorMessages");
		if(null!=errorMessagesObject && errorMessagesObject.length() > 0){			
			for(int i = 0; i<errorMessagesObject.names().length(); i++){
				jsonwcmErrorMessages.put(errorMessagesObject.names().getString(i), (String)errorMessagesObject.get(errorMessagesObject.names().getString(i)).toString());
			} 
		}
		//For HtmlTitleOrHeaders
		JSONObject htmlTitleOrHeadersObject = jsonwcmData.get("HtmlTitleOrHeaders");
		if(null!=htmlTitleOrHeadersObject && htmlTitleOrHeadersObject.length() > 0){			
			for(int i = 0; i<htmlTitleOrHeadersObject.names().length(); i++){
				jsonwcmHtmlTitleOrHeaders.put(htmlTitleOrHeadersObject.names().getString(i), (String)htmlTitleOrHeadersObject.get(htmlTitleOrHeadersObject.names().getString(i)).toString());
			} 
		}
		//For Placeholders
		JSONObject placeholdersObject = jsonwcmData.get("Placeholders");
		if(null!=placeholdersObject && placeholdersObject.length() > 0){			
			for(int i = 0; i<placeholdersObject.names().length(); i++){
				jsonwcmPlaceholders.put(placeholdersObject.names().getString(i), (String)placeholdersObject.get(placeholdersObject.names().getString(i)).toString());
			} 
		}
		//For PageContent
		JSONObject pageContentObject = jsonwcmData.get("PageContent");
		if(null!=pageContentObject && pageContentObject.length() > 0){			
			for(int i = 0; i<pageContentObject.names().length(); i++){
				jsonwcmPageContent.put(pageContentObject.names().getString(i), (String)pageContentObject.get(pageContentObject.names().getString(i)).toString());
			} 
		}
		//For Miscellaneous
		JSONObject miscellaneousObject = jsonwcmData.get("Miscellaneous");
		if(null!=miscellaneousObject && miscellaneousObject.length() > 0){			
			for(int i = 0; i<miscellaneousObject.names().length(); i++){
				jsonwcmMiscellaneous.put(miscellaneousObject.names().getString(i), (String)miscellaneousObject.get(miscellaneousObject.names().getString(i)).toString());
			} 
		}
	}
 %>
