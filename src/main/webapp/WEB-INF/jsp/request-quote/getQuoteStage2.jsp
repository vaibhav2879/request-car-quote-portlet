<%@ include file="/WEB-INF/jsp/request-quote/init.jsp" %>
<portlet:defineObjects />
<div class="panel panel-primary setup-content" id="step-2">
     <div class="panel-heading">
          <h3 class="panel-title">Request a Quote - Step 2</h3>
     </div>
     <div class="panel-body">
         <div>
         	<div class="col-xs-4">
             	<label class="control-label">Your Vehicle Registration Number</label>
             	<input maxlength="200" id="carRegNo" name="carRegNo" type="text" required="required" class="form-control" placeholder="Your Vehicle Registration Number" />
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Claim In Previous Policy?</label>
             	<br/>
             	Yes&nbsp;<input type="radio" id="prevClaim" name="prevClaim" value="Yes" />&nbsp;&nbsp;
				No&nbsp;<input type="radio" id="prevClaim" name="prevClaim" value="No" />
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Previous No Claim Bonus(NCB %)?</label>
             	<select id="prevNCB" name="prevNCB" class="form-control">
					<option>0</option>
					<option>20</option>
					<option>25</option>
					<option>35</option>
					<option>45</option>
					<option>50</option>
					<option>55</option>
					<option>65</option>
				</select> 
         	</div>
         </div>
         <div style="clear:both;align:left">&nbsp;</div>
         <div>
         	<div class="col-xs-4">
             	<label class="control-label">Email Id</label>
             	<input maxlength="200" id="emailId" name="emailId" type="text" required="required" class="form-control" placeholder="Email Id" />
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Mobile No</label>
             	<input maxlength="200" id="mobileNo" name="mobileNo" type="text" required="required" class="form-control" placeholder="Mobile No" />
         	</div>
         	<div class="col-xs-4">
             	<label class="control-label">Policy Expiry Date</label>
             	<input id="policyExpDate" name="policyExpDate" type="date" required="required" class="form-control" placeholder="Policy Expiry Date" />
         	</div>
         </div>
         <div style="clear:both;align:left">&nbsp;</div>
         <button class="btn btn-primary nextBtn pull-right" type="button">Next</button>
     </div>
</div>
