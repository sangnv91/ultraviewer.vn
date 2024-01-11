//==
	function isInBrowserControl() {
		if (window.external && "MyExternalProperty" in window.external) {
			return true;
		}
			return false;
	}
			
						
	function validateform() {
		var x = $("#txtcomment").val();
		if (x == null || x == "") {
		alert("Comment must be filled out");
		return false;
		}
	}
			
			
$(document).ready(function(){
		$("#sec-check").val(isInBrowserControl());
		
		//==
		$(".areply").click(function(){
		$("#cancelreply").css("visibility", "visible");
		var parentdiv = $(this).parent().parent().parent();
		//$(parentdiv).append("tett");
		
		try {
		//$("#replytoid").val($(this).attr("commentid"));
		$('input[name="replytoid"]').val($(this).attr("commentid"));
		$("#comment_form").appendTo(parentdiv);
		$("#txtcomment").focus();
		} catch (ex) {
		alert(ex);
		}
		//alert($(a[0]).attr('class'));
		//$(this).append("tet");
		});
	
		$("#cancelreply").click(function(){
		$(this).css("visibility", "hidden");
		$("#replytoid").val(0);
		$("#comment_form").appendTo($("#comment_place_holder"));
		});
			
});
			
