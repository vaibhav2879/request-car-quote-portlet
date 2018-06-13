<%@ include file="/WEB-INF/jsp/request-quote/init.jsp" %>

<style>

.stepwizard-step p {
    margin-top: 0px;
    color:#666;
}
.stepwizard-row {
    display: table-row;
}
.stepwizard {
    display: table;
    width: 100%;
    position: relative;
}
.stepwizard-step button[disabled] {
    /*opacity: 1 !important;
    filter: alpha(opacity=100) !important;*/
}
.stepwizard .btn.disabled, .stepwizard .btn[disabled], .stepwizard fieldset[disabled] .btn {
    opacity:1 !important;
    color:#bbb;
}
.stepwizard-row:before {
    top: 14px;
    bottom: 0;
    position: absolute;
    content:" ";
    width: 100%;
    height: 1px;
    background-color: #ccc;
    z-index: 0;
}
.stepwizard-step {
    display: table-cell;
    text-align: center;
    position: relative;
}
.btn-circle {
    width: 30px;
    height: 30px;
    text-align: center;
    padding: 6px 0;
    font-size: 12px;
    line-height: 1.428571429;
    border-radius: 15px;
}
</style>

<div class="container">
	<div id="" style="text-align:center;font-size:25px;font-family: fantasy;">
		Request car insurance quote <br/><br/>
	</div>
    <div class="stepwizard">
        <div class="stepwizard-row setup-panel">
            <div class="stepwizard-step col-xs-3"> 
                <a href="#step-1" type="button" class="btn btn-success btn-circle">1</a>
                <p><small>Step 1</small></p>
            </div>
            <div class="stepwizard-step col-xs-3"> 
                <a href="#step-2" type="button" class="btn btn-default btn-circle" disabled="disabled">2</a>
                <p><small>Step 2</small></p>
            </div>
            <div class="stepwizard-step col-xs-3"> 
                <a href="#step-3" type="button" class="btn btn-default btn-circle" disabled="disabled">3</a>
                <p><small>Step 3</small></p>
            </div>
            <div class="stepwizard-step col-xs-3"> 
                <a href="#step-4" type="button" class="btn btn-default btn-circle" disabled="disabled">4</a>
                <p><small>Get Quote</small></p>
            </div>
        </div>
    </div>
    
    <form role="form" id="reg_form" name="reg_form">
        
        
        <%@ include file="/WEB-INF/jsp/request-quote/getQuoteStage1.jsp" %>
        
        <%@ include file="/WEB-INF/jsp/request-quote/getQuoteStage2.jsp" %>
        
        <%@ include file="/WEB-INF/jsp/request-quote/getQuoteStage3.jsp" %>
        
        <%@ include file="/WEB-INF/jsp/request-quote/getQuoteStage4.jsp" %>
        
        <!-- <div class="panel panel-primary setup-content" id="step-3">
            <div class="panel-heading">
                 <h3 class="panel-title">Schedule</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label class="control-label">Company Name</label>
                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Name" />
                </div>
                <div class="form-group">
                    <label class="control-label">Company Address</label>
                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Address" />
                </div>
                <button class="btn btn-primary nextBtn pull-right" type="button">Next</button>
            </div>
        </div> -->
        
        <!-- <div class="panel panel-primary setup-content" id="step-4">
            <div class="panel-heading">
                 <h3 class="panel-title">Cargo</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label class="control-label">Company Name</label>
                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Name" />
                </div>
                <div class="form-group">
                    <label class="control-label">Company Address</label>
                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Address" />
                </div>
                <button class="btn btn-success pull-right" type="submit">Finish!</button>
            </div>
        </div> -->
    </form>
</div>

<script>

var carsMasterData = <c:out value="${carMasterData}" escapeXml="false"/>;

