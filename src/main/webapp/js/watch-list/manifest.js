var manifestDetail = {
  functionSettings:[],
  selectedCarrierFuncSettings:{},
};
var printedItemId = [];
var unprintedItemId = [];
var printItemIdArr = [];
var ReprintItemIdArr = [];
var totalPrintItemIdArr = [];
var checkListItem = "";
var checkListItemLineItem = "";
var checkButtonText = "";
var printPath = "";
var fullPath = "";
var shipmentIdArray = [];
var manifestId = "";
var dashboardManifestId = "";
var isThermalCheck = false;
var printerName = "";
var printerType = "";
var labelLineItemIds = "";
var shipmentDetails = {};
var finalParsedData = {};
var formOptions = {};
var manifestLabelStatus = "";
var manifestStatus = "";
var ManifestData = {};
var IsPDF;
var allItemIds = [];
var labelOrientationSingle=false;
var isInternationalLabel=false;
var counter=99;
var printCountLabel=0;
var countPopup=0;
var itemData={};
var LabelcountPopup=0;
var senderAddressesOnly = '';
var effectiveSettings  = '';
var senderAddressesByCountry = '';
var selectedCarrierSettings = '';
var printErrorMessage = {
  "upsService": "UPS DOWN"
};
var isChrome;
var LabelPDFSingle;
hidePageLoader();

$(document).ready(function(event) {
  $.ajaxSetup({
    cache: false
  });
});
/************* START - CREATE MANUAL MANIFEST ***********************/

/*********************CREATE PARTIAL ************************/
var createManualManifest, createManuall, moveManifestDropDownTpl, moveShareTpl, moveShareSuccessConfirmTpl, movePrintShipmentTpl, movePrintLabelTpl, moveCommericalInvoiceTpl, printCloseManifestTpl;

function loadManifestCombinedPartial(done) {
  $.get(partialsPath + '/manifest-combined-partials.html', function(data) {
    var $content = $($.parseHTML(data));
    //$moveManifest = $content.filter("#move-manifest-template").html(),
    $moveManifestDropDown = $content.filter("#move-manifest-dropdown-template").html();
    $moveShare = $content.filter("#share-template").html();
    $moveShareSuccessConfirm = $content.filter("#share-success-confirm-template").html();
    $movePrintShipment = $content.filter("#print-shipment-template").html();
    $movePrintLabel = $content.filter("#print-label-template").html();
    $moveCommericalInvoice = $content.filter("#commerical-invoice-template").html();
    $printCloseManifest = $content.filter("#print-close-manifest-popup-template").html();

    moveManifestDropDownTpl = Handlebars.compile($moveManifestDropDown);
    moveShareTpl = Handlebars.compile($moveShare);
    moveShareSuccessConfirmTpl = Handlebars.compile($moveShareSuccessConfirm);
    movePrintShipmentTpl = Handlebars.compile($movePrintShipment);
    movePrintLabelTpl = Handlebars.compile($movePrintLabel);
    moveCommericalInvoiceTpl = Handlebars.compile($moveCommericalInvoice);
    printCloseManifestTpl = Handlebars.compile($printCloseManifest);
    done();
  }, 'html');
}

function loadCreateManualManifestDashboard(done) {
  $.get(partialsPath + '/create-manual-manifest-popup.html', function(data) {

    var tmp = Handlebars.compile(data);
    Handlebars.registerPartial('createManual', tmp);
    createManuall = tmp;
    done(tmp);
  }, 'html');
}

/********************* Loading Partials ********************/
function manifestPopup(event) {
  event.preventDefault();

   loadManifestPopupData(function(manifestData) {

    loadCreateManualManifestDashboard(function(template) {

      var tmp = template(manifestData);

      $('#create-manifest-placeholder').html(tmp);

      //events
      $('#create-manifest-manuall-wrpr input').val('');

      $('#modal-bg').removeClass('hidden');
      $('#create-manifest-manuall-wrpr').removeClass('hidden');
      $('html,body').animate({
          scrollTop: $('#create-manifest-manuall-wrpr').offset().top
        },
        1000);

      //Manifest name validation
      $('#manifest-name').textInput({
    	  allowedSpecialChar: '-_*@#$%&,.\'?;/ ',
          allowNumbers: true
      });

      //popup close
      $('#close-save-template-popup').on('click', function() {
        $('#modal-bg').addClass('hidden');
        $('#create-manifest-manuall-wrpr').addClass('hidden');
      });

      //dispatch date 
      $('#dispatch-date').weekDaysPicker({autoFill : true});
      /*$('#dispatch-date').attr('data-val', $$libs.dateDDMMYYY());
      $('#dispatch-date').val(YYYYMMDDtofancyDate(reverseDateFormat($$libs.dateDDMMYYY(), '-')));*/

      //Carrier code

      $('#BU-selector').customDropdown({
        filter: true
      });
      $('#sender-selector').addressDropdown({
        filter: true
      });

      $('#sender').on('change', function(event) {
        var senderCode = $(this).val();
        var senderSelected = _.where(senderAddressesByCountry, {
          AddressId: parseInt(senderCode)
        });
        console.log('sender selected');
        console.log(senderSelected);
        formOptions.selectedSenderAddress = senderSelected[0];
        $('#sender-selector .current-selected').attr("placeholder", "Please select sender.");

        $('#sender-selector label').removeClass('error');
        $('#sender-selector .current-selected').val(senderSelected[0].CompanyName);

      });

      $('#business-unit').on('change', function(event) {

        var businessUnit = $(this).val();
        var addressList = getFinalAddresses(businessUnit);
        console.log(addressList);
        fillAddressHtml(addressList);
        formOptions.carrierListSelected = selectedCarrierSettings;
        $('#BU-selector label').removeClass('error');
      });


      $('#BU-selector').on('click', function(){
	        $('#sender-selector').removeClass('open');
      });

    });
   });

}


/***********USING JAVASCRIPT ***********************************/
function extractCarriersList(list) {
    var carrierList = _.map(list, function(obj) {  
        return {
            "carrierCode": obj.CarrierCode,
            "carrierName": obj.CarrierName,
            "carrierActive" : obj.IsCarrierActive
        };
    });
    return _.reject(carrierList,function(obj){
        return obj.carrierActive === false;
    });
}

/*
    Extract default address list 
    out of list passed
*/
function extractAddressTypeList(list, status) {
  return _.filter(list, function(obj) {
    if (obj.AddressType === status) {
      return obj;
    }
  });
}


//Manifest Popup data
function loadManifestPopupData(done) {
  $.ajax({
    url: shipmentDataResourceUrl,
    method: 'GET',
    dataType: 'json',
    success: function(res) {
      finalParsedData = {};
      formOptions = {};
      /*
          assigning all values to master shipment object
      */
    	
    	//var stringify = JSON.stringify(data);
      //var parseJson = JSON.parse(res.data);
    	var parseJson = res.data;
      //console.log(parseJson);

      // get and parse all data
      //console.log(parseJson.functionSettings);
      var functionSettingsString = parseJson.functionSettings;
      var functionSettingsParsed = JSON.parse(functionSettingsString);
      //console.log(functionSettingsParsed);

      var addressString = parseJson.addresses;
      var addressStringParsed = JSON.parse(addressString);
      //console.log(addressStringParsed);

      var carriersString = parseJson.carrierAccounts;
      var carriersParsed = JSON.parse(carriersString);
      carriersParsed = _.reject(carriersParsed,function(obj){
          return obj.IsCarrierActive === false;
      }); 
      //console.log(carriersParsed);

      var finalData = {
          "functionSettings": functionSettingsParsed,
          "addresses" : addressStringParsed,
          "carrierAccounts" : carriersParsed
      }

      //console.log(finalData);

      //filter sender address only
      senderAddressesOnly = _.filter(finalData.addresses, function(obj){ 
          return String(obj.AddressType) == 'S' || (obj.AddressType) == 'G'; 
      });
      //console.log(senderAddressesOnly);

      //tested code (working fine)
      effectiveSettings = finalData.functionSettings.Function[0]['EffectiveSettings'];
      //console.log(effectiveSettings);

      finalParsedData = finalData;

      hidePageLoader();
      done(finalData);
    },
    error: function(xhr) {
      hidePageLoader();
      done({});
    }
  });
}

function fillAddressHtml(addressList){
    var addressHtml = '';
    for(var i = 0; i < addressList.length; i++){
    	var addLine1 = addressList[i].AddressLine1 ? addressList[i].AddressLine1 +", " : "";
    	var addLine2 = addressList[i].AddressLine2 ? addressList[i].AddressLine2 +", " : "";
    	var suburb = addressList[i].Suburb ? addressList[i].Suburb +", " : "";
    	var State = addressList[i].State ? addressList[i].State +", " : "";
    	var Postcode = addressList[i].Postcode ? addressList[i].Postcode +", " : "";
    	var CountryCode = addressList[i].CountryCode ? addressList[i].CountryCode : "";
    	var ContactNumber = addressList[i].ContactNumber ? addressList[i].ContactNumber : "";
    	var contactName = addressList[i].ContactFirstName ? addressList[i].ContactFirstName : "";
    	
        addressHtml +=  '<li data-val="'+addressList[i].AddressId+'">'+
                            '<div class="name">'+addressList[i].CompanyName+'</div>'+
                            '<div class="contact-name">' + contactName + '</div>' +
                            '<div class="address">'+ addLine1 + addLine2 + suburb + State + Postcode + CountryCode +'</div>'+
                            '<div class="phone">'+ ContactNumber +'</div>'+
                        '</li>';
    }
    $('.address-list-ul').html(addressHtml);
}

function getFinalAddresses(carrierCode,finalAddressList){
    selectedCarrierSettings = _.find(effectiveSettings, function(obj) {
        return String(obj.CarrierSettings.Carrier) === String(carrierCode);
    });
    //console.log(selectedCarrierSettings);

    var getCountryCode = selectedCarrierSettings.CarrierSettings.Settings.countries;
    //console.log(getCountryCode);

    //now we will specific sender addresses specified by countryCode
    senderAddressesByCountry = _.filter(senderAddressesOnly, function(obj){ 
        return String(obj.CountryCode) == getCountryCode; 
    });
    //console.log(senderAddressesByCountry);
    return senderAddressesByCountry;
}






