<%@ include file="init.jsp"%>
<portlet:resourceURL id="pickupsBookedInTime" var="pickupsBookedInTime"></portlet:resourceURL>
<portlet:resourceURL id="shipmentsCreatedInTime" var="shipmentsCreatedInTime"></portlet:resourceURL>
<portlet:resourceURL id="getOutageStatus" var="getOutageStatusURL"></portlet:resourceURL>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/live-status/owl.theme.default.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/live-status/owl.carousel.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/live-status/outage-slider.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/live-status/animate.css">
<script src="<%=request.getContextPath()%>/js/live-status/owl.carousel.js"></script>
<script src="<%=themeDisplay.getPathThemeJavaScript()%>/global-helper.js"></script>

<div class="form-row row">
	<div id="outage-error"></div>
	<!-- <div id="outage-Rate-error"></div> -->
		<div class="shipment-live-updates" id="shipment-live-updates">
			<div class="col-sm-6 col-lg-4 col-md-6 hidden-xs">
				<div class="shipment-created boxShad">
					<div class="row">
					  <div class="shipment-created-title">
					    <div class="col-sm-10 col-lg-10 col-md-10 col-xs-10">
					      <h2><%=(String)jsonwcmHtmlTitleOrHeaders.get("shipmentscreated") %></h2>
					    </div>
					    <div class="col-sm-2 col-lg-2 col-md-2 col-xs-2"></div>
					  </div>
					</div>
					<div class="shipment-created-details text-center">
					  <div class="shipment-created-today">
					    <div class="counter todayCount1">
					    </div>
					    <div class="counter-label">
					      <label><%=(String)jsonwcmHtmlTitleOrHeaders.get("today") %></label>
					    </div>
					  </div>
					  <div class="shipment-created-week">
					    <div class="counter weekCount1">
					    </div>
					    <div class="counter-label">
					      <label><%=(String)jsonwcmHtmlTitleOrHeaders.get("weekly") %></label>
					    </div>
					  </div>
					  <div class="shipment-created-month">
					    <div class="counter monthCount1">
					    </div>
					    <div class="counter-label">
					      <label><%=(String)jsonwcmHtmlTitleOrHeaders.get("monthly") %></label>
					    </div>
					  </div>
					</div>
				</div>
			</div>
			
			<div class="col-sm-6 col-lg-4 col-md-6 hidden-xs">
				<div class="pickups-confirmed boxShad">
					<div class="row">
					  <div class="pickups-confirmed-title">
					    <div class="col-sm-10 col-lg-10 col-md-10 col-xs-10">
					      <h2><%=(String)jsonwcmHtmlTitleOrHeaders.get("pickupsbooked") %></h2>
					    </div>
					    <div class="col-sm-2 col-lg-2 col-md-2 col-xs-2"></div>
					  </div>
					</div>
					<div class="pickups-confirmed-details text-center">
					  <div class="pickups-confirmed-today">
					    <div class="counter todayCount">
					    </div>
					    <div class="counter-label">
					      <label><%=(String)jsonwcmHtmlTitleOrHeaders.get("today") %></label>
					    </div>
					  </div>
					  <div class="pickups-confirmed-week">
					    <div class="counter weekCount">
					    </div>
					    <div class="counter-label">
					      <label><%=(String)jsonwcmHtmlTitleOrHeaders.get("weekly") %></label>
					    </div>
					  </div>
					  <div class="pickups-confirmed-month">
					    <div class="counter monthCount">
					    </div>
					    <div class="counter-label">
					      <label><%=(String)jsonwcmHtmlTitleOrHeaders.get("monthly") %></label>
					    </div>
					  </div>
					</div>
				</div>
			</div>
			<c:choose>
				 <c:when test="${(isMobile eq 'true' ||  isNormal eq 'true' ) && ( isTablet eq 'false' ) }">
					 <div class="col-sm-12 col-lg-4 col-md-12 col-xs-12 mobile-view-shipment-nav">
							<div class="shipment-live-nav boxShad">
								<ul class="nav">
									<li><i class="ikon rate-enquiry-ikon"></i><a id="rateEnquery" onclick="return checkValidation('enquiry')" class="rate-enquery-nav" href="/group/guest/enquiry"><%=(String)jsonwcmHtmlTitleOrHeaders.get("quickrateennquiry") %><i class="ico-arrow-down-green"></i></a></li>
			                        <li class="hidden-xs"><i class="ikon shipment-ikon"></i><a id="createShipment" onclick="return checkValidation('shipment')" class="create-shipment-nav" href="/group/guest/shipment"><%=(String)jsonwcmHtmlTitleOrHeaders.get("createashipment") %><i class="ico-arrow-down-green"></i></a></li>
			                        <li class="hidden-xs"><i class="ikon bap-ikon bap30"></i><a id="bookaPickup" onclick="return checkValidation('bookaPickup')" class="bookapickup-nav" href="/group/guest/bookapickup"><%=(String)jsonwcmHtmlTitleOrHeaders.get("bap") %><i class="ico-arrow-down-green"></i></a></li>
								</ul>
							 </div>
					  </div>
				  </c:when>
				  <c:otherwise>				   
				  </c:otherwise>
			</c:choose>			
		</div>
	</div>

