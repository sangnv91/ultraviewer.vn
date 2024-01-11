$(function(){ $(".uniform, .boxContent input").uniform(); }); // , input:text

$(document).ready(function() {

setfocuscheckedatm();

$("#signup-country").val('VN');


if (MuaNhieuMay === false) {
validateremoteid();
}
recheckpaymentmethod(); //load duration & price first

if (StoredInfo === true) {
loadlocalstorage();
}
recheckpaymentmethod(); //again 

recalculatePrice();

$("#step2").on('click', function(event){
if (MuaNhieuMay === false) {
$("#remoteid").val($("#remoteid").val().replace(/ /g, ""));
if (validateremoteid() == false) {
event.stopPropagation();
alert("ID không được bỏ trống và phải là dạng số!");
return false;
}
} else {
 if (Object.keys(dictOrder).length == 0) {
	alert('Bạn chưa thêm ID nào');
	return false;
	}
}
// apply info
$("#traninfo").html($("#paymentmethod").val());
if (MuaNhieuMay === false) {
$(".hiddenremoteid").val($("#remoteid").val());
$(".hiddenduration").val($("#duration").val());
} else {
var keylist = Object.keys(dictOrder).toString(); 
var durationlist = Object.keys(dictOrder).map(function(itm) { return dictOrder[itm]; }); //Object.values(dictOrder).toString(); 
$(".hiddenremoteid").val(keylist);
$(".hiddenduration").val(durationlist);
}
document.getElementById("tabs").scrollIntoView();
  if (MuaNhieuMay === true) {
	 // alert($("#frminvoice").html());
	 if ($("#chksendinvoice").is(":checked") == true) {
	  $(".invoice_placeholder").html($("#frminvoice").html());
	  } else {
	  $(".invoice_placeholder").html("");
	  }
	  }

	changeTabStep(this);
	});
	
	$("#duration").change(function() {
	var lastdurationval = $("#duration").val();
	localStorage.setItem('lastdurationval', lastdurationval);
	});

	$("#paymentmethod").change(function() {
	var lastpaymentmethod = $("#paymentmethod").val();
	localStorage.setItem('lastpaymentmethod', lastpaymentmethod);
	});

	$( "#duration, #paymentmethod" ).change(function() {
	recalculatePrice();
	});
	


	$(".addid" ).on('click', function(e){
	e.preventDefault();
	var remoteid =  $( "#remoteid" ).val().replace(/ /g, "");
	if ($.isNumeric(remoteid) == false) { //(remoteid.length == 0) {
alert("ID phải là dạng số và không được bỏ trống");
return false;
}
	
	var duration =  $( "#duration" ).val();
	var money= parseFloat($("option[value="+duration+"]",  $( "#duration" )).attr('totalcost'));// * duration;

	if (remoteid in dictOrder) {
	alert("ID đã tồn tại");
return false;
	} else {
	if (Object.keys(dictOrder).length == 0) {
	$('#firstrow').remove();
	}
	dictOrder[remoteid] = duration;
	}
	tblorderappend(remoteid, duration, money);
	$("#step2").toggleClass("disabled", false);
	totalMoney = totalMoney + money;

	updatecostlabel();

	$( "#remoteid" ).val("");
	$( "#remoteid" ).focus();
	if (typeof(Storage) !== "undefined") { //browser support localStorage
		localStorage.setItem("dictOrder", JSON.stringify(dictOrder));
	} 
	});
	
	 $("#tblorder").on('click','.removerow',function(e){
	 var remoteid = $(this).attr('remoteid');
	 var money = parseFloat($(this).attr('money'));
	 totalMoney = totalMoney - money;
	 delete dictOrder[remoteid];
	  $(this).parent().parent().remove();
	  if (Object.keys(dictOrder).length == 0) {
	$('#tblorder').append('<tr id="firstrow"><td colspan=4>Bạn chưa thêm ID nào</td></tr>');
	$("#step2").toggleClass("disabled", true);
	}
	updatecostlabel();
	if (typeof(Storage) !== "undefined") { //browser support localStorage
		localStorage.setItem("dictOrder", JSON.stringify(dictOrder));
	}
	  	 e.preventDefault();
    });
	
	$("#paymentmethod" ).change(function() {
	recheckpaymentmethod();
	recalculatePrice();
	});
	
	$("#remoteid").on('change', function(event) {
	$("#remoteid").val($("#remoteid").val().replace(/ /g, ""));
	if (MuaNhieuMay === false) {
	validateremoteid();
	}
	});
	

});