$(document).ready(function () {

    var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-success').addClass('btn-default');
            $item.addClass('btn-success');
            allWells.hide();
            $target.show();
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function () {
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".col-xs-4").removeClass("has-error");
        for (var i = 0; i < curInputs.length; i++) {
            if (!curInputs[i].validity.valid) {
                isValid = false;
                $(curInputs[i]).closest(".col-xs-4").addClass("has-error");
            }
        }

        if (isValid) nextStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-success').trigger('click');
    loadCarMake();
    
});

function loadCarMake(){
	let dropdown = $('#carMake');
	dropdown.empty();
	dropdown.append('<option selected="true">Choose Car Make</option>');
	dropdown.prop('selectedIndex', 0);
	for ( var i = 0; i < carsMasterData.brands.length; i++) {
		var obj = carsMasterData.brands[i];
		var brandId = obj.brandId;
		var brandName = obj.brandName;
		dropdown.append($('<option></option>').attr('value', brandId).text(brandName));
	}
}

function loadCarModel(carMakeObj){
	showPageLoader();
	let dropdown = $('#carModel');
	var carId = carMakeObj.value;
	dropdown.empty();
	dropdown.append('<option selected="true">Choose Car Model</option>');
	dropdown.prop('selectedIndex', 0);
	for ( var i = 0; i < carsMasterData.brands.length; i++) {
		var obj = carsMasterData.brands[i];
		var brandId = obj.brandId;
		if(brandId == carId){
			for ( var j = 0; j < obj.model.length; j++) {
				var modelObj = obj.model[j];
				var modelId = modelObj.modelId;
				var modelName = modelObj.modelName;
				
				dropdown.append($('<option></option>').attr('value', modelId).text(modelName));
			}
		}
	}
	hidePageLoader();
}

function loadCarVariant(carModelObj){
	showPageLoader();
	let dropdown = $('#carVariant');
	var carModelId = carModelObj.value;
	dropdown.empty();
	dropdown.append('<option selected="true">Choose Car Variant</option>');
	dropdown.prop('selectedIndex', 0);
	for ( var i = 0; i < carsMasterData.brands.length; i++) {
		var obj = carsMasterData.brands[i];
		//var brandId = obj.brandId;
		//if(brandId == carId){
			for ( var j = 0; j < obj.model.length; j++) {
				var modelObj = obj.model[j];
				var modelId = modelObj.modelId;
				if(modelId == carModelId){
					alert(modelId);
					for ( var k = 0; k < modelObj.variants.length; k++) {	
						var variantObj = modelObj.variants[k];
						var fuelType = variantObj.fuelType;
						var variantId = variantObj.variantId;
						var variantName = variantObj.variantName;
						
						dropdown.append($('<option></option>').attr('value', variantId).text(variantName+" - "+fuelType));
					}
				}
			}
		}
	//}
	hidePageLoader();
}

function formValidator(){
	$('#reg_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        /* feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }, */
        fields: {
            /* first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your first name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your last name'
                    }
                }
            },
           
            phone: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your phone number'
                    },
                    phone: {
                        country: 'US',
                        message: 'Please supply a vaild phone number with area code'
                    }
                }
            },
            address: {
                validators: {
                     stringLength: {
                        min: 8,
                    },
                    notEmpty: {
                        message: 'Please supply your street address'
                    }
                }
            },
            city: {
                validators: {
                     stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Please supply your city'
                    }
                }
            },
            state: {
                validators: {
                    notEmpty: {
                        message: 'Please select your state'
                    }
                }
            },
            zip: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your zip code'
                    },
                    zipCode: {
                        country: 'US',
                        message: 'Please supply a vaild zip code'
                    }
                }
            },
		comment: {
                validators: {
                      stringLength: {
                        min: 10,
                        max: 200,
                        message:'Please enter at least 10 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a description about yourself'
                    }
                    }
                 }, */	
          emailId: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
					
	/* password: {
            validators: {
                identical: {
                    field: 'confirmPassword',
                    message: 'Confirm your password below - type same password please'
                }
            }
        },
        confirmPassword: {
            validators: {
                identical: {
                    field: 'password',
                    message: 'The password and its confirm are not the same'
                }
            }
         }, */
			
            
            }
        })
}
</script>