function saveManifest(event) {

  if ($('#BU-selector .current-selected').val() == "") {
    $('#BU-selector .current-selected').attr("placeholder", "Please select value.").parent().addClass("error").focus();
  }

  if ($('#sender-selector #sender').val() == "") {

    $('#sender-selector .current-selected').attr("placeholder", "Please select value.").parent().addClass("error").focus();
  }

  if (($('#BU-selector .current-selected').val() != "") && ($('#sender-selector #sender').val() != "")) {
    //validateCarrierCode_SenderAddress($('#business-unit').val(),$('#sender').val(),done);
    event.preventDefault();
    console.log($('#dispatch-date').attr('data-val'), $('#business-unit').val(), $('#sender').val(), $('#manifest-name').val());
    console.log("formOptions.selectedSenderAddress", formOptions.selectedSenderAddress);
    console.log("formOptions.carrierListSelected "+formOptions.carrierListSelected);
    var tollCarCode = $('#business-unit').val();
    var manifestDBID;
    var date = $('#dispatch-date').attr('data-val');
    var dispatchDate = date.split("-").reverse().join("-");
    var createManualManifestDashboard = {
      "createManifest": {
        "manifest": {
          "tollCarrierCode": $('#business-unit').val(),
          "tollCarrierName": formOptions.carrierListSelected.CarrierSettings.CarrierName,
          "dispatchDate": dispatchDate,
          "manifestName": $('#manifest-name').val(),
          "customerCode": "",

          "senderAddress": {
            "addressId": formOptions.selectedSenderAddress.AddressId,
            "abn": "",
            "companyName": formOptions.selectedSenderAddress.CompanyName,
            "contactName": formOptions.selectedSenderAddress.ContactFirstName,
            "workPhoneNumber": formOptions.selectedSenderAddress.ContactNumber,
            "mobileNumber": "",
            "email": formOptions.selectedSenderAddress.ContactEmail,
            "addressLine1": formOptions.selectedSenderAddress.AddressLine1,
            "addressLine2": formOptions.selectedSenderAddress.AddressLine2,
            "postCode": formOptions.selectedSenderAddress.Postcode,
            "suburb": formOptions.selectedSenderAddress.Suburb,
            "state": formOptions.selectedSenderAddress.State,
            "city": formOptions.selectedSenderAddress.City,
            "countryCode": formOptions.selectedSenderAddress.CountryCode,
            "addressNote": formOptions.selectedSenderAddress.Metadata.AdditionalAddressNotes,
            "accountCode": "",
            "latitude": formOptions.selectedSenderAddress.Metadata.Latitude,
            "longitude": formOptions.selectedSenderAddress.Metadata.Longitude,
            "dpId": formOptions.selectedSenderAddress.Metadata.Dpid,
            "gnafPid": formOptions.selectedSenderAddress.Metadata.GnafPid,
            "addressType": formOptions.selectedSenderAddress.AddressType,
            "avsConfidenceLevel": formOptions.selectedSenderAddress.Metadata.AvsConfidenceLevel,
            "notify": true,
            "dgContactName": formOptions.selectedSenderAddress.DgContactFirstName,
            "dgContactNumber": formOptions.selectedSenderAddress.DgContactNumber
          }
        }
      }
    };

    console.log(createManualManifestDashboard);
   

    $.ajax({
      url: createManualManifestURL,
      method: 'GET',
      dataType: 'json',
      async: false,
      data: {
        createManifestObject: JSON.stringify(createManualManifestDashboard)
      },
      success: function(res) {
          /*if(res.success == true){
             manifestDBID = res.data.manifestId;
             window.location.href = manifestPageURL + "&p_p_manifest_id=" + manifestDBID + "&p_p_carrier_id=" + tollCarCode;
          }
           else{
               $$global.alertBox({
                 class: 'alert',
                 icon: 'ico-alert',
                 content: res.message,
                 title: "Move Manifest"
               });
          }*/
       	  if(res.success == true){
       		  manifestDBID = res.data.manifestId;
                 window.location.href = manifestPageURL + "&p_p_manifest_id=" + manifestDBID + "&p_p_carrier_id=" + tollCarCode;
             }
             else{
                 if(typeof(res.message) == String){
                        $$global.alertBox({
                          class: 'alert',
                          icon: 'ico-alert',
                          content: res.message,
                          title: "Move Manifest"
                        });
                       }
                       else{
                              $$global.alertBox({
                               class: 'alert',
                               icon: 'ico-alert',
                               content: res.message[0].message,
                               title: "Move Manifest"
                             });
                       }
                
            }
       	  
       	  
       	  

         },
      error: function(xhr) {
        hidePageLoader();
        done();
      }
    });


    //console.log(manifestPageURL);
    //console.log("&p_p_manifest_id=" + manifestDBID  + "&p_p_carrier_id=" + tollCarCode);
    /*if ((manifestDBID != "") && (tollCarCode != "")) {
        
    }*/
  }

}

/************* END - CREATE MANUAL MANIFEST ***********************/
/************* START - CLOSE AND PRINT MANIFEST POPUP ***********************/

/*********************CREATE PARTIAL ************************/

var printCloseManifestTmp;

function loadPrintCloseManifestDashboard(done) {
  $.get(partialsPath + '/close-print-manifest-popup.html', function(data) {
    var tmp = Handlebars.compile(data);
    Handlebars.registerPartial('createManual', tmp);
    printCloseManifestTmp = tmp;
    done(tmp);
  }, 'html');
}



function closePrintManifestPopup(event, manifestID, carrierCode) {
  event.preventDefault();
  isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  showPageLoader();
  dashboardManifestId = manifestID;
  var inputData = {
    manifestId: manifestID,
    tollCarrier: [carrierCode],
    isItemInfoRequired: true
  };
  
  $.ajax({
    url: getThermalSetting,
    method: 'GET',
    dataType: 'JSON',
    data: {
      //getUserSettingsObject: JSON.stringify(printLabelObject)
    },
    success: function(res) {
      console.log(res);
      if (res.success) {
       var data=res.data;
      //var data=JSON.parse(res.data);
      var isThermalCheckParam = data.IsThermalEnabled;
      var IsLabelPDFSingle = data.IsLabelPDFSingle;
      console.log(isThermalCheckParam);
      // var printerName;
      // var printerType;
      checkPDF(IsLabelPDFSingle);
      if (isThermalCheckParam == true) {
        $.each(data.ThermalPrinters, function(index, element) {
          var isDefault = element.IsDefault;
          if (isDefault == true) {
            printerName = element.Name;
            printerType = element.Type;
          }
        });
        console.log(printerName);
        console.log(printerType);
        checkIsThermalVal(isThermalCheckParam, printerName, printerType);
      }
      loadPrintManifestData(inputData, function(data) {
        console.log("input data inside closeprintmanifestpopup >loadprintmanifestdata", inputData);
        console.log("loadPrintManifestData", data);
        loadPrintCloseManifestDashboard(function(template) {
          console.log("Inside loadPrintManifestDashboard", data);
          var dataJson = JSON.parse(data);
          console.log("dataJson", dataJson);
          ManifestData = dataJson.Manifests[0];
          loadFunctionSettings(function(){
          var dataPrint = findPrintStatus(ManifestData);
          console.log("DataPRINT", dataPrint);
          var manifestDataStaus = false;
          var manifestDataStausFlag = ManifestData.status;
          console.log(manifestDataStausFlag);
          if (manifestDataStausFlag == "P") {
            manifestDataStaus = true;
          }
          var labelOrientation=manifestDetail.selectedCarrierFuncSettings.labelOrientation;
          manifestDetail.shipmentLineItems = ManifestData;
          ManifestData.manifestStatus = manifestDataStaus;
          ManifestData.labelStatus = dataPrint.label;
          ManifestData.activeTab = "L";
          if(ManifestData.labelStatus){
            ManifestData.activeTab = "M";
          }
          ManifestData.isThermal = isThermalCheckParam;
          ManifestData.IsLabelPDFSingle = IsLabelPDFSingle;
          ManifestData.labelOrientation=labelOrientation;
          findLabelStatus(ManifestData.manifestStatus, ManifestData.labelStatus);
          var printedCount = 0;
          var unprintedCount = 0;
          var printedItemId = [];
          var unprintedItemId = [];
          getLabelOrientation(labelOrientation);
          //looping in shipment detail
          var shipments = ManifestData.Shipments.length;
          for (var i = 0; i < shipments; i++) {
            ManifestData.Shipments[i].isAvtiveCheck = "O";
            var shipmentlineLength = ManifestData.Shipments[i].shipmentLines.length;
            //looping in shipment line item
            for (var j = 0; j < shipmentlineLength; j++) {
              if (ManifestData.Shipments[i].shipmentLines[j].status.trim() == "P") {
                ManifestData.Shipments[i].isAvtiveCheck = "P";
              }
              var shipmentlineItemsLength = ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems.length;
              for (var k = 0; k < shipmentlineItemsLength; k++) {
                if (ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isPrinted == 1 && ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isActive == 1) {
                  printedCount++;
                  printedItemId.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);

                } else if (ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isPrinted == 0 && ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isActive == 1) {
                  unprintedCount++;
                  unprintedItemId.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
                }
              }
            }
            ManifestData.Shipments[i].pcount = printedCount;
            ManifestData.Shipments[i].unpcount = unprintedCount;
            ManifestData.Shipments[i].printedItemId = printedItemId;
            ManifestData.Shipments[i].unprintedItemId = unprintedItemId;
            printedCount = 0;
            unprintedCount = 0;
            printedItemId = [];
            unprintedItemId = [];
          var selectedServiceSettings = _.find(manifestDetail.selectedServices,function(obj){
             return String(obj.Code) === String(ManifestData.Shipments[i].serviceCode);
          });
          ManifestData.Shipments[i].serviceSettings = selectedServiceSettings.Settings;
          ManifestData.Shipments[i].carrierSettings = manifestDetail.selectedCarrierFuncSettings;
          if(manifestDetail.selectedCarrierFuncSettings.commodityCodeType == ''){
            ManifestData.Shipments[i].carrierSettings.isDisableBillingType = false;
          }
          else{
            ManifestData.Shipments[i].carrierSettings.isDisableBillingType = true;
          }
          }

         var rePrintedData=ManifestData.Shipments;
          if(dataPrint.label == true){
            sortLabelData(rePrintedData);
          }
          var isShipmentAllowed = findPrintAllowStatus(ManifestData);
          console.log(isShipmentAllowed);
          ManifestData.isShipmentAllowed =isShipmentAllowed;
          console.log("ManifestData", ManifestData);

          var tmp = template(ManifestData);

          $('#create-manifest-placeholder').html(tmp);

          $('#modal-bg,#print-mani-popup').removeClass('hidden');
          $('html,body').animate({
              scrollTop: $('#print-mani-popup').offset().top
            },
            1000);

          $('.mani-popup-main .mani-popup-close').on('click', function(event) {
            $('#modal-bg,#print-mani-popup').addClass('hidden');
            //window.location.reload();
            $(this).unbind(event);
          });

          loadEvent();
          hidePageLoader();
        });
        });
      });
      }
      else{
         hidePageLoader();
          showAjaxAlert();
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      hidePageLoader();
      showAjaxAlert();
      //error handling stuff
    }
  });
}
function checkPDF(param){
    LabelPDFSingle = param;
  }