function updatecostlabel() {
var byrefObj = {discountRate:0};
	var discountedprice = getdiscountprice(byrefObj); 
	var discountRate = byrefObj.discountRate;
if (discountRate > 0) {
	  $("#cost").html('<div class="strike">' + (totalMoney/1000).toFixed(3) + ' ' + CurrencyDisplay + '</div> Giảm ' + discountRate + '% chỉ còn ' +  (discountedprice/1000).toFixed(3) + ' ' + CurrencyDisplay);
} else {
	$("#cost").html((totalMoney/1000).toFixed(3) + ' ' + CurrencyDisplay);
}
}

function getdiscountprice(byrefObj)
{
byrefObj.discountRate = 0;
if ((Object.keys(dictOrder).length) > 9) {
byrefObj.discountRate = 20;
} else if ((Object.keys(dictOrder).length) > 4) {
byrefObj.discountRate = 15;
} else if ((Object.keys(dictOrder).length) > 1) {
byrefObj.discountRate = 10;
}
if (byrefObj.discountRate > 0) {
return totalMoney - ((totalMoney / 100) * byrefObj.discountRate);
}
return totalMoney;
}

function tblorderappend(remoteid, duration, money){
$('#tblorder').append([
'<tr id="row' + remoteid + '">',
    '<td>' + remoteid + '</td>',
    '<td>' + duration + ' tháng</td>',
    '<td>' + (money/1000).toFixed(3) + ' ' + CurrencyDisplay + '</td>',
    '<td><a href="#" class="removerow" remoteid="' + remoteid + '" money="' + money + '">Xóa</a></td>',
'</tr>'
].join(''));
}

function isLocalStorageAvailable(){
    var test = 't';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}
function loadlocalstorage() 
{
//localStorage.removeItem('dictOrder');
if (isLocalStorageAvailable) { //browser support localStorage
var lastdurationval = localStorage.getItem('lastdurationval');
if (lastdurationval) {
$("select#duration").val(lastdurationval);
$.uniform.update($("#duration"));
}

var lastpaymentmethod = localStorage.getItem('lastpaymentmethod');
if (lastpaymentmethod) {
$("select#paymentmethod").val(lastpaymentmethod);
$.uniform.update($("#paymentmethod"));
}

if (localStorage.getItem("dictOrder") !== null) {
//var tmpdictOrder = JSON.parse(localStorage.getItem("dictOrder"));
//alert(Object.keys(tmpdictOrder).length);
dictOrder = JSON.parse(localStorage.getItem("dictOrder"));
if (Object.keys(dictOrder).length > 0) {
	$('#firstrow').remove();
	$("#step2").toggleClass("disabled", false);
	}
for (var key in dictOrder) {
    // check if the property/key is defined in the object itself, not in parent
	var remoteid = key;
	var duration = dictOrder[key];
	var money= parseFloat($("option[value="+duration+"]",  $( "#duration" )).attr('totalcost'));// * duration;

	tblorderappend(remoteid, duration, money);

		totalMoney = totalMoney + money;
        //console.log(key, dictOrder[key]);
}

updatecostlabel();


}
}
}

function setfocuscheckedatm(currentfrm) {
var lastChecked = $('#' + currentfrm + ' input:checked');
lastChecked.closest("li").toggleClass("focus", true);
}

function recalculatePrice() {
var duration =  $( "#duration" ).val();
var money= $("option[value="+duration+"]",  $( "#duration" )).attr('totalcost');

var price = money;// * duration;
var somay = GetDurationChangeable(duration);
if (MuaNhieuMay === false) {
$("#cost").html((price/1000).toFixed(3) + " " + CurrencyDisplay);
$("#somay").html(somay);
}

$(".amount").val(price);
}