<script type="text/javascript">
var outageService={};
var outageStack = [];
var dashboardDetails = {};
var securityJSON = {};	
dashboardDetails = {
	pickupsBookedInTime : "<%=pickupsBookedInTime %>",
	shipmentsCreatedInTime : "<%=shipmentsCreatedInTime %>"
}
securityJSON = {
	"PICKUPS": {
		"accountAccessFilter": [
		  "S"
		],
		"allowed": true,
		"isDown" : false
	},
	"SHIPMENT": {
		"accountAccessFilter": [
		  "FF",
		  "S",
		  "TP"
		],
		"allowed": true,
		"isDown" : false
	},
	"RATES": {
		"accountAccessFilter": [
		  "FF",
		  "S",
		  "TP"
		],
		"allowed": true,
		"isDown" : false
	} 
}


outageService = {
  "outage": function(done) {
  	$.ajax({
    url: "<%=getOutageStatusURL.toString()%>",
    method: 'GET',
    dataType: 'JSON',

    success: function(data) {  
        
          console.log("data: ", data);
          done(data);
    }, 

    error: function(XMLHttpRequest, textStatus, errorThrown) {
    console.log("Status: " ,textStatus);
    console.log("Error: " ,errorThrown);
    done();
    }
    });
  }
    
}

	  
$(function() {
  outageService.outage(function(res) {
    
    /*var dummymsg = 'Following mytoll services will be unavailable from {fromDate} {stratTime} untill {toDate} {endTime} due to a {reason}: <br><strong>Pickup, Rate Enquiery, Returns, Shipment, Invoice</strong>';*/
    /*
	**@DOC: Dynamically making of error messages...
	*/
	var errorStack = [];
	var alternateText = '';
	var downMsg = {
    	"str1":"Following mytoll services are unavailable",
    	"str2":"",
    	"str3":"",
    	"status":false
    };
    var warnMsg = {
    	"str1":"Following mytoll services will be unavailable",
    	"str2":"",
    	"str3":"",
    	"status":false
    };
    outageStack = res;
    if(res){
    	res = res.filter(function(o,i){ if(o.id != "SHIPMENT"){return o;}});
    	if((res[0].alternateText) && (0 < res[0].alternateText.length)){
	    	alternateText = res[0].alternateText;
	    	// errorStack.push({"type":"out_error", "message": res[0].alternateText});
    	}
    	if(res[0].fromDate){
    		downMsg.str2 += " from " + res[0].fromDate;
    		warnMsg.str2 += " from " + res[0].fromDate;
    	}
    	if(res[0].toDate){
    		downMsg.str2 += " untill " + res[0].toDate;
    		warnMsg.str2 += " untill " + res[0].toDate;
    	}
    	if(res[0].reason){
    		downMsg.str2 += " due to a " + res[0].reason;
    		warnMsg.str2 += " due to a " + res[0].reason;
    	}
    	res.forEach(function(o,i){
    		if("DOWN" === o.overallStatus.toUpperCase()){
    			downMsg.status = true;
    			downMsg.str3 +=  "<b>" + o.name + "<b>, ";
    			updateSecurityJSON([o.id,'isDown'],true);
    			/*down.push({"name":o.name,"alternateText":o.alternateText})*/
    		}
    		if("WARN" === o.overallStatus.toUpperCase()){
    			warnMsg.status = true;
    			warnMsg.str3 +=  "<b>" + o.name + "<b>, ";
    			// warn.push({"name":o.name,"alternateText":o.alternateText})
    		}
    	});//for each end
	}
	/*
	**@DOC: Generating Error hack*/
	if(alternateText&&alternateText.length){
		if(downMsg.status){
			//show error as outage error with red color
			errorStack.push({"type":"out_error", "message": alternateText});
		}
		else{
			errorStack.push({"type":"out_warn", "message": alternateText});
		}
	}
	else{
		//show error as outage warn with yellow color
		if(downMsg.status){
			var str = downMsg.str1 + downMsg.str2 + ":<br>" + downMsg.str3.trim().slice(0,(downMsg.str3.length-2)) + "."; 
			/*
				@DOC: head-section-error :  It is used for showing error on top of the page. Basically, It is a id built in Theme's header and can be commonly used from each portlet and pages whereever toll theme is applied.
				 
			*/
			errorStack.push({"type":"out_error", "message": str});
			/*$$global.sectionErrorBox({
			    "parent": "head-section-error",
			    "title": "",
			    "msg": str
				});*/
		}
		if(warnMsg.status){
			var str = warnMsg.str1 + warnMsg.str2 + ":<br>" + warnMsg.str3.trim().slice(0,(warnMsg.str3.length-2)) + "."; 

			/*
				@DOC: head-section-error :  It is used for showing error on top of the page. Basically, It is a id built in Theme's header and can be commonly used from each portlet and pages whereever toll theme is applied.
				 
			*/
			errorStack.push({"type":"out_warn", "message": str});
			/*$$global.sectionErrorBox({
			    "parent": "head-section-error",
			    "title": "",
			    "msg": str,
			    "type":"warn"
				});*/
		}
	}
	if(errorStack&&errorStack.length){
		showHeadCarousel(errorStack);
	}
    DashboardLiveStatusDetails(dashboardDetails);
  });
  //check for outage
});
	  