function getLabelOrientation(Orientation){
    labelOrientationSingle = false;
    if(Orientation == "P"){
      labelOrientationSingle = true;
    }
  }

  function sortLabelData(data){
  console.log(data);
  var shipments = data;
  for (var i = 0; i < shipments.length; i++) {
      var t = [];
      var pivot;
      for (var j = 0; j < shipments[i].shipmentLines.length; j++) {
        if (shipments[i].shipmentLines[j].shipmentLineItems) {
          for (var k = 0; k < shipments[i].shipmentLines[j].shipmentLineItems.length; k++) {
            if (shipments[i].shipmentLines[j].shipmentLineItems[k].isPrinted == 1 && shipments[i].shipmentLines[j].shipmentLineItems[k].isActive == 1){
              if(shipments[i].shipmentLines[j].shipmentLineItems[k].itemLabelNo){
                t.push(shipments[i].shipmentLines[j].shipmentLineItems[k].itemLabelNo);
              }
            }
          }
        }
      }
      try{   
      t.sort(function(b, a){return a-b});
      pivot = counter-t[0].slice(-2);
      itemData[shipments[i].shipmentId] = {'item_label':t,'printCountLabel':pivot,'isInternational':shipments[i].serviceSettings.isInternational};
      }
      catch(e){
        console.log(e);
        itemData[shipments[i].shipmentId] = {'item_label':t,'printCountLabel':undefined,'isInternational':shipments[i].serviceSettings.isInternational};
      }
    }
   console.log(itemData);
  }

function loadFunctionSettings(done){
   $.ajax({
        url: getFunctionalSetting,
        type: 'GET',
        datatype:'json',
        success: function(data){
            if (data) {
                // console.log("Fn Data", JSON.parse(data));
                var functionSettings = JSON.parse(data);
                manifestDetail.functionSettings = JSON.parse(functionSettings.functionSettings).Function[0].EffectiveSettings;
                console.log(manifestDetail.functionSettings);
                var selectedCarrierSettingsPrint = _.find(manifestDetail.functionSettings,function(obj){
                    return String(obj.CarrierSettings.Carrier) === String(ManifestData.tollCarrierCode);
                });
                manifestDetail.selectedCarrierFuncSettings = selectedCarrierSettingsPrint.CarrierSettings.Settings;
                manifestDetail.selectedServices = selectedCarrierSettingsPrint.ServiceSettings;
                console.log('selected service setting');
                console.log(selectedCarrierSettingsPrint);
                console.log('manifestDetail.selectedServices');
                console.log(manifestDetail.selectedServices);
                done();
            } else {
                done();
            }
        },
        error:function(xhr){
          hidePageLoader();
          done();
        }
    });
}
// find print popup data
function findPrintStatus(data) {
  var reprintStatus = {
    "label": false,
  };
  var manifest = data;
  var shipments = data.Shipments;
  //checking for label reprint status
  var f = false;
  for (var i = 0; i < shipments.length; i++) {
    for (var j = 0; j < shipments[i].shipmentLines.length; j++) {
      if (shipments[i].shipmentLines[j].status.trim() == "P") {
        reprintStatus.label = true;
        f = true;
      }
      if (f) {
        break;
      };
    }
    if (f) {
      break;
    };
  }
  return reprintStatus;
}

// find print Allow status
function findPrintAllowStatus(data) {
  var printStatusShipment = {
    "shipStatus": true,
  };
  var shipments = data.Shipments;
  //checking status for shipment allow
  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].carrierSettings.ceAllowConnotePrint == false) {
        printStatusShipment['shipStatus'] = false;
        break;
      }
    }
  return printStatusShipment;
}
//Ajax call to fetch Manifest & Print data paramData paramData : JSON.stringify(inputData)
// get status
function findLabelStatus(manifestStatusData, labelStatusData) {
  manifestStatus = "";
  manifestLabelStatus = "";
  manifestStatus = manifestStatusData;
  manifestLabelStatus = labelStatusData;
}

function loadPrintManifestData(inputData, done) {
  console.log("loadPrintManifestData ===> input Data", inputData);
  $.ajax({
    url: getManifestURL,
    type: 'GET',
    datatype: 'json',
    data: {
      getManifestObject: JSON.stringify(inputData)
    },
    success: function(data) {
      var closePrintManifest = data;
      if ((closePrintManifest.length == 0)) {
        console.log("No data is returned");
        showAjaxAlert("No data is returned");
      } else {
        //console.log("DATA====>",closePrintManifest);
        //var tmp = JSON.parse(closePrintManifest);
        //console.log("tmp",tmp);       

        done(data);
      }
    },
    error: function(xhr) {
      hidePageLoader();
      done();
    }
  });
}



function loadEvent() {
  // console.log(localStorage.getItem('comInvoiceBtnStatus'));
  /* print & close popup js */
  $('.manifest-tab-list > li > a').click(function(event) {
    checkListItem = $(this).text();
    if (!$(this).hasClass('active')) {
      var tab = $(this).data('tab');
      $('.manifest-tab-list > li > a').removeClass('active');
      $('.mani-tab, .manifest-btn-wrap').removeClass('active');
      $(this).addClass('active');
      $('.' + tab).addClass('active');
    }
    event.preventDefault();
  });

  /* shipment open & close */
  $('p.ship-close-btn').on('click', function(event) {
    if ($(this).children('a').hasClass('opened')) {
      $(this).children('a').text('Open');
      $(this).children('a').removeClass('opened');
      $(this).children('a').parents('.ship-col-ind').next().slideUp();
      $(this).children('i').removeClass('down');

    } else {
      $(this).children('a').text('Close');
      $(this).children('a').addClass('opened');
      $(this).children('a').parents('.ship-col-ind').next().slideDown();
      $(this).children('i').addClass('down');

    }

    event.preventDefault();
    event.stopPropagation();
  });

  /* $('.ship-close-btn i').on('click', function(event){            
      $('.ship-close-btn').click();
      event.preventDefault();
  }); */

  $('#manually-create-manifest').on('click', function(event) {
    $('#modal-bg,#create-manifest-manuall-wrpr').removeClass('hidden');
    /*
     * $('html,body').animate({ scrollTop:
     * $('#create-manifest-manuall-wrpr').offset().top },1000);
     */
    $('#close-save-template-popup').on('click', function(event) {
      $('#modal-bg,#create-manifest-manuall-wrpr').addClass('hidden');
      $(this).unbind(event);
    });
  });

  $('.move-shipment-btn').on('click', function(event) {
    $('#print-shipment-wrpr').addClass('hidden');
    $('#modal-bg,#move-manifest-wrpr').removeClass('hidden');
    $('html,body').animate({
      scrollTop: $('#move-manifest-wrpr').offset().top
    }, 1000);

  });
  $('#close-move-shipment-popup').on('click', function(event) {
    $('#modal-bg,#move-manifest-wrpr').addClass('hidden');
    $(this).unbind(event);
  });
  //label print 
  $('.print-state-list > li > .printing-state-ind').click(function() {
    if (!$(this).parent('li').hasClass('active')) {
      $(this).parent('li').siblings().removeClass('active');
      $(this).parent('li').addClass('active');
      $('#quad-print-value').attr('value', $(this).children('h3').text());
    }
  });

  if ($("input[name='printing-option-op2']").is(':checked')) {
    IsPDF = 'false';
    console.log(IsPDF);
  }

  $("input[name='printing-option-op2']").on('change', function() {
    if ($(this).val() == "1") {
      IsPDF = '';
      IsPDF = 'true';
      console.log(IsPDF);
      $('.print-state-list').removeClass('hidden');
      $('.print-state-list-single').addClass('hidden');
      $('.quad-printing-option').removeClass('hidden');
    } else {
      IsPDF = '';
      IsPDF = 'false';
      console.log(IsPDF);
      $('.print-state-list-single').removeClass('hidden');
      $('.print-state-list').addClass('hidden');
      $('.quad-printing-option').addClass('hidden');
    }
  });


  $('.shipment-btn-link').click(function() {
    $('#modal-bg').removeClass('hidden');
    $('#print-shipment-wrpr').removeClass('hidden');
    $('html,body').animate({
      scrollTop: $('#print-shipment-wrpr').offset().top
    }, 1000);
  });
  $('.label-btn-link').click(function() {
    $('#modal-bg').removeClass('hidden');
    $('#print-label-wrpr').removeClass('hidden');
    $('html,body').animate({
      scrollTop: $('#print-label-wrpr').offset().top
    }, 1000);
  });

  $(".ico-arrow-down-green").click(function() {
    $(this).toggleClass("down");
  })

  $('.ci-popup-close').click(function() {
    $('#modal-bg').addClass('hidden');
    $('#ci-wrpr').addClass('hidden');
  });

  /*
   * $('.ship-print-btn').click(function(event){ event.preventDefault();
   * 
   * $('#print-mani-popup').addClass('hidden');
   * $('#print-shipment-wrpr').addClass('hidden');
   * $('#modal-bg').removeClass('hidden');
   * $('#ci-wrpr').removeClass('hidden'); $('html,body').animate({ scrollTop:
   * $('#ci-wrpr').offset().top },1000); });
   */
  //delete popup 

  var mapThis;
  $('.ship-delete-btn').click(function(event) {

    $('.del-ship-btnwrap > .yes-btn').attr('data-val', $(this).attr('data-val'));
    $('#modal-bg').removeClass('hidden');
    $('#del-shipment-wrpr').removeClass('hidden');
    $('html,body').animate({
      scrollTop: $('#del-shipment-wrpr').offset().top
    }, 1000);
    mapThis = $(this);
    event.preventDefault();
  });
  $('.del-ship-btnwrap > .yes-btn').click(function() {

    deleteShipmentById($(this).attr('data-val'));
  });
  $('.del-popup-close, .del-ship-btnwrap > .no-btn').click(function(event) {
    $('#modal-bg').addClass('hidden');
    $('#del-shipment-wrpr').addClass('hidden');
    event.preventDefault();
  });
  // check shipment checkbox label
  $('#shipment-check').on('change', function() {
    if ($('#shipment-check').hasClass('allChecked')) {
      $('input[name="shipCheck"]').prop('checked', false);
      $('#shipment-check').removeClass('allChecked');
    } else {
      $('input[name="shipCheck"]').prop('checked', true);
      allItemIds = getAllItemIDs();
      console.log(allItemIds);
      $('#shipment-check').addClass('allChecked');
    }

  });
  $('#cb-header-ship').on('change', function() {
    if ($('#cb-header-ship').hasClass('allCheckedManifest')) {
      $('input[name="consignment-list"]').prop('checked', false);
      $('#cb-header-ship').removeClass('allCheckedManifest');
    } else {
      $('input[name="consignment-list"]').prop('checked', true);
      $('#cb-header-ship').addClass('allCheckedManifest');
    }
  });
}