function recheckpaymentmethod(){
var lastdurationval = $("#duration").val();
if ($("#paymentmethod").val() == 'scratchcard') {
	$("#duration").html($("#scratchcardprice").html());
	} else {
	$("#duration").html($("#normalprice").html());
	}

if (lastdurationval != null) {
$("select#duration").val(lastdurationval);
}
//$("select#duration").prop('selectedIndex', 0);
$.uniform.update($("#duration"));

$("#frminternetbanking").hide();
$("#frmnganluong").hide();
$("#frmalepay").hide();
$("#frmatm").hide();
$("#frmqrcode").hide();
$("#frmbanktransfer").hide();
$("#frmvnpayment").hide();
$("#frmscratchcard").hide();
$("#frmmybalance").hide();
if ($("#paymentmethod").val() == 'atm') {
$("#frmatm").show();
setfocuscheckedatm("frmatm");
} else if ($("#paymentmethod").val() == 'qrcode') {
$("#frmqrcode").show();
} else if ($("#paymentmethod").val() == 'nganluong') {
$("#frmnganluong").show();
} else if ($("#paymentmethod").val() == 'internetbanking') {
$("#frminternetbanking").show();
} else if ($("#paymentmethod").val() == 'vnpayment') {
$("#frmvnpayment").show();
} else if ($("#paymentmethod").val() == 'mybalance') {
$("#frmmybalance").show();
} else if ($("#paymentmethod").val() == 'banktransfer') {
$("#frmbanktransfer").show();
setfocuscheckedatm("frmbanktransfer");
} else if ($("#paymentmethod").val() == 'creditcard') {
$("#frmalepay").show();
} else {
$("#frmscratchcard").show();
}
}

function validateremoteid() {
//== vailidate remote id 
var remoteid =  $( "#remoteid" ).val();
if ($.isNumeric(remoteid) == false) { //(remoteid.length == 0) {
$("#step2").toggleClass("disabled", true);
return false;
} else {
$("#step2").toggleClass("disabled", false);
return true;
}

}

//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};

function SetCookie(cookieName,cookieValue,nDays) {
 var today = new Date();
 var expire = new Date();
 if (nDays==null || nDays==0) nDays=1;
 expire.setTime(today.getTime() + 3600000*24*nDays);
 document.cookie = cookieName+"="+escape(cookieValue)
                 + ";expires="+expire.toGMTString() + "; path=/";
}



