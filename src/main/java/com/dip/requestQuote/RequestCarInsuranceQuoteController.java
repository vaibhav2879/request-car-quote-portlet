package com.dip.requestQuote;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.portlet.PortletException;
import javax.portlet.PortletSession;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.bind.annotation.RenderMapping;
import org.springframework.web.portlet.bind.annotation.ResourceMapping;

import com.dip.model.cars.Cars;
import com.dip.serviceinterface.RequestQuoteService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.portlet.LiferayWindowState;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ContentTypes;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.PropsUtil;
import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;



/**
 * Project - Digital Insurance
 * Description - Controller Class for handling Request for Insurance quote
 * Author - Vaibhav Agarwal
 * Company - HCL
 */

@Controller("RequestCarInsuranceQuoteController")
@RequestMapping(value = "VIEW")
public class RequestCarInsuranceQuoteController {

	private static final Log log = LogFactoryUtil.getLog(RequestCarInsuranceQuoteController.class);
	private static String CLASS_NAME = RequestCarInsuranceQuoteController.class.getName();

	private Cars cars; 
	public void setCars(Cars cars) {
	 this.cars = cars;	
	}
	
	@Autowired
	RequestQuoteService requestQuoteService; 
	/**
	 * Default render function
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 * @throws TollPortletException
	 * @throws SystemServiceException
	 */
	@RenderMapping
	public String handleRenderRequest(RenderRequest request, RenderResponse response, Model model) {
		
		try {
			this.cars = requestQuoteService.getCarsMasterData("1");
		}catch(Exception e){
			
		}
		model.addAttribute("carMasterData", toJson(this.cars));
		return "view";
	}
	
	/*@ResourceMapping(value = "shipmentsCreatedInTime")
	public void shipmentsCreatedInTime(ResourceRequest request, ResourceResponse response) throws TollPortletAjaxException  {
		String signature = CLASS_NAME + "#shipmentsCreatedInTime(ResourceRequest request,ResourceResponse response)";
		Date entranceTimestamp = LoggingWrapper.logEntrance(LOG, signature, new String[] { "request", "response" },new Object[] { request, response }, null, null);
		String mytollIdentity = (String)request.getPortletSession().getAttribute("xMytollIdentity", PortletSession.PORTLET_SCOPE);
		try{
			ShipmentsCreated shipmentsCreated=null;
				try {
					shipmentsCreated = dashboardService.getShipmentsCreated(mytollIdentity);
				} catch (TollPortletException | SystemServiceException e) {
					TollPortletException portletException = new TollPortletException(ErrorCodes.TOLL_ERR_00002, e);
					portletException.setMessage(ErrorCodes.map.get(ErrorCodes.TOLL_ERR_00002) + e.getMessage());
					LoggingWrapper.logException(LOG, signature, portletException.getSecretCode(),
							portletException.getErrorKey(), portletException);
				}
				String shipmentsCount = SearchUtil.toJson(shipmentsCreated);
			if (Validator.isNull(shipmentsCreated)) {
				return;
			}
			response.getWriter().write(shipmentsCount);
		}catch(IOException ex)
		{
			final TollPortletAjaxException portletException = new TollPortletAjaxException(ErrorCodes.TOLL_ERR_00007, ErrorCodes.map.get(ErrorCodes.TOLL_ERR_00007), ex);
			LoggingWrapper.logException(LOG, signature, portletException.getSecretCode(), portletException.getErrorKey(), portletException);
			throw portletException;
		}
		LoggingWrapper.logExit(LOG, signature, null, entranceTimestamp);                              
	} */
	
	@PostConstruct
    public void init(){
		System.out.println("Inside init() method...");
		try {
			this.cars = requestQuoteService.getCarsMasterData("1");
		}catch(Exception e){
			
		}
		System.out.println("Cars populated");
    }
	
	public static String toJson(Object result) {
		ObjectMapper mapperObj = new ObjectMapper();
		String json = null;
		try {
			json = mapperObj.writeValueAsString(result);
		} catch (JsonProcessingException e) {
			log.debug("Exception encountered while converting an object to json"+e.getMessage());
		}
		return json; 
	}

}