/************* START - PRINT SCRIPT ***********************/

//Print and close Manifest function
function printCloseManifest() {
  loadManifestCombinedPartial(function() {

    var tmp = printCloseManifestTpl(manifestDetail.shipmentLineItems);
    $('#manifest-popup-placeholder').html(tmp);
    //To close popup
    $('.mani-popup-main .mani-popup-close').on('click', function(event) {
      $('#modal-bg,#print-mani-popup').addClass('hidden');
      $(this).unbind(event);
    });
    //toggle b/w print & Manifest [in side popup]
    $('.manifest-tab-list > li > a').click(function(event) {
      checkListItem = $(this).text();
      if (!$(this).hasClass('active')) {
        var tab = $(this).data('tab');
        $('.manifest-tab-list > li > a').removeClass('active');
        $('.mani-tab, .manifest-btn-wrap').removeClass('active');
        $(this).addClass('active');
        $('.' + tab).addClass('active');
      }
      event.preventDefault();
    });
  });
}


function checkIsThermalVal(isThermalCheckParam, printerNameParam, printerTypeParam) {
  isThermalCheck = isThermalCheckParam;
  printerName = printerNameParam;
  printerType = printerTypeParam;
}

//function to load manifest & Shipment to print inside the shipment.
function openPrintShipmentPop(shipmentID) {
  // console.log('shipmentID',shipmentID);
  checkListItemLineItem = $('#line-ship-name').text();
  console.log(shipmentID);


  var printShipmentDetail = {};
  var shipID = shipmentID;
  var manifestData = manifestDetail.SingleManifestData;
  $.each(manifestData.Manifests[0].Shipments, function(key, value) {
    if (this.shipmentId == shipID) {
      printShipmentDetail.shipmentId = shipmentID;
      printShipmentDetail.shipmentNumber = this.shipmentNumber;
      printShipmentDetail.receivercompanyName = this.receiverAddress.companyName;
      printShipmentDetail.receiverLocation = this.receiverAddress.state + "," + this.receiverAddress.suburb;
    }
  });
  //Parital
  loadManifestCombinedPartial(function() {
    var tmp = movePrintShipmentTpl(printShipmentDetail);
    $('#manifest-popup-placeholder').html(tmp);
    //To close popup
    $('.print-popup-close').click(function() {
      $('#modal-bg').addClass('hidden');
      $('#print-shipment-wrpr').addClass('hidden');
    });
  });
}


function printLabel() {
  checkButtonText = "Print";

  $('#modal-bg,#print-label-wrpr').addClass('hidden');

  $('#modal-bg').removeClass('hidden');

  $('#confirmation-wrpr').removeClass('hidden');

  $('#confirmation').text("Printing the label will lock the line item and no further changes can be made.");

  $('html,body').animate({

    scrollTop: $('#confirmation-wrpr').offset().top

  }, 1000);

  $('#confirm-popup-close').click(function() {

    $('#modal-bg').addClass('hidden');

    $('#confirmation-wrpr').addClass('hidden');

    $('#modal-bg,#print-label-wrpr').removeClass('hidden');
  });

}

function downloadLabel() {
  checkButtonText = "Download";

  $('#modal-bg,#print-label-wrpr').addClass('hidden');

  $('#modal-bg').removeClass('hidden');

  $('#confirmation-wrpr').removeClass('hidden');

  $('#confirmation').text("Printing the label will lock the line item and no further changes can be made.");

  $('html,body').animate({

    scrollTop: $('#confirmation-wrpr').offset().top

  }, 1000);

  $('#confirm-popup-close').click(function() {

    $('#modal-bg').addClass('hidden');

    $('#confirmation-wrpr').addClass('hidden');

    $('#modal-bg,#print-label-wrpr').removeClass('hidden');
  });
}

function printShipment() {

  checkButtonText = "Print";

  var shipmentIdLineItem = $('#div-ship-id .td-ship-id').attr('data-printshipmentid');
  console.log(shipmentIdLineItem);

  $('#modal-bg,#print-shipment-wrpr').addClass('hidden');

  $('#modal-bg').removeClass('hidden');

  $('#confirmation-wrpr').removeClass('hidden');

  $('#confirmation').text("Printing the shipment will lock the shipment and no further changes can be made.");

  $('html,body').animate({

    scrollTop: $('#confirmation-wrpr').offset().top

  }, 1000);

  $('#confirm-popup-close').click(function() {

    $('#modal-bg').addClass('hidden');

    $('#confirmation-wrpr').addClass('hidden');

    $('#modal-bg,#print-shipment-wrpr').removeClass('hidden');
  });

  return shipmentIdLineItem;

}

function downloadShipment() {
  checkButtonText = "Download";

  var shipmentIdLineItem = $('#div-ship-id .td-ship-id').data('printshipmentid');

  $('#modal-bg,#print-shipment-wrpr').addClass('hidden');

  $('#modal-bg').removeClass('hidden');

  $('#confirmation-wrpr').removeClass('hidden');

  $('#confirmation').text("Printing the shipment will lock the shipment and no further changes can be made.");

  $('html,body').animate({

    scrollTop: $('#confirmation-wrpr').offset().top

  }, 1000);

  $('#confirm-popup-close').click(function() {

    $('#modal-bg').addClass('hidden');

    $('#confirmation-wrpr').addClass('hidden');

    $('#modal-bg,#print-shipment-wrpr').removeClass('hidden');
  });

  return shipmentIdLineItem;
}

// manifest label preview
function previewManifestLabel() {
  if ($("input[name='shipCheck']").is(':checked')) {
    previewShipmentLabel();
  } 
  else{
     //all are unchecked
    var text='Label';
    var message='Please select atlest one label';
    showAlert(text,message);
    return;
  }
}
// manifest label print
function printManifestLabel() {
  if ($("input[name='shipCheck']").is(':checked')) {
    printShipmentLabel();
  } else{
  //all are unchecked
    var text='Label';
    var message='Please select atlest one label';
    showAlert(text,message);
    return;
  }
  
}
// manifest label downloading
function downloadManifestLabel() {
  if ($("input[name='shipCheck']").is(':checked')) {
    downloadShipmentLabel();
  }else{
    //all are unchecked
    var text='Label';
    var message='Please select atlest one label';
    showAlert(text,message);
    return;
  }
}

// manifest label thermal printer
function printManifestThermalLabel() {
  checkButtonText = "ThermalManifestLabel";
  if ($("input[name='shipCheck']").is(':checked')) {

    manifestPrintThermal();
  }
  else{
    //all are unchecked
    var text='Label';
    var message='Please select atlest one label';
    showAlert(text,message);
    return;
  }
}

function previewManifestShipment() {
  checkButtonText = "shipmentManifestPreview";
  if ($("input[name='finalize-manifest']").is(':checked') && ($("input[name='consignment-list']").is(':checked'))) {
    return manifestPrintPreview();
  } else if ($("input[name='finalize-manifest']").is(':checked')) {
    return manifestPrintPreview();
  }else if ($("input[name='consignment-list']").is(':checked')) {
    return manifestPrintPreview();
  }else{
    var text='Manifest';
    var message='please select atleast one shipment or manifest';
    showAlert(text,message);
    return;
  }
}

function printManifestShipment() {
  checkButtonText = "shipmentManifestPrint";
  if ($("input[name='finalize-manifest']").is(':checked') && ($("input[name='consignment-list']").is(':checked'))) {
    return manifestPrintPreview();
  } else if ($("input[name='finalize-manifest']").is(':checked')) {
    return manifestPrintPreview();
  }else if ($("input[name='consignment-list']").is(':checked')) {
    return manifestPrintPreview();
  }else{
    var text='Manifest';
    var message='please select atleast one shipment or manifest';
    showAlert(text,message);
    return;
  } 
}

function downloadManifestShipment() {
  checkButtonText = "shipmentManifestDownload";
  if ($("input[name='finalize-manifest']").is(':checked') && ($("input[name='consignment-list']").is(':checked'))) {
    return manifestPrintPreview();
  } else if ($("input[name='finalize-manifest']").is(':checked')) {
    return manifestPrintPreview();
  }else if ($("input[name='consignment-list']").is(':checked')) {
      return manifestPrintPreview();
  }else{
    var text='Manifest';
    var message='please select atleast one shipment or manifest';
    showAlert(text,message);
    return;
    }
  }

