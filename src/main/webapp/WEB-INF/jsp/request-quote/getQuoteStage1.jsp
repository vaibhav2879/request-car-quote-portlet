<%@ include file="/WEB-INF/jsp/request-quote/init.jsp"%>

<portlet:defineObjects />

<style>
.card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 80%;
    border-radius: 5px;
    height: 100px;
}

.card:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.containerTile {
    padding: 2px 16px;
}
</style>

<div class="panel panel-primary setup-content" id="step-1">
     <div class="panel-heading">
          <h3 class="panel-title">Request a Quote - Step 1</h3>
     </div>
     <div class="panel-body">
         <div>
         	<div class="col-xs-4">
             	<!-- <label class="control-label">Renew DIP Policy</label>
             	<input type="radio" id="policyReqType" name="policyReqType" value="1" class="form-control" /> -->
             	<div class="card">
				  <div class="containerTile">
				    <center>
				    	<h4><b>Renew DIP Policy</b></h4> 
				    	<input type="radio" id="policyReqType" name="policyReqType" value="1" />
				    </center>
				  </div>
				</div>             	
             </div>
             <div class="col-xs-4">
             	<!-- <label class="control-label">Renew Other Insurance Company Policy</label>
             	<input type="radio" id="policyReqType" name="policyReqType" value="2" class="form-control" /> -->
             	<div class="card">
				  <div class="containerTile">
				    <center>
				    	<h4><b>Renew Other Insurance Company Policy</b></h4> 
				    	<input type="radio" id="policyReqType" name="policyReqType" value="2" />
				    </center>
				  </div>
				</div>
             </div>
             <div class="col-xs-4">
             	<!-- <label class="control-label">Brand New Car Policy</label>
             	<input type="radio" id="policyReqType" name="policyReqType" value="3" class="form-control" /> -->
             	<div class="card">
				  <div class="containerTile">
				    <center>
				    	<h4><b>Brand New Car Policy</b></h4> 
				    	<input type="radio" id="policyReqType" name="policyReqType" value="3" />
				    </center>
				  </div>
				</div> 
             </div>
         </div>

		<div style="clear:both;align:left">&nbsp;</div>
     	<button class="btn btn-primary nextBtn pull-right" type="button">Next</button>
 	</div>
</div>