function addprefix(num){
  var str = "";
  if(num.length === 1){
    str +="00"+num[0]
  }else if(num.length === 2){
    str += "0"+num.join('');
  }else{
    str += num.join('');
  }
  
  return str.split('');
}

function makeCounter(myObj){
  Object.keys(myObj).forEach(function(item, i){
    var arr = myObj[item].split('');
    var num = addprefix(arr);
    num.forEach(function(n){
      var span = document.createElement('span');
      span.innerText += n;
      document.querySelector("."+item).appendChild(span);
    });
    
  });
}  
	
function DashboardLiveStatusDetails(obj){
    Object.keys(obj).forEach(function(item,i){
    	$.ajax({                
			 url : dashboardDetails[item],
			 method : 'GET',
			 success : function(data){
			    makeCounter(JSON.parse(data));
			 },
			 fail : function(xhr){
				 done([]);
			 }
		})
    });
}

 function updateSecurityJSON(k,v){
 	/*
		@DOC: Genric Function For Setting Value Of Nested JSON Layout
		@CREATOR: Rahul Semwal

		INPUT:
		k = [key1,key2,key3]
		v = value

		OUTPUT:
		securityJSON.key1.key2.key3 = value 
	*/
	
	var z = securityJSON;
	for(i = 0;i<k.length-1;i++){ o = k[i]; if(o in z){z = z[o]} else {continue;}}
	z[k[k.length-1]] = v;	
 }

 function checkValidation(obj){
	if(securityJSON.RATES && securityJSON.RATES.allowed == true && obj == "enquiry") {
		if(themeDisplay.isSignedIn()) {
			if(securityJSON.RATES.isDown){
				$$global.outageBox({'title': 'Planned Outage',content:"The selected Mytoll service isn't available at the moment. Please try after sometime.", closeBtn:true})
				return false;
			}else{
				return true;
			}
		} else {
			$$global.showLoginOverlay();
			return false;
		}
		
	}
	else if (securityJSON.PICKUPS && securityJSON.PICKUPS.allowed == true && obj == "bookaPickup"){
		if(themeDisplay.isSignedIn()) {
			if(securityJSON.PICKUPS.isDown){
				$$global.outageBox({'title': 'Planned Outage',content:"The selected Mytoll service isn't available at the moment. Please try after sometime.", closeBtn:true})
				return false;
			}else{
				return true;
			}
		} else {
			$$global.showLoginOverlay();
			return false;
		}
	}
	else if (securityJSON.SHIPMENT && securityJSON.SHIPMENT.allowed == true && obj == "shipment"){
		if(themeDisplay.isSignedIn()) {
			return true;
		} else {
			$$global.showLoginOverlay();
			return false;
		}
	}
	else{
		if(themeDisplay.isSignedIn()) {
			return true;
		} else {
			$$global.showLoginOverlay();
			return false;
		}
	}
} 