function manifestPrintPreview() {
  var shipmentWithLabelIds = [];
  manifestId = [];
  var shipmentCount = manifestDetail.shipmentLineItems.Shipments.length;
  for (var i = 0; i < shipmentCount; i++) {
    // shipmentWithLabelIds.push(manifestDetail.shipmentLineItems.Shipments[i].shipmentId);
    var shipId = manifestDetail.shipmentLineItems.Shipments[i].shipmentId;
    var labId = [];
    var shipmentLinesCount = manifestDetail.shipmentLineItems.Shipments[i].shipmentLines.length;
    for (var j = 0; j < shipmentLinesCount; j++) {
      var labelCount = manifestDetail.shipmentLineItems.Shipments[i].shipmentLines[j].shipmentLineItems.length;
      for (var k = 0; k < labelCount; k++) {
        // shipmentWithLabelIds[i].labelIds=[];
        // shipmentWithLabelIds[i].labelIds.push(manifestDetail.shipmentLineItems.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
        // obj.labelIds = manifestDetail.shipmentLineItems.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId;
        labId.push(manifestDetail.shipmentLineItems.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);

      }
    }
    shipmentWithLabelIds.push({
      "shipmentWithLabelIds": shipId,
      "labelIds": labId
    });
    console.log(shipmentWithLabelIds);
    manifestId.push(manifestDetail.shipmentLineItems.Shipments[i].manifestId);
  }
  console.log(shipmentWithLabelIds);
  if (checkButtonText.trim() == "shipmentManifestPreview") {
    // Preview Shipments Manifest
    checkButtonText = "";
    if ($("input[name='finalize-manifest']").is(':checked') && ($("input[name='consignment-list']").is(':checked'))) {
      manifestId = "";
      manifestId = ManifestData.manifestId;
      var shipmentID = [];
      $(".cb-list-ship:checked").each(function() {
        var shipmentnum = $(this).attr('data-shipmentid');
        shipmentID.push(shipmentnum);
      });
      manifestWithShipmentsPreview(manifestId, shipmentID);
    }
    else if ($("input[name='finalize-manifest']").is(':checked')) {
      manifestId = "";
      manifestId = ManifestData.manifestId;
      manifestOnlyPreview(manifestId);
    } else if ($("input[name='consignment-list']").is(':checked')) {
      var shipmentID = [];
      $(".cb-list-ship:checked").each(function() {
        var shipmentnum = $(this).attr('data-shipmentid');
        shipmentID.push(shipmentnum);
      });
      shipmentsOnlyPreview(shipmentID);
    }
  }
  if (checkButtonText.trim() == "shipmentManifestPrint") {
  // Print Manifest shipment
  checkButtonText = "";
  if ($("input[name='finalize-manifest']").is(':checked') && ($("input[name='consignment-list']").is(':checked'))) {
     manifestId = "";
    manifestId = ManifestData.manifestId;
    var shipmentID = [];
    $(".cb-list-ship:checked").each(function() {
      var shipmentnum = $(this).attr('data-shipmentid');
      shipmentID.push(shipmentnum);
    });
    manifestWithShipmentsPrint(manifestId, shipmentID);
  }
  else if ($("input[name='finalize-manifest']").is(':checked')) {
     manifestId = "";
    manifestId = ManifestData.manifestId;
    manifestOnlyPrint(manifestId);
  }else if ($("input[name='consignment-list']").is(':checked')) {
    var shipmentID = [];
    $(".cb-list-ship:checked").each(function() {
      var shipmentnum = $(this).attr('data-shipmentid');
      shipmentID.push(shipmentnum);
    });
    shipmentsOnlyPrint(shipmentID);
  }
  }  
  if (checkButtonText.trim() == "shipmentManifestDownload") {
    // Download Manifest shipment
    checkButtonText = "";
     if ($("input[name='finalize-manifest']").is(':checked') && ($("input[name='consignment-list']").is(':checked'))) {
      manifestId = "";
      manifestId = ManifestData.manifestId;
      var shipmentID = [];
      $(".cb-list-ship:checked").each(function() {
        var shipmentnum = $(this).attr('data-shipmentid');
        shipmentID.push(shipmentnum);
      });
      manifestWithShipmentsDownload(manifestId, shipmentID);
    }
    else if ($("input[name='finalize-manifest']").is(':checked')) {
      manifestId = "";
      manifestId = ManifestData.manifestId;
      manifestOnlyDownload(manifestId);
    } else if ($("input[name='consignment-list']").is(':checked')) {
      var shipmentID = [];
      $(".cb-list-ship:checked").each(function() {
        var shipmentnum = $(this).attr('data-shipmentid');
        shipmentID.push(shipmentnum);
      });
      shipmentsOnlyDownload(shipmentID);
    }
  }
}

function downloadShipmentLabel() {
  var checkLabelID = [];
  if ($("input[name='shipCheck']").is(':checked')) {
    //atleast one is checked 
    //count the checked once and push label id into "checkLabelID"
    var checkLabel=[];
    var checkShipmentID="";
    $(".check-label:checked").each(function() {
      var shipmentnum = $(this).attr('data-shipmentNum');
      var getShipmentLabelID = getItemIDs(shipmentnum);
      var shipmentIDSingle=$(this).attr('data-shipmentID');
      console.log("shipmentIDSingle",shipmentIDSingle);
      checkShipmentID=shipmentIDSingle;
      console.log(getShipmentLabelID);
      var singleLabelID = getShipmentLabelID.printedItemIds.concat(getShipmentLabelID.unPrintedItemIds);
      console.log(singleLabelID);
      checkLabel=singleLabelID;
      checkLabelID.push({
        "shipmentWithLabelIds": checkShipmentID,
        "labelIds": checkLabel
      });
    });
    var t = true;
    if(manifestLabelStatus== true){
      //check for 99 logic
      for(var i=0;i<checkLabelID.length;i++){
        var pivot = getSingleprintCountLabel(checkLabelID[i].shipmentWithLabelIds);
        var international = getSingleInternational(checkLabelID[i].shipmentWithLabelIds);
        console.log(pivot);
        t = checkPrintOrNotALL(pivot,international,checkLabelID[i].labelIds.length);
        if(!t){
          break;
        }
      }
    }
    if(!t){
        var text='Label';
        var message='You can not download more than 99 label';
        showAlert(text,message);
          return;
      }
      else{
        //You can print now !!!!!!
       console.log(checkLabelID);
       downloadManifestLabelALL(checkLabelID);
      }
    } 
}

function previewShipmentLabel() {
  var checkLabelID = [];
  if ($("input[name='shipCheck']").is(':checked')) {
    //atleast one is checked 
    //count the checked once and push label id into "checkLabelID"
   var checkLabel=[];
    var checkShipmentID="";
    $(".check-label:checked").each(function() {
      var shipmentnum = $(this).attr('data-shipmentNum');
      var getShipmentLabelID = getItemIDs(shipmentnum);
      var shipmentIDSingle=$(this).attr('data-shipmentID');
      console.log("shipmentIDSingle",shipmentIDSingle);
      checkShipmentID=shipmentIDSingle;
      console.log(getShipmentLabelID);
      var singleLabelID = getShipmentLabelID.printedItemIds.concat(getShipmentLabelID.unPrintedItemIds);
      console.log(singleLabelID);
      checkLabel=singleLabelID;
      checkLabelID.push({
        "shipmentWithLabelIds": checkShipmentID,
        "labelIds": checkLabel
      });
    });
    var t = true;
    if(manifestLabelStatus== true){
      //check for 99 logic
      for(var i=0;i<checkLabelID.length;i++){
        var pivot = getSingleprintCountLabel(checkLabelID[i].shipmentWithLabelIds);
        var international = getSingleInternational(checkLabelID[i].shipmentWithLabelIds);
        console.log(pivot);
        t = checkPrintOrNotALL(pivot,international,checkLabelID[i].labelIds.length);
        if(!t){
          break;
        }
      }
    }
    if(!t){
        var text='Label';
          var message='You can not preview more than 99 label';
          showAlert(text,message);
            return;
          }
      else{
        //You can print now !!!!!!
       console.log(checkLabelID);
       previewManifestLabelALL(checkLabelID);
      }
  }
}

//function to find pivot
function getSingleprintCountLabel(shipID){
  return itemData[shipID].printCountLabel;
}
function getSingleInternational(shipID){
  return itemData[shipID].isInternational;
}
function checkPrintOrNotALL(printCountLabel,international,rePrintUnprintData){
    var counterPrintStatus;
    if(printCountLabel){
      if (rePrintUnprintData <= printCountLabel) {
        counterPrintStatus = false;
      } else {
        counterPrintStatus = true;
      }
    }
    else{
        counterPrintStatus = false;
    }
    console.log(labelOrientationSingle);
    if(counterPrintStatus == true && (labelOrientationSingle==true && international==true)){
     return false;
     }
    else{
     return true;
     } 
}

function printShipmentLabel() {
  var checkLabelID = [];
  if ($("input[name='shipCheck']").is(':checked')) {
    //atleast one is checked 
    //count the checked once and push label id into "checkLabelID"
    var checkLabel=[];
    var checkShipmentID="";
    $(".check-label:checked").each(function() {
      var shipmentnum = $(this).attr('data-shipmentNum');
      var getShipmentLabelID = getItemIDs(shipmentnum);
      var shipmentIDSingle=$(this).attr('data-shipmentID');
      console.log("shipmentIDSingle",shipmentIDSingle);
      checkShipmentID=shipmentIDSingle;
      console.log(getShipmentLabelID);
      var singleLabelID = getShipmentLabelID.printedItemIds.concat(getShipmentLabelID.unPrintedItemIds);
      console.log(singleLabelID);
      checkLabel=singleLabelID;
      checkLabelID.push({
        "shipmentWithLabelIds": checkShipmentID,
        "labelIds": checkLabel
      });
    });
    var t = true;
    if(manifestLabelStatus== true){
      //check for 99 logic
      for(var i=0;i<checkLabelID.length;i++){
        var pivot = getSingleprintCountLabel(checkLabelID[i].shipmentWithLabelIds);
        var international = getSingleInternational(checkLabelID[i].shipmentWithLabelIds);
        console.log(pivot);
        t = checkPrintOrNotALL(pivot,international,checkLabelID[i].labelIds.length);
        if(!t){
          break;
        }
      }
    }
    if(!t){
       var text='Label';
        var message='You can not print more than 99 label';
        showAlert(text,message);
          return;
      }
      else{
        //You can print now !!!!!!
       console.log(checkLabelID);
       printManifestLabelALL(checkLabelID);
      }
  } 
}

function manifestPrintThermal() {
  var checkLabelID = [];
  if ($("input[name='shipCheck']").is(':checked')) {
    //atleast one is checked 
    //count the checked once and push label id into "checkLabelID"
   var checkLabel=[];
    var checkShipmentID="";
    $(".check-label:checked").each(function() {
      var shipmentnum = $(this).attr('data-shipmentNum');
      var getShipmentLabelID = getItemIDs(shipmentnum);
      var shipmentIDSingle=$(this).attr('data-shipmentID');
      console.log("shipmentIDSingle",shipmentIDSingle);
      checkShipmentID=shipmentIDSingle;
      console.log(getShipmentLabelID);
      var singleLabelID = getShipmentLabelID.printedItemIds.concat(getShipmentLabelID.unPrintedItemIds);
      console.log(singleLabelID);
      checkLabel=singleLabelID;
      checkLabelID.push({
        "shipmentWithLabelIds": checkShipmentID,
        "labelIds": checkLabel
      });
    });

    var t = true;
    if(manifestLabelStatus== true){
      //check for 99 logic
      for(var i=0;i<checkLabelID.length;i++){
        var pivot = getSingleprintCountLabel(checkLabelID[i].shipmentWithLabelIds);
        var international = getSingleInternational(checkLabelID[i].shipmentWithLabelIds);
        console.log(pivot);
        t = checkPrintOrNotALL(pivot,international,checkLabelID[i].labelIds.length);
        if(!t){
          break;
        }
      }
    }
    if(!t){
       var text='Label';
      var message='You can not print more than 99 label';
      showAlert(text,message);
        return;
      }
      else{
        //You can print now !!!!!!
       console.log(checkLabelID);
       thermalManifestLabelALL(checkLabelID);
      }
  }
}

