<%@ include file="/WEB-INF/jsp/request-quote/init.jsp" %>

<style>
.LabelBg {
    background-color: #dad9d9 !important;
    font-size:14px;
    font-weight: normal;
    color: #000000;
}
</style>

<div class="panel panel-primary setup-content" id="step-3">
     <div class="panel-heading">
          <h3 class="panel-title">Request a Quote - Step 3</h3>
     </div>
     <div class="panel-body">
         <div>
         	<div class="col-xs-4">
             	<label class="control-label">Vehicle Registration Number</label>
             	<BR/>
             	<span class="label label-default LabelBg">UP 14 CH 1108</span>
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Previous NCB (No Claim Bonus) % </label>
             	<br/>
             	<span class="label label-default LabelBg">NCB - 20 %</span>
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Policy Expiry Date</label>
             	<br/>
             	<span class="label label-default LabelBg">30 Jun 2018</span>
         	</div>
         </div>
         <div style="clear:both;align:left">&nbsp;</div>
         <div>
         	<div class="col-xs-4">
             	<label class="control-label">Your Car(Make) </label>
             	<select id="carMake" name="carMake" onchange="loadCarModel(this);" class="form-control">
						
				</select> 
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Your Car(Model)</label>
             	<select id="carModel" name="carModel" onchange="loadCarVariant(this);" class="form-control">
					<option selected="true" disabled>Choose Car Model</option>
				</select>
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Your Car(Variant)</label>
             	<select id="carVariant" name="carVariant" class="form-control">
					<option selected="true" disabled>Choose Car Variant</option>
				</select>
         	</div>
         </div>
         <div style="clear:both;align:left">&nbsp;</div>
         <div>
         	<div class="col-xs-4">
             	<label class="control-label">State Of Registration </label>
             	<input maxlength="200" id="regState" name="regState" type="text" required="required" class="form-control" placeholder="State Of Registration" /> 
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">City Of Registration</label>
             	<input maxlength="200" id="regCity" name="regCity" type="text" required="required" class="form-control" placeholder="City Of Registration" /> 
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Car Manufactured Year</label>
             	<select id="manufactureYear" name="manufactureYear" class="form-control">
					<option selected="true" disabled>Choose Car Manufactured Year</option>
					<option>2018</option>
					<option>2017</option>
					<option>2016</option>
					<option>2015</option>
				</select>
         	</div>
         </div>
         <div style="clear:both;align:left">&nbsp;</div>
         <div>
         	<div class="col-xs-4">
             	<label class="control-label">Your Car's Estimated Value(IDV) </label>
             	<input maxlength="200" id="idv" name="idv" type="text" required="required" class="form-control" placeholder="Car IDV" /> 
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Email Id</label>
             	<br/>
             	<span class="label label-default LabelBg">vaibhav-a@hcl.com</span> 
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Phone No</label>
             	<br/>
             	<span class="label label-default LabelBg">+91 986 809 0705</span> 
         	</div>
         </div>
         <div style="clear:both;align:left">&nbsp;</div>
         <button class="btn btn-primary nextBtn pull-right" type="button">Get Quote</button>
     </div>
</div>