function showHeadCarousel(obj){
	var outageSlider;
	var outageSlides =  obj;
		/*@DOC
		outageSlides = [
			{
			    "type":"out_error",
			    "message":"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
			},
			{
			    "type":"out_warn",
			    "message":"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut pharetra, ligula eget sagittis cursus, dolor ex imperdiet risus."
			}
		];*/
	function loadOutageSlider(done){
	  $.ajax({
		method : 'GET',
		url : '<%=request.getContextPath()%>/partials/outage-slider-main.html',
		cache: false,
		success : function(data){
		  var tmp = Handlebars.compile(data);
		  Handlebars.registerPartial('outageSlider', tmp);
		  outageSlider = tmp;
		  done(tmp);
		},
		fail : function(xhr) {
		  console.log(xhr);
		}
	  });
	};

	function loadOutageSliderEvents(o){
	    //outage slider events will load here
	    if(1 == o.length){
	    	$("#slider-outage").owlCarousel({
		        items: 1,
		        animateOut: 'fadeOut',
		        animateIn: 'fadeIn',
		        loop: false,
		        margin: 10,
		        dots: false,
		        autoplay: false
		    });
		    $("#slider-outage .cust-control-prev, #slider-outage .cust-control-next").hide();
	    }
	    else{
	    	$("#slider-outage").owlCarousel({
		        items: 1,
		        animateOut: 'fadeOut',
		        animateIn: 'fadeIn',
		        loop: true,
		        margin: 10,
		        dots: false,
		        autoplay: true,
		        autoplayTimeout: 6000,
		        autoplayHoverPause:true,
		        autoplaySpeed: 600,
		        mouseDrag: false,
		        touchDrag: false,
		        pullDrag: false,
		        nav: false
		    });

		    var owl_product = $('#slider-outage');
		    $('.outage-slide-ind').mouseover(function(){
		        owl_product.trigger('stop.owl.autoplay');
		    });
		    
		    $('.outage-slide-ind').mouseleave(function(){
		        owl_product.trigger('play.owl.autoplay',[1000]);
		    });

		    $('.cust-control-prev').click(function(){
		        $('.owl-nav > .owl-prev').trigger('click');
		    });

		    $('.cust-control-next').click(function(){
		        $('.owl-nav > .owl-next').trigger('click');
		    });
	    }
	}

	function init(outageSlides){
		
		loadOutageSlider(function(template){
			var content = template(outageSlides);
			$('#wrapper-outage-slider').html(content);
			loadOutageSliderEvents(outageSlides);
		});
	}
	init(outageSlides);
}

</script>