function thermalManifestLabelALL(ID) {
  assignThermalPrintingConnectionPortID(ID);
  
}

function assignThermalPrintingConnectionPortID(DATA) {
  showPopupPageLoader();
  var serviceURLs = getThermalPrintingServicePorts();
  var serviceUrlLenght = serviceURLs.length;
  var i = 0;
  console.log("serviceURLs",serviceURLs);
  function next() {
    if (i < serviceUrlLenght) {
      $.ajax({
        url: serviceURLs[i] + "/thermal/printers",
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
          console.log(serviceURLs[i]);
          if (data != '') {
            console.log("serviceURLs",data);
            breakOut(serviceURLs[i]);
          }
        },
        error: function(XMLHttpRequest, status, errorThrown) {
          i++;
          if (i == serviceUrlLenght) {
            hidePopupPageLoader();
            var text='Label';
            var message='Thermal printer not found';
            showAlert(text,message);
            return; 
          }
          next();
        }
      });
    }
  }
  next();

  function breakOut(tserviceUrl) {
    printThermal(tserviceUrl,DATA);
  }

}

function getThermalPrintingServicePorts() {
  var minPort = 59342;
  var maxPort = 59752;
  var portIncrement = 10;
  var noOfPorts = (maxPort - minPort) / portIncrement;
  var serviceUrls = [];
  var port = minPort;
  for (i = 0; i < noOfPorts; i++) {
    serviceUrls.push("https://localhost:" + port);
    port = port + portIncrement;
  }
  return serviceUrls;
}

function printThermal(serviceUrl, ID) {
  console.log('In Label Manifest Thermal');
  console.log(ID);
  var labelURL = printShipmentWithLabelJSURLAppend;
  console.log(printerName);
  console.log(printerType);
  var printThermalLabelObject = {
    "printSettings": {
      "IsLabelThermal": true,
      "Thermal": {
        "Printer": printerName,
        "PrinterType": printerType
      },
      "PDF": {
        "IsPDFA4": true,
        "PDFSettings": {
          "StartQuadrant": ""
        }
      }
    },
    "exportType": "L",
    "shipmentWithLabelIdsArray": ID,
  };

  $.ajax({
    url: printShipmentWithLabelJSURL,
    method: 'GET',
    dataType: 'HTML',

    data: {
      printLabelObject: JSON.stringify(printThermalLabelObject)
    },

    success: function(res) {
      res=JSON.parse(res);
      console.log(res);
      if(res.success){
      var thermalData2 = res.data;
      for(var i=0; i<thermalData2.length; i++){
        var printThermalJobData2 = thermalData2[i].printJobData;
        console.log("printThermalJobData2",printThermalJobData2);
          var thermalPrinterURL = serviceUrl;
          $.ajax({
              url: thermalPrinterURL + "/thermal/printRawLabels",
              type: "POST",
              dataType: "json",
              data: JSON.stringify({
              "printJobData": printThermalJobData2,
              "printJobMetadata": printerName
              }),
              contentType: "application/json",
              success: function(data) {
                hidePopupPageLoader();
              },
              error: function(error) {
              console.log('error', error);
              hidePopupPageLoader();
              }
          });
        }
        hidePopupPageLoader();
        }
      else{
        hidePopupPageLoader();
          showAjaxAlert(); 
      }
      // $('#label-preview, #manifest-label-download-btn, #quadrant-label').addClass('hidden');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      hidePopupPageLoader();
      console.log(jqXHR, textStatus, errorThrown);
      showAjaxAlert();
    }
  });
}


function getItemIDs(shipmentNo) {
  //looping in shipment detail
  var printedDATA = {
    "printedItemIds": [],
    "unPrintedItemIds": []
  }
  var shipments = ManifestData.Shipments.length;
  for (var i = 0; i < shipments; i++) {
    if (shipmentNo == ManifestData.Shipments[i].shipmentNumber) {
      var shipmentlineLength = ManifestData.Shipments[i].shipmentLines.length;
      for (var j = 0; j < shipmentlineLength; j++) {
        var shipmentlineItemsLength = ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems.length;
        for (var k = 0; k < shipmentlineItemsLength; k++) {
          if (ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isPrinted == 1 && ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isActive == 1) {
            printedDATA.printedItemIds.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
          }
          if (ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isPrinted == 0 && ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isActive == 1) {
            printedDATA.unPrintedItemIds.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
          }
        }
      }
    }
  }
  console.log("PRINTEDDATA",printedDATA);
  return printedDATA;

}
function previewManifestLabelALL(ID) {
  var startQuadrantValue ="1";
  var checkIsPDFA4=false;
  if(LabelPDFSingle==false){
    checkIsPDFA4=true;
  }
  if(!LabelPDFSingle){
  startQuadrantValue = $('#quad-print-value').val();
  if (startQuadrantValue.trim() == "Q1") {
    startQuadrantValue = "1";
  } else if (startQuadrantValue.trim() == "Q2") {
    startQuadrantValue = "2";
  } else if (startQuadrantValue.trim() == "Q3") {
    startQuadrantValue = "3";
  } else {
    startQuadrantValue = "4";
  }
}
  
  var printLabelObject = {
    "printSettings": {
      "IsLabelThermal": false,
      "Thermal": {
        "Printer": "",
        "PrinterType": ""
      },
      "PDF": {
        "IsPDFA4": checkIsPDFA4,
        "PDFSettings": {
          "StartQuadrant": startQuadrantValue
        }
      }
    },
    "exportType": "L",
    "shipmentWithLabelIdsArray": ID,
  };
  shipmentLabelPreviewData(printLabelObject, 'shipLabelPreview', function(data) {
      var labelURL = printShipmentWithLabelJSURLAppend;
      labelURL=labelURL.replace("fileName=","fileName="+data);
      labelURL=labelURL.replace("isPreview=","isPreview=true");
      console.log(labelURL);
      hidePageLoader();
      $('#manifest-label-tab').addClass('hidden');
      $('#ship-check').addClass('hidden');
      if (document.getElementById('previewManifestLabelFrame')) {
        $("#previewManifestLabelFrame").remove();
      }
      if (document.getElementById('pintManifestFrame')) {
        $("#pintManifestFrame").remove();
      }
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-label-single-frame')) {
        $("#close-label-single-frame").remove();
      }
      var link = labelURL;
      var $frame = $('<iframe>', {
        src: link,
        id: 'previewManifestLabelFrame',
        frameborder: 0,
        class: 'print-preview-iframe',
        style: "width:100%; height:300px;",
        scrolling: 'yes'
      });
      $('#manifest-label-preview').append('<a class="ico-delete closeFrameLabel" id="close-frame" onclick="showPreview()"></a>',$frame);
  });
}
function showPreview() {
  $("#previewManifestLabelFrame").remove();
  $('#manifest-label-tab').removeClass('hidden');
  $('#ship-check').removeClass('hidden');
  $('#close-frame').remove();
}

function downloadManifestLabelALL(ID) {
  var startQuadrantValue ="1";
  var checkIsPDFA4=false;
  if(LabelPDFSingle==false){
    checkIsPDFA4=true;
  }
  if(!LabelPDFSingle){
  startQuadrantValue = $('#quad-print-value').val();
  if (startQuadrantValue.trim() == "Q1") {
    startQuadrantValue = "1";
  } else if (startQuadrantValue.trim() == "Q2") {
    startQuadrantValue = "2";
  } else if (startQuadrantValue.trim() == "Q3") {
    startQuadrantValue = "3";
  } else {
    startQuadrantValue = "4";
  }
}
  var printLabelObject = {
    "printSettings": {
      "IsLabelThermal": false,
      "Thermal": {
        "Printer": "",
        "PrinterType": ""
      },
      "PDF": {
        "IsPDFA4": checkIsPDFA4,
        "PDFSettings": {
          "StartQuadrant": startQuadrantValue
        }
      }
    },
    "exportType": "L",
    "shipmentWithLabelIdsArray": ID,
  };
  shipmentLabelPreviewData(printLabelObject, 'shipLabelDownload', function(data) {
      var downloadlabelURL = printShipmentWithLabelJSURLAppend;
      downloadlabelURL=downloadlabelURL.replace("fileName=","fileName="+data);
      downloadlabelURL=downloadlabelURL.replace("isPreview=","isPreview=true");
      console.log(downloadlabelURL);
      hidePageLoader();
      downloadPDF(downloadlabelURL);
  });
}

function printManifestLabelALL(ID) {
  var startQuadrantValue ="1";
  var checkIsPDFA4=false;
  if(LabelPDFSingle==false){
    checkIsPDFA4=true;
  }
  if(!LabelPDFSingle){
  startQuadrantValue = $('#quad-print-value').val();
  if (startQuadrantValue.trim() == "Q1") {
    startQuadrantValue = "1";
  } else if (startQuadrantValue.trim() == "Q2") {
    startQuadrantValue = "2";
  } else if (startQuadrantValue.trim() == "Q3") {
    startQuadrantValue = "3";
  } else {
    startQuadrantValue = "4";
  }
}
  var printLabelObject = {
    "printSettings": {
      "IsLabelThermal": false,
      "Thermal": {
        "Printer": "",
        "PrinterType": ""
      },
      "PDF": {
        "IsPDFA4": checkIsPDFA4,
        "PDFSettings": {
          "StartQuadrant": startQuadrantValue
        }
      }
    },
    "exportType": "L",
    "shipmentWithLabelIdsArray": ID,
  };
  shipmentLabelPreviewData(printLabelObject, 'shipLabelPrint', function(data) {
      var printlabelURL = printShipmentWithLabelJSURLAppend;
      printlabelURL=printlabelURL.replace("fileName=","fileName="+data);
      printlabelURL=printlabelURL.replace("isPreview=","isPreview=false");
      if(document.getElementById('previewManifestLabelFrame')) {
        $("#previewManifestLabelFrame").remove();
        }
        $('#manifest-label-tab').addClass('hidden');
        $('#ship-check').addClass('hidden');
        if (document.getElementById('close-frame')) {
          $("#close-frame").remove();
        }
        if (document.getElementById('close-label-single-frame')) {
          $("#close-label-single-frame").remove();
        }
        if(document.getElementById('pintManifestFrame')) {
          $("#pintManifestFrame").remove();
          }
      var link = printlabelURL;
      var $frame = $('<iframe>', {
        src: link,
        id: 'pintManifestFrame',
        frameborder: 0,
        scrolling: 'yes'
      });
      $('#manifest-label-preview-first').html($frame);
      $('#manifest-label-preview-first').append('<a class="ico-delete closeFrameLabel" id="close-label-single-frame" onclick="showManifestLabelPreview()"></a>',$frame);
      if(isChrome){
        pintManifestFrame.onload = function() {
          var iframeID = $('#pintManifestFrame').attr('id');
          parent.iframeLoaded(iframeID);
        }
      }
      hidePageLoader();
  });
}
function showManifestLabelPreview() {
  $("#pintManifestFrame").remove();
   $('#manifest-label-tab').removeClass('hidden');
        $('#ship-check').removeClass('hidden');
  $('#close-label-single-frame').remove();
}
function iframeLoaded(iframeId) {
  console.log(iframeId);
   var PDF = document.getElementById(iframeId);
  console.log(PDF);
   PDF.focus();
   PDF.contentWindow.print();
}

