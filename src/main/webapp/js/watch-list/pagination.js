// Display Loading Image
function Display_Load() {
	$("#loading").fadeIn(900, 0);
	$("#loading").html("Loading Page");
}
// Hide Loading Image
function Hide_Load() {
	$("#loading").fadeOut('slow');
}
	
function setPagination(){
	// Default Starting Page Results
	$("#pagination li:first").css({
		'color' : '#FF0084'
	}).css({
		'border' : 'none'
	});
	//Display_Load();
	//$("#content").load("pagination_data.php?page=1", Hide_Load());

}

//Pagination Click
function pagination(obj) {
	// CSS Styles
	$("#pagination li").css({
		'border' : 'solid #dddddd 1px'
	}).css({
		'color' : '#0063DC'
	});

	$(obj).css({
		'color' : '#FF0084'
	}).css({
		'border' : 'none'
	});

	// Loading Data
	var pageNum = obj.id;
	//alert(pageNum);
	
	loadSelectedList("manifestTabAnchor", pageNum);
	//$("#content").load("pagination_data.php?page=" + pageNum, Hide_Load());
}