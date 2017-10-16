$(document).ready(function(){
	
	
	var list=[{number:1},{number:2},{number:3}];
	 $("#testemplate").tmpl(list).appendTo("#templateTest");
	$('#templateTest li').unbind('click').click(function(){
		
		alert('called');
	});
	
});