function downloadPDF(url) {
  var save = document.createElement('a');
  save.href = url;
  save.download = url;
  var event = document.createEvent("MouseEvents");
        event.initMouseEvent(
            "click", true, false, window, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
  save.dispatchEvent(event);
}

function manifestOnlyPreview(manifestIdParamenter) {
  var ids = [manifestIdParamenter];
  console.log(ids);
  var shipmentIds = [];
  var previewManifestOnlyObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIds
  };
  ManifestPreviewData(previewManifestOnlyObject, 'manifestPreview', function(data) {
     var manifestURL = printManifestJSURLAppend;
      manifestURL=manifestURL.replace("fileName=","fileName="+data);
      manifestURL=manifestURL.replace("isPreview=","isPreview=true");
      hidePageLoader();
      console.log(manifestURL);
      $('#hide-shipment-nd-manifest-wrpr').addClass('hidden');
      $('#mani-message').addClass('hidden');
      if (document.getElementById('previewManifestShipFrame')) {
        $("#previewManifestShipFrame").remove();
      }
      if (document.getElementById('pintManifestShipmentFrame')) {
        $("#pintManifestShipmentFrame").remove();
      }
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-manifest-ship-frame')) {
        $("#close-manifest-ship-frame").remove();
      }
      var link = manifestURL;
      var $frame = $('<iframe>', {
        src: link,
        id: 'previewManifestShipFrame',
        frameborder: 0,
        scrolling: 'yes',
        class: 'print-preview-iframe',
        style: "width:100%; height:300px;"
      });
      $('#manifest-ship-preview').append('<a class="ico-delete closeFrame" id="close-frame" onclick="showManifestPreview()"></a>',$frame);
  });
}

function showManifestPreview() {
  $("#previewManifestShipFrame").remove();
  $('#hide-shipment-nd-manifest-wrpr').removeClass('hidden');
  $('#mani-message').removeClass('hidden');
  $('#close-frame').remove();
}

function manifestOnlyPrint(manifestIdParamenter) {

  var ids = [manifestIdParamenter];
  console.log(ids);
  var shipmentIds = [];
  var printManifestOnlyObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIds
  };
  ManifestPreviewData(printManifestOnlyObject, 'manifestPrint', function(data) {
     var manifestURL = printManifestJSURLAppend;
     if(document.getElementById('previewManifestShipFrame')) {
      $("#previewManifestShipFrame").remove();
      }
      if (document.getElementById('pintManifestShipmentFrame')) {
        $("#pintManifestShipmentFrame").remove();
      }
      $('#mani-message').addClass('hidden');
      $('#hide-shipment-nd-manifest-wrpr').addClass('hidden');
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-manifest-ship-frame')) {
        $("#close-manifest-ship-frame").remove();
      }
    manifestURL=manifestURL.replace("fileName=","fileName="+data);
    manifestURL=manifestURL.replace("isPreview=","isPreview=false");
    console.log(manifestURL);
    callIframe(manifestURL);
      hidePageLoader();
     
  });
}
function callIframe(URL){
  var link = URL;
  var $frame = $('<iframe>', {
    src: link,
    id: 'pintManifestShipmentFrame',
    frameborder: 0,
    scrolling: 'yes'
  });
  $('#manifest-ship-preview-first').append('<a class="ico-delete closeFrame" id="close-manifest-ship-frame" onclick="showManifestShipmentLabelPreview()"></a>',$frame);
  if(isChrome){
    pintManifestShipmentFrame.onload = function() {
      var iframeID = $('#pintManifestShipmentFrame').attr('id');
      parent.iframeLoaded(iframeID);
    }
  }
}
function showManifestShipmentLabelPreview() {
  $("#pintManifestShipmentFrame").remove();
   $('#mani-message').removeClass('hidden');
      $('#hide-shipment-nd-manifest-wrpr').removeClass('hidden');
  $('#close-manifest-ship-frame').remove();
}

function manifestOnlyDownload(manifestIdParamenter) {
  var ids = [manifestIdParamenter];
  console.log(ids);
  var shipmentIds = [];
  var downloadManifestOnlyObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIds
  };
  ManifestPreviewData(downloadManifestOnlyObject, 'manifestDownload', function(data) {
     var manifestURL = printManifestJSURLAppend;
     manifestURL=manifestURL.replace("fileName=","fileName="+data);
     manifestURL=manifestURL.replace("isPreview=","isPreview=true");
      console.log(manifestURL);
      downloadPDF(manifestURL);
      hidePageLoader();
  });
}

function manifestWithShipmentsPreview(manifestIdParamenter, shipmentIdArrayParameter) {
   var ids = [manifestIdParamenter];
  var shipmentIds = shipmentIdArrayParameter;
  console.log(shipmentIds);
  var previewManifestShipmentObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIds
  };
  ManifestPreviewData(previewManifestShipmentObject, 'manifestPreview', function(data) {
     var manifestURL = printManifestJSURLAppend;
     manifestURL=manifestURL.replace("fileName=","fileName="+data);
     manifestURL=manifestURL.replace("isPreview=","isPreview=true");
     console.log(manifestURL);
      hidePageLoader();
      $('#hide-shipment-nd-manifest-wrpr').addClass('hidden');
      $('#mani-message').addClass('hidden');
      if (document.getElementById('previewManifestShipFrame')) {
        $("#previewManifestShipFrame").remove();
      }
      if (document.getElementById('pintManifestShipmentFrame')) {
        $("#pintManifestShipmentFrame").remove();
      }
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-manifest-ship-frame')) {
        $("#close-manifest-ship-frame").remove();
      }
      // $('.print-state-list-single').addClass('hidden');
      var link = manifestURL;
      var $frame = $('<iframe>', {
        src: link,
        id: 'previewManifestShipFrame',
        frameborder: 0,
        scrolling: 'yes',
        class: 'print-preview-iframe',
        style: "width:100%; height:300px;"
      });
      $('#manifest-ship-preview').append('<a class="ico-delete closeFrame" id="close-frame" onclick="showManifestPreview()"></a>',$frame);
  });
}

function manifestWithShipmentsPrint(manifestIdParamenter, shipmentIdArrayParameter) {

  var ids = [manifestIdParamenter];
  var shipmentIds = shipmentIdArrayParameter;
  console.log(shipmentIds);
  var printManifestShipmentObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIds
  };
  ManifestPreviewData(printManifestShipmentObject, 'manifestPrint', function(data) {
     var manifestURL = printManifestJSURLAppend;
     if(document.getElementById('previewManifestShipFrame')) {
      $("#previewManifestShipFrame").remove();
      }
      if (document.getElementById('pintManifestShipmentFrame')) {
        $("#pintManifestShipmentFrame").remove();
      }
      $('#mani-message').addClass('hidden');
      $('#hide-shipment-nd-manifest-wrpr').addClass('hidden');
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-manifest-ship-frame')) {
        $("#close-manifest-ship-frame").remove();
      }
    manifestURL=manifestURL.replace("fileName=","fileName="+data);
    manifestURL=manifestURL.replace("isPreview=","isPreview=false");
    console.log(manifestURL);
    callIframe(manifestURL);
      hidePageLoader();
     
  });
}

function manifestWithShipmentsDownload(manifestIdParamenter, shipmentIdArrayParameter) {
   var ids = [manifestIdParamenter];
    var shipmentIds = shipmentIdArrayParameter;
    console.log(shipmentIds);
    var downloadManifestShipmentObject = {
      'exportType': 'M',
      'ids': ids,
      'shipmentIds': shipmentIds
    };
  ManifestPreviewData(downloadManifestShipmentObject, 'manifestDownload', function(data) {
     var manifestURL = printManifestJSURLAppend;
     manifestURL=manifestURL.replace("fileName=","fileName="+data);
     manifestURL=manifestURL.replace("isPreview=","isPreview=true");
     console.log(manifestURL);
      downloadPDF(manifestURL);
      hidePageLoader();
  });
}

function shipmentsOnlyPreview(shipmentIdArrayParameter) {
  // Preview Shipments Only
 console.log(shipmentIdArrayParameter);
  var manifestURL = printManifestJSURLAppend;
  var ids = [];
  var shipmentIDS=shipmentIdArrayParameter;
  var shipmentOnlyPreviewManifestObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIDS
  };
  ManifestPreviewData(shipmentOnlyPreviewManifestObject, 'manifestPreview', function(data) {
     var manifestURL = printManifestJSURLAppend;
     manifestURL=manifestURL.replace("fileName=","fileName="+data);
     manifestURL=manifestURL.replace("isPreview=","isPreview=true");
     console.log(manifestURL);
     hidePageLoader();
      $('#hide-shipment-nd-manifest-wrpr').addClass('hidden');
      $('#mani-message').addClass('hidden');
      if (document.getElementById('previewManifestShipFrame')) {
        $("#previewManifestShipFrame").remove();
      }
      if (document.getElementById('pintManifestShipmentFrame')) {
        $("#pintManifestShipmentFrame").remove();
      }
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-manifest-ship-frame')) {
        $("#close-manifest-ship-frame").remove();
      }
      var link = manifestURL;
      var $frame = $('<iframe>', {
        src: link,
        id: 'previewManifestShipFrame',
        frameborder: 0,
        scrolling: 'yes',
        class: 'print-preview-iframe',
        style: "width:100%; height:300px;"
      });
      $('#manifest-ship-preview').append('<a class="ico-delete closeFrame" id="close-frame" onclick="showManifestPreview()"></a>',$frame);
  });
}