jQuery(document).ready(function($){
	

	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_forgot_password = $form_modal.find('#cd-reset-password'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
		$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
		$main_nav = $('.main-nav');

	//open modal
	$(".buynow").on('click', function(event){
var attr = $(this).attr('afterlogin');
if (typeof attr !== typeof undefined && attr !== false) {
$('#frmlogin').attr("action", $('#frmlogin').attr("original-action") + $(this).attr('afterlogin'));
$('#frmregister').attr("action", $('#frmregister').attr("original-action") + $(this).attr('afterlogin'));
} else {
$('#frmlogin').attr("action", $('#frmlogin').attr("original-action"));
$('#frmregister').attr("action", $('#frmregister').attr("original-action"));
}
 
			$form_modal.addClass('is-visible');	
			//show the selected form
			( $(event.target).is('.cd-signup') ) ? signup_selected() : login_selected();
		//}

	});
	
$(document).on('keypress', '.txtemail', function (e) {
    if (e.which == 13) e.preventDefault();
});
	
$(".bank-online-methods").click(function() {
	var currentfrm = $(this).closest( "form" ).attr("id");
	var lastChecked = $('#' + currentfrm + ' input:checked'); // .val());
	$(".bank-online-methods").removeClass("focus");
	//lastChecked.parent().parent().parent().parent().removeClass("focus");
	var clickedbox = $(this).find('input').prop('checked', true);
	$(this).addClass("focus");
	

	 $.uniform.update(clickedbox);
	 $.uniform.update(lastChecked);
	});
	//close modal
	$('.cd-user-modal').on('click', function(event){
		if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
			$form_modal.removeClass('is-visible');
		}	
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$form_modal.removeClass('is-visible');
	    }
    });
	
	$(".signup_form").on('click', function(event) {
	event.preventDefault();
	signup_selected();
	});
	

	//switch from a tab to another
	$form_modal_tab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
	});

	//hide or show password
	$('.hide-password').on('click', function(){
		var $this= $(this),
			$password_field = $this.prev('input');
		
		( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
		( 'Hide' == $this.text() ) ? $this.text('Show') : $this.text('Hide');
		//focus and move cursor to the end of input field
		$password_field.putCursorAtEnd();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function(event){
		//event.preventDefault();
		//forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	function login_selected(){
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected(){
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}
	
	function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
	}

	//REMOVE THIS - it's just to show error messages 
	$form_login.find('input[type="submit"]').on('click', function(event){
		$("#signin-email").toggleClass('has-error', false).next('span').toggleClass('is-visible', false);
		$("#signin-password").toggleClass('has-error', false).next('span').toggleClass('is-visible', false);
		
		if($('#signin-email').val().length < 1) {
		$('#signin-email').toggleClass('has-error', true).next('span').toggleClass('is-visible', true);
		event.preventDefault();
		return false;
		} 
		
		if($('#signin-password').val().length < 1) {
		$('#signin-password').toggleClass('has-error', true).next('span').toggleClass('is-visible', true);
		event.preventDefault();
		return false;
		} 

		// prevent form submit 2 times
		$form_login.find('input[type="submit"]').attr("disabled", true);
		$("#frmlogin").submit();
		event.preventDefault();
		return false;
		
		
	});
	
	$form_signup.find('input').on('click', function(event){
		$(this).toggleClass('has-error', false).next('span').toggleClass('is-visible', false);
	});
	
	$form_signup.find('input[type="submit"]').on('click', function(event){
	
	//alert($('#signup-username').val().length);
	$('#signup-username').toggleClass('has-error', false).next('span').toggleClass('is-visible', false);
	$form_signup.find('input[type="email"]').toggleClass('has-error', false).next('span').toggleClass('is-visible' , false);
	$('#signup-password').toggleClass('has-error', false).next('span').toggleClass('is-visible' , false);
	
	if($('#signup-username').val().length < 2) {
		$('#signup-username').toggleClass('has-error', true).next('span').toggleClass('is-visible', true);
		event.preventDefault();
		return false;
		} 

		if (validateEmail($form_signup.find('input[type="email"]').val()) == false) {
		$form_signup.find('input[type="email"]').toggleClass('has-error', true).next('span').toggleClass('is-visible', true);
		event.preventDefault();
		return false;
		} 

		if(($('#signup-password').val().length < 7) || ($('#signup-password').val().length > 22)) {
		$('#signup-password').toggleClass('has-error', true).next('span').toggleClass('is-visible', true);
		event.preventDefault();
		return false;
		}

		if($("#accept-terms").prop('checked') == false) {
		$("#accept-terms").next().next('span').toggleClass('is-visible', true);
		event.preventDefault();
		return false;
		}
		
		// prevent form submit 2 times
		$form_signup.find('input[type="submit"]').attr("disabled", true);
		$form_signup.find('input[type="submit"]').val(txtCreating);
		$("#frmregister").submit();
		event.preventDefault();
		return false;
		
	});


	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

	function validateAtm() {
	var email = ($( "#frmatm input[name*='buyerEmail']" ).val());
	if (validateEmail(email) == false) {
	alert('Email bạn nhập chưa đúng!');
	return false;
	}
	return true;
	}

	function validatefrmsubmit(frmname) {
	var email = ($(frmname + " input[name*='buyerEmail']" ).val());
	if (validateEmail(email) == false) {
	alert('Email bạn nhập chưa đúng!');
	return false;
	}
	var bankcode = $(frmname + ' input[name=bankcode]:checked').attr('value');
	var amount = $(frmname + " .amount").attr('value');
	if ((frmname == "#frminternetbanking") && (bankcode == "VCB") && (amount < 20000)) {
	alert('Ngân hàng Vietcombank chỉ cho phép số tiền thanh toán tối thiểu là 20,000 đ');
	return false;
	}
	if ((frmname == "#frmatm") && (bankcode == "VIETCOMBANK") && (amount < 20000)) {
	alert('Lưu ý: Thẻ ATM của Ngân hàng Vietcombank chỉ cho thanh toán đơn hàng có giá trị từ 20,000 đ trở lên.');
	}


	return true;
	}

	$('.sendInstallment').on('click', function () {
			var frmsubmit;
			if ($("#paymentmethod").val() == 'atm') {

			var vnpvalue = $('#frmatm input[name=bankcode]:checked').attr('vnpvalue');

			if (typeof vnpvalue != 'undefined') {
			$('#frmatm input[name=bankcode]:checked').attr('value', vnpvalue);
			$("#frmatm").attr("action", "pricing.html?action=sendOrderToVNPayment");
			}

			frmsubmit = "#frmatm";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'vnpayment') {
			frmsubmit = "#frmvnpayment";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'banktransfer') {
			frmsubmit = "#frmbanktransfer";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'qrcode') {
			frmsubmit = "#frmqrcode";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'internetbanking') {
			frmsubmit = "#frminternetbanking";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'nganluong') {
			frmsubmit = "#frmnganluong";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'mybalance') {
			frmsubmit = "#frmmybalance";
			if (validatefrmsubmit(frmsubmit) == true) $(frmsubmit).submit();
			return false;
			} else if ($("#paymentmethod").val() == 'scratchcard') {
			frmsubmit = "#frmscratchcard";
			$('#scratchcard_alert').html('<div class="info"><div class="message-box-wrap" >Vui lòng chờ giây lát...</div></div>');
			$.ajax({
                type: "POST",
                url: $(frmsubmit).prop('action'),
                data: $(frmsubmit).serialize(), // serializes the form's elements.
                success: function (data) {
                    if (typeof data.errorCode != 'undefined' || data.finishURL=='') {
                        $('#scratchcard_alert').html('<div class="error"><div class="message-box-wrap" >' + data.errorDescription + '</div></div>');
                        return false;
                    } else {
						$('#scratchcard_alert').html('<div class="info"><div class="message-box-wrap" >Thanh toán thành công...</div></div>');
						window.location.href = finishURL;
                    }

                }
            });
			return false;
			} else {
			frmsubmit = "#frmalepay";
			$('#alert').html('<div class="info"><div class="message-box-wrap" >Vui lòng chờ ít phút...</div></div>');
            $.ajax({
                type: "POST",
                url: $(frmsubmit).prop('action'),
                data: $(frmsubmit).serialize(), // serializes the form's elements.
                success: function (data) {
				//alert(data.errorCode);
				//alert('checkouturl: ' + data.checkoutUrl);
                    console.log(data.errorCode);
					
                    if (typeof data.errorCode != 'undefined' || data.checkoutUrl=='') {
                        $('#alert').html('<div class="error"><div class="message-box-wrap" >' + data.errorDescription + '</div></div>');
                        return false;
                    } else {
					
					 $('#alert').html('');
                        $('#frame').prop('src', data.checkoutUrl);
                        //$('#sendOrderToAlepayInstallment').modal('show');
						$('#sendOrderToAlepayInstallment').show();
                        $('#alert').html('');
                    }

                }
            });
			}
            return false;
        });

    $("#remoteid").keypress(function (e) {
		  var keyCode = e.which;
//alert(keyCode);
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(keyCode, [8,32,37,116,38,40]) !== -1 ||
             // Allow: Ctrl+A, Command+A
			(e.ctrlKey === true || e.metaKey === true) ||
            (e.which === 0)) { //delete, home, end...
                 // let it happen, don't do anything
                 return true;
        }
        // Ensure that it is a number and stop the keypress
        if (e.shiftKey || (keyCode < 48 || keyCode > 57)) {
//alert(keyCode);
            e.preventDefault();
return false;
        }
    });



$("#clearstorage").on('click', function(e){
SetCookie('UserSettings' , "", 0);
location.reload(); 
e.preventDefault();
});
	
});