function shipmentsOnlyPrint(shipmentIdArrayParameter) {
 console.log(shipmentIdArrayParameter);
  var manifestURL = printManifestJSURLAppend;
  var ids = [];
  var shipmentIDS=shipmentIdArrayParameter;
  var shipmentOnlyPrintManifestObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIDS
  };
  ManifestPreviewData(shipmentOnlyPrintManifestObject, 'manifestPrint', function(data) {
     var manifestURL = printManifestJSURLAppend;
     if(document.getElementById('previewManifestShipFrame')) {
      $("#previewManifestShipFrame").remove();
      }
      if (document.getElementById('pintManifestShipmentFrame')) {
        $("#pintManifestShipmentFrame").remove();
      }

      $('#mani-message').addClass('hidden');
      $('#hide-shipment-nd-manifest-wrpr').addClass('hidden');
      if (document.getElementById('close-frame')) {
        $("#close-frame").remove();
      }
      if (document.getElementById('close-manifest-ship-frame')) {
        $("#close-manifest-ship-frame").remove();
      }
    manifestURL=manifestURL.replace("fileName=","fileName="+data);
    manifestURL=manifestURL.replace("isPreview=","isPreview=false");
    console.log(manifestURL);
    callIframe(manifestURL);
      hidePageLoader();
     
  });
}

function shipmentsOnlyDownload(shipmentIdArrayParameter) {
 console.log(shipmentIdArrayParameter);
  var manifestURL = printManifestJSURLAppend;
  var ids = [];
  var shipmentIDS=shipmentIdArrayParameter;
  var shipmentOnlyDownloadManifestObject = {
    'exportType': 'M',
    'ids': ids,
    'shipmentIds': shipmentIDS
  };
  ManifestPreviewData(shipmentOnlyDownloadManifestObject, 'manifestDownload', function(data) {
     var manifestURL = printManifestJSURLAppend;
     manifestURL=manifestURL.replace("fileName=","fileName="+data);
     manifestURL=manifestURL.replace("isPreview=","isPreview=true");
     console.log(manifestURL);
      downloadPDF(manifestURL);
      hidePageLoader();
  });
}


function hideManifestConfirm() {
  $('#modal-bg').addClass('hidden');

  $('#mani-confirmation-wrpr').addClass('hidden');
  $('#modal-bg,#print-mani-popup').removeClass('hidden');
}


function hideConfirm() {
  $('#modal-bg').addClass('hidden');

  $('#confirmation-wrpr').addClass('hidden');
  console.log(checkListItemLineItem);

  if ((checkListItemLineItem.trim()) == "Labels") {
    console.log('check true');
    $('#modal-bg,#print-label-wrpr').removeClass('hidden');
  } else {
    $('#modal-bg,#print-shipment-wrpr').removeClass('hidden');
  }
}


function manifestChecked() {
  manifestId = [];
  var $currObj = $('.cb-manifest');
  if ($currObj.is(':checked')) {
    manifestId = ManifestData.manifestId;
  } else {
    manifestId = -1;
  }
  console.log(manifestId);
  return manifestId;
}


function shipmentCheckboxClick() {
  var shipmentId = [];
  var counter = 0;
  $('#shipment-item-list .cb-list-ship').each(function() {
    var $currObj = $(this);
    if ($currObj.is(':checked')) {
      shipmentId.push($currObj.data('shipmentid'));
      counter++;
    }
  });
  // console.log(shipmentId);
  if ($('input[name="consignment-list"]').length == counter) {
    $('#cb-header-ship').prop('checked', true);
    console.log(shipmentId);
  } else {
    $('#cb-header-ship').prop('checked', false);
    console.log(shipmentId);
  }
  return shipmentId;
}


function checkUncheckShipmentCB() {
  if ($('#cb-header-ship').is(':checked')) {
    $('input[name="consignment-list"]').prop('checked', true);
  } else {
    $('input[name="consignment-list"]').prop('checked', false);
  }
}


function checkAll() {
  var allItemIds = [];
  if ($('input[name="allCheck"]').is(':checked')) {
    $('input[name="shipCheck"]').prop('checked', true);
  } else {
    $('input[type="checkbox"]').prop('checked', false);
    allItemIds = [];
  }
  console.log(allItemIds);
}

function getItemId(shipmentnum) {
  if ($('input[name="shipCheck"]').is(':checked')) {
    var getShipmentLabelID = getItemIDs(shipmentnum);
    console.log(getShipmentLabelID);
    // var printName = 'print_' + shipmentnum;
    // var reprintName = 'reprint_' + shipmentnum;
    // $('input[name="' + printName + '"]').prop('checked', true);
    // $('input[name="' + reprintName + '"]').prop('checked', true);
    // checkPrint(printName, shipmentnum);
    // checkRePrint(reprintName, shipmentnum);
    // console.log(totalPrintItemIdArr);
  }
}

// function checkPrint(checkboxName, shipmentNo) {
//   if ($('input[name="' + checkboxName + '"]').is(':checked')) {
//     for (var d = 0; d < getItemIDs(shipmentNo, 1).length; d++) {
//       totalPrintItemIdArr.push(getItemIDs(shipmentNo, 1)[d]);
//     }
//   } else {
//     totalPrintItemIdArr = totalPrintItemIdArr.filter(function(x) {
//       return getItemIDs(shipmentNo, 1).indexOf(x) < 0
//     })
//   }
//   console.log(totalPrintItemIdArr);
// }

// function checkRePrint(checkboxName, shipmentNo) {
//   if ($('input[name="' + checkboxName + '"]').is(':checked')) {
//     //totalPrintItemIdArr.push(getReprintItemIDs(shipmentNo));
//     for (var d = 0; d < getItemIDs(shipmentNo, 0).length; d++) {
//       totalPrintItemIdArr.push(getItemIDs(shipmentNo, 0)[d]);
//     }
//   } else {
//     totalPrintItemIdArr = totalPrintItemIdArr.filter(function(x) {
//       return getItemIDs(shipmentNo, 0).indexOf(x) < 0
//     })
//   }
//   console.log(totalPrintItemIdArr);
// }

function getItemIDsByShipment(shipmentId) {
  //looping in shipment detail
  var lineItemIds = [];
  var shipments = ManifestData.Shipments.length;
  for (var i = 0; i < shipments; i++) {
    if (shipmentId == ManifestData.Shipments[i].shipmentId) {
      var shipmentlineLength = ManifestData.Shipments[i].shipmentLines.length;
      for (var j = 0; j < shipmentlineLength; j++) {
        var shipmentlineItemsLength = ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems.length;
        for (var k = 0; k < shipmentlineItemsLength; k++) {
          lineItemIds.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
        }
      }
    }
  }
  return lineItemIds;
}

function getAllItemIDs() {
  var allItemIds = [];
  var shipments = ManifestData.Shipments.length;
  for (var i = 0; i < shipments; i++) {
    var shipmentlineLength = ManifestData.Shipments[i].shipmentLines.length;
    for (var j = 0; j < shipmentlineLength; j++) {
      var shipmentlineItemsLength = ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems.length;
      for (var k = 0; k < shipmentlineItemsLength; k++) {
        if (ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isActive == 1) {
          allItemIds.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
        }
      }
    }
  }
  return allItemIds;
}

function checkPrintOrReprint() {
  var allItemIds = [];
  var shipments = ManifestData.Shipments.length;
  for (var i = 0; i < shipments; i++) {
    var shipmentlineLength = ManifestData.Shipments[i].shipmentLines.length;
    for (var j = 0; j < shipmentlineLength; j++) {
      var shipmentlineItemsLength = ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems.length;
      for (var k = 0; k < shipmentlineItemsLength; k++) {
        if (ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].isPrinted == 1) {
          allItemIds.push(ManifestData.Shipments[i].shipmentLines[j].shipmentLineItems[k].itemId);
        }
      }
    }
  }
  console.log(allItemIds.length);
  if (allItemIds.length > 0) {
    // Re-Print scenario
    return false;
  } else {
    // First time Print scenario
    return true;
  }
}

// function to show alert box
  function showAlert(text,message){
  $$global.alertBox({
          class: 'alert',
          icon: 'ico-alert',
          content: message,
          title: text
      });
  }

  // ajax for shipment preview/print/download
function shipmentLabelPreviewData(payLoad, callType, getShipmentData) {
  showPageLoader();
  $.ajax({
    url: printShipmentWithLabelJSURL,
    method: 'GET',
    dataType: 'HTML',
    data: {
      printLabelObject: JSON.stringify(payLoad)
    },
    success: function(res) {
      res=JSON.parse(res);
      console.log(res);
      if (res.success) {
        getShipmentData(res.data);
      }
      else{
          hidePageLoader();
          showAjaxAlert();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      hidePageLoader();
      console.log(jqXHR, textStatus, errorThrown);
      showAjaxAlert();
    }
  });
}

// ajax for shipment preview/print/download
function ManifestPreviewData(payLoad, callType, getManifestData) {
  showPageLoader();
  $.ajax({
    url: printManifestJSURL,
    method: 'GET',
    dataType: 'HTML',
    data: {
      printManifestObject: JSON.stringify(payLoad)
    },
    success: function(res) {
      res=JSON.parse(res);
       console.log(res);
      if (res.success) {
        getManifestData(res.data);
        toggleDashboardButton();
      }
      else{
          hidePageLoader();
          showAjaxAlert(); 
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      hidePageLoader();
      console.log(jqXHR, textStatus, errorThrown);
      showAjaxAlert();
    }
  });
}

function toggleDashboardButton(){
	  var printNCloseDiv = dashboardManifestId+"Print";
	  var printNCloseAltDiv = dashboardManifestId+"Book";
	  $("#"+printNCloseDiv).hide();
	  $("#"+printNCloseDiv).css('visibility', 'hidden');
	  $("#"+printNCloseAltDiv).show();
	  $("#"+printNCloseAltDiv).css('visibility', 'visible');
	  $("#"+printNCloseAltDiv).toggleClass('hidden');
}

function showAjaxAlert() {
  $$global.showInPopup({
    content: $$global.exceptionContentService("AE4599")
  });
}

function showPopupPageLoader(){
  $('#popup-loader,#popup-page-loader-bg,#popup-page-loader').removeClass('hidden');
}
function hidePopupPageLoader(){
  $('#popup-loader,#popup-page-loader-bg,#popup-page-loader').addClass('hidden');
}