var urlPath=window.location.pathname; 

(function($){
	var Navigation = function(element, options){
		
		var obj = this;
		var elem = $(element);
		var inAnim = false;
		
		var backTopButton = null;
		var nextTopButton = null;
		
		
		var defaults = {
			nextElements: []
			,prevElements: []
			,currentSlide: 0
			,dotsElement: null
			,backTopButton: null
			,nextTopButton: null
			,slidePreloader: null
			
		};
		
		var config = $.extend(defaults, options || {});
		
		elem.sudoSlider({
			speed : 600
			,ease: 'easeOutQuart'
			,prevNext:false
			,startSlide: config.currentSlide+1
			,beforeAniFunc: function(){
				inAnim = true;
			}
			,afterAniFunc: function(){
				inAnim = false;
			}
		});
		
		var slides = elem.find("ul").children("li").each(function(index,el){return $(el)});
		
		if( config.backTopButton)
			backTopButton = $(config.backTopButton);
		
		if( config.nextTopButton)
			nextTopButton = $(config.nextTopButton);
		
		var dotsImages = [];
		if(config.dotsElement)
			dotsImages = $(config.dotsElement).children("img");
		
		//methods
		this.nextSlide = function(){
			if(config.currentSlide >= slides.length) return;
			if(inAnim) return;
			if(config.slidePreloader)
				config.slidePreloader(slides[config.currentSlide],slides[config.currentSlide+1],'next',function(){
					obj._changeSlide(config.currentSlide, config.currentSlide + 1);
				});
			else
				obj._changeSlide(config.currentSlide, config.currentSlide + 1);
		}
		
		$.each(config.nextElements,function(index,nextEl){
			
			$(nextEl).click(obj.nextSlide);
			
		});
		
		
		this.prevSlide = function(){
			if(config.currentSlide <= 0) return;
			if(inAnim) return;
			if(config.slidePreloader)
				config.slidePreloader(slides[config.currentSlide],slides[config.currentSlide - 1],'prev',function(){
					obj._changeSlide(config.currentSlide, config.currentSlide - 1);
				});
			else
				obj._changeSlide(config.currentSlide, config.currentSlide - 1);
		}
		
		$.each(config.prevElements,function(index,prevEl){
			$(prevEl).click(obj.prevSlide);
		});
		
		
		this._changeSlide = function(oldSlideIndex, newSlideIndex){
			var slide = slides[oldSlideIndex];
			$(slide).trigger("deactivateslide",[obj]);
			elem.sudoSlider(newSlideIndex + 1);
			obj.setDot(newSlideIndex);
			slide = slides[newSlideIndex];
			$(slide).trigger("activateslide",[obj]);
			config.currentSlide = newSlideIndex;
		}
		
		
		this.setDot = function(indexDot){
			
			if(indexDot < 0 || indexDot > dotsImages.length) return;
			
			$.each(dotsImages,function(index,imageEl){
				$(imageEl).attr('src', '../images/browser/white_dot.png');
			});
			$(dotsImages[indexDot]).attr('src', '../images/browser/yellow_dot.png');
		}
		
		this.setDot(config.currentSlide);
		
		this.backTopButtonState = function(){
			//if(backTopButton.attr('usemap') == '#back-button-map')
			if(backTopButton.attr('usemap'))
				return true;
			return false;
		},
		
		this.backTopButton = function(state){
			if( ! backTopButton) return;
			
			if(state){
				//turn on button
				backTopButton.attr({'usemap' : '#back-button-map', 'src' : '../images/browser/left-arrow.png'});
			}else{
				//turn off button
				backTopButton.attr({'usemap' : '', 'src' : '../images/browser/left-arrow-disabled.png'});
			}
		},
		
		this.backTopButtonVisible = function(state){
			if( ! backTopButton) return;
			var parent_el = backTopButton.parent();
			
			if(state){
				//parent_el.show();
				
				if(parent_el.hasClass('non-visible')){
					parent_el.removeClass('non-visible');
				}
				
			}else{
				//parent_el.hide();
				
				if( ! parent_el.hasClass('non-visible')){
					parent_el.toggleClass('non-visible');
				}
				
			}
		},
		
		this.nextTopButtonState = function(){
			
			//if(nextTopButton.attr('usemap') == '#next-button-map')
			if(nextTopButton.attr('usemap'))
				return true;
			return false;
			
		},
		
		this.nextTopButton = function(state){
			if( ! nextTopButton) return;
			
			if(state){
				//turn on button
				nextTopButton.attr({'usemap' : '#next-button-map', 'src' : '../images/browser/right-arrow.png'});
			}else{
				//turn off button
				nextTopButton.attr({'usemap' : '', 'src' : '../images/browser/right-arrow-disabled.png'});
			}
		},
		
		this.nextTopButtonVisible = function(state){
			if( ! nextTopButton) return;
			var parent_el = nextTopButton.parent();
			
			if(state){
				//parent_el.hide();
				
				if(parent_el.hasClass('non-visible')){
					parent_el.removeClass('non-visible');
				}
				
			}else{
				//parent_el.show();
				
				if( ! parent_el.hasClass('non-visible')){
					parent_el.toggleClass('non-visible');
				}
				
			}
		}
		
		//send event to the current slide
		$(slides[config.currentSlide]).trigger("activateslide",[obj]);
	};
	
	$.fn.navigation = function(options){
		return this.each(function(){
			var element = $(this);
			
			if (element.data('navigation')) return;
			
			var navigation = new Navigation(this, options);
			element.data('navigation', navigation);
		});
	};
	
})(jQuery);

var faceNames = {
		'1_1': 'outraged',
		'1_2': 'angry',
		'1_3': 'unhappy',
		'1_4': 'frustrated',
		'1_5': 'disgusted',
		'1_6': 'miserable',
		'1_7': 'irritated',
		'1_8': 'humiliated',
		'1_9': 'dissatisfied',
		'1_10': 'uneasy',
		'2_1': 'delighted',
		'2_2': 'elated',
		'2_3': 'happy',
		'2_4': 'excited',
		'2_5': 'thrilled',
		'2_6': 'enthusiastic',
		'2_7': 'amazed',
		'2_8': 'surprised',
		'2_9': 'satisfied',
		'2_10': 'content'
};


(function($){
	var EmotePicker = function(element, options){
		
		var obj = this;
		var elem = $(element);
		var followerOn = true;
		var picker_h = elem.height();
		var picker_w = elem.width();
		var facePickerElem = null;
		var face_h = null;
		var face_w = null;
		var followElem = null;
		
		var faceElem = null;
		var faceRow = 1;
		var faceCol = 1;
		var faceNameElem = null;
		
		var elemOffset = elem.offset();
		var facePickerElemOffset;
		
		
		var defaults = {
				faceElement: null
				,facePickerElement: null
				,followElement: null
				,faceRow: 1
				,faceCol: 1
				,faceNameElement: null
				,faceClickHandler: null
		};
			
		var config = $.extend(defaults, options || {});
		
		this.getFollow = function(){
			return followerOn;
		}
		
		this.getRow = function(){
			return faceRow;
		}
		
		this.getCol = function(){
			return faceCol;
		}
		
		this.setFollower = function(e){
			var cursorX = e.pageX - 13;
			var cursorY = e.pageY - 13;
			
			var offset = elem.offset();
			//var offset = elemOffset;
			
			var offLeft = cursorX - offset.left;
			var offTop = cursorY - offset.top;
			
			if(!facePickerElem){
				obj.setEmoteFace(Math.ceil(offLeft / (picker_w/2)), Math.ceil(offTop / ((picker_h-20)/10)));
			}else{
				var pickerOffset = facePickerElem.offset();
				var pickerLeft = pickerOffset.left + 28;
				var pickerTop = pickerOffset.top + 15;
				var realface_w = picker_w;
				var realface_h = face_h - 20;
				
				var col_num = Math.ceil((offLeft+13) / (picker_w/2));
				var row_num = 1;
				//console.log(e.pageY + " : " + pickerTop);
				if(e.pageY <= pickerTop){
					row_num = 1;
				}else if(e.pageY < pickerTop + realface_h && e.pageY > pickerTop){
					var h_delta = pickerOffset.top - offset.top;
					row_num = Math.ceil((e.pageY - h_delta - pickerTop) / ((realface_h-20)/10));
				}else{
					row_num = 10;
				}
				
				obj.setEmoteFace(col_num, row_num);
				/*
				if(e.pageX < pickerLeft + realface_w && pickerLeft < e.pageX
					&& e.pageY < pickerTop + realface_h && e.pageY > pickerTop
				){
					var h_delta = pickerOffset.top - offset.top;
					obj.setEmoteFace(Math.ceil((e.pageX - pickerLeft) / (realface_w/2)), 
									Math.ceil((e.pageY - h_delta - pickerTop) / ((realface_h-20)/10)));
				}
				*/
			}
			
			if(offTop < 13 ) offTop = 4;
			else if(offTop > picker_h - 30) offTop = picker_h - 30;
			
			if(offLeft < 13) offLeft = 4;
			else if(offLeft > picker_w - 30) offLeft = picker_w - 30;
			
			if(followElem)
				followElem.css({'left' : offLeft + 'px', 'top' : offTop + 'px'});
			
		}
		
		this.mouseFollow = function(e){
			if(!followerOn) return;
			obj.setFollower(e);
			if(followElem && followElem.is(':hidden'))
				followElem.show();
		}
		
		this.faceFollow = function(e){
			if(!followerOn) return;
			
			var cursorX = e.pageX - 13;
			var cursorY = e.pageY - 13;
			
			var offset = facePickerElem.offset();
			
			var offLeft = cursorX - offset.left;
			var offTop = cursorY - offset.top;
			
			obj.setEmoteFace(Math.ceil(offLeft / (face_w/2)), Math.ceil(offTop / ((face_h-20)/10)));
		}
		
		this.setEmoteFace = function(numCol,numRow,notName){
			if(numRow < 1) numRow = 1;
			if(numRow > 10) numRow = 10;

			if(numCol < 1) numCol = 1;
			if(numCol > 2) numCol = 2;

			if(numCol != faceCol || numRow != faceRow){
				var offset_x = (numCol - 1) * 260;
				var offset_y = (numRow - 1) * 280 + 25;
				
				if(faceElem)
					faceElem.css({'background-position' : offset_x +'px'+' -' + offset_y + 'px' });

				if(!notName){
					var faceName = faceNames[numCol + '_' + numRow];
					if(faceNameElem)
						faceNameElem.html(faceName.toUpperCase());
				}
				
				faceCol = numCol;
				faceRow = numRow;
			}
		}
		/*
		this.clickPicker = function(e){
			if(!followerOn){
				obj.setFollower(e);
				followerOn = true;
			}else{
				followerOn = false;
			}
			if(config.faceClickHandler) config.faceClickHandler(followerOn);
		}
		*/
		
		this.clickPicker = function(e){
			
			if(!followerOn){
				obj.setFollower(e);
				followerOn = true;
			}else{
				followerOn = false;
			}
			if(config.faceClickHandler){
				config.faceClickHandler(followerOn);
			}
		}
		
		this.clickFace = function(e){	
			var pickerOffset = facePickerElem.offset();
			var pickerLeft = pickerOffset.left + 28;
			var pickerTop = pickerOffset.top + 15;
			var realface_w = face_w - 28*2;
			var realface_h = face_h - (15+5);
			if(e.pageX < pickerLeft + realface_w && pickerLeft < e.pageX
					&& e.pageY < pickerTop + realface_h && e.pageY > pickerTop
			){
				if(!followerOn){
					obj.setFollower(e);
					followerOn = true;
				}else{
					followerOn = false;
				}
				if(config.faceClickHandler) config.faceClickHandler(followerOn);
			}
		}
		
		
		/* init */
		if(config.faceElement) faceElem = $(config.faceElement);
		if(config.faceNameElement) faceNameElem = $(config.faceNameElement);
		if(config.followElement) followElem = $(config.followElement);
		
		faceRow = config.faceRow;
		faceCol = config.faceCol;
			
		if(config.facePickerElement){
			facePickerElem = $(config.facePickerElement);
			face_h = facePickerElem.height();
			face_w = facePickerElem.width();
			facePickerElemOffset = facePickerElem.offset();
		}
		
		this.setEmoteFace(faceCol,faceRow,true);
		elem.mousemove(obj.mouseFollow);
		
		if(facePickerElem)
			//elem.click(obj.clickFace);
			elem.click(obj.clickPicker)
		else
			elem.click(obj.clickPicker);
	};
	
	$.fn.emotepicker = function(options){
		return this.each(function(){
			var element = $(this);

			if (element.data('emotepicker')) return;
			
			var emotepicker = new EmotePicker(this, options);
			element.data('emotepicker', emotepicker);
		});
	};
	
})(jQuery);


var faceIntensity = {
	'1_1': {
		img: 'outraged.png',
		color: '#ca2828'
	},
	'1_2': {
		img: 'angry.png',
		color: '#ca2828'
	},
	'1_3': {
		img: 'unhappy.png',
		color: '#ca2828'
                },
        '1_4': {
                        img: 'frustrated.png',
                        color: '#ca2828'
                },
        '1_5': {
                        img:'disgusted.png',
                        color: '#ca2828'
                },
        '1_6': {
                        img: 'miserable.png',
                        color: '#ca2828'
                },
        '1_7': {
                        img: 'irritated.png',
                        color: '#ca2828'
                },
        '1_8': {
                        img: 'humiliated.png',
                        color: '#ca2828'
                },
                '1_9': {
                    img: 'dissatisfied.png',
                    color: '#ca2828'
            },
    '1_10': {
                    img: 'uneasy.png',
                    color: '#ca2828'
            },
    '2_1': {
                    img: 'delighted.png',
                    color: '#ca2828'
            },
    '2_2': {
                    img: 'elated.png',
                    color: '#ca2828'
            },
    '2_3': {
                    img: 'happy.png',
                    color: '#ca2828'
            },
    '2_4': {
                    img: 'excited.png',
                    color: '#ca2828'
            },
    '2_5': {
                    img: 'thrilled.png',
                    color: '#ca2828'
            },
    '2_6': {
                    img: 'enthusiastic.png',
                    color: '#ca2828'
            },
    '2_7': {
                    img: 'amazed.png',
                    color: '#ca2828'
            },
            '2_8': {
                img: 'surprised.png',
                color: '#ca2828'
        },
'2_9': {
                img: 'satisfied.png',
                color: '#ca2828'
        },
'2_10': {
                img: 'content.png',
                color: '#ca2828'
        }
};



(function($){
	var IntensityPicker = function(element, options){
		var obj = this;
		var elem = $(element);
		var followerOn = true;
		var picker_h = elem.height();
		var picker_w = elem.width();
		var intensity_level = 50;
		var bgElem = null;
		var faceRow = 2;
		var faceElem = null;
		
		var faceId = null;
		var faceNameElem = null;
		
		var defaults = {
				backgroundElement: null
				,faceElement: null
				,followElement: null
				,faceRow: 2
				,faceNameElement: null
				,faceClickHandler: null
		};
			
		var config = $.extend(defaults, options || {});
		
		this.getRow = function(){
			return faceRow;
		}
		
		this.getFollow = function(){
			return followerOn;
		}
		
		this.getFaceId = function(){
			return faceId;
		}
		
		this.setFaceId = function(newFaceId){
			if(faceId != newFaceId){
				intensityData = faceIntensity[newFaceId];
				if(faceNameElem)
					faceNameElem.html(faceNames[newFaceId].toUpperCase());
				faceId = newFaceId;
			}
		}
		
		this.setFollower = function(e){
			var cursorX = e.pageX - 13;
			var cursorY = e.pageY - 13;
			
			var offset = elem.offset();
			//var offset = elemOffset;
			
			var offLeft = cursorX - offset.left;
			var offTop = cursorY - offset.top;
			

			intensity_level = Math.ceil(((picker_h - (e.pageY - offset.top)) * 100)/picker_h);
			
			obj.setFace(Math.ceil(offTop / ((picker_h-20)/3)));
		
			
			if(offTop < 13 ) offTop = 4;
			else if(offTop > picker_h - 30) offTop = picker_h - 30;
			
			if(offLeft < 13) offLeft = 4;
			else if(offLeft > picker_w - 30) offLeft = picker_w - 30;
			
			if(bgElem){
				var bg_h = offset.top + picker_h - e.pageY;
				bgElem.css({'height' : bg_h + 'px'});
			}
			
			if(followElem)
				followElem.css({'left' : offLeft + 'px', 'top' : offTop + 'px'});
		}
		
		this.mouseFollow = function(e){
			if(!followerOn) return;
			
			obj.setFollower(e);
			
			if(followElem && followElem.is(':hidden'))
					followElem.show();
		}
		
		this.getIntensityLevel = function(){
			return intensity_level;
		}
		
		this.setNewFace = function(imgSrc){
			$('#intensity-bg2').css({'height' : '160px'});
			$('#intensity-face').css({'background' : "url('" + imgSrc + "') -260px -25px"});
			followerOn = true;
		}
		
		this.setIntensityLevel = function(newLevel){
			if(newLevel > 100) newLevel = 100;
			if(newLevel < 0) newLevel = 0;
			
			var offset = elem.offset();
			
			intensity_level = newLevel;
			
			var bg_h = (picker_h * intensity_level) / 100;
			obj.setFace(Math.ceil((picker_h - bg_h)/3));
			
			if(bgElem){
				bgElem.css({'height' : bg_h + 'px'});
			}
			
			followerOn = false;
			if(config.faceClickHandler) config.faceClickHandler(followerOn);
		}
		
		this.setFace = function(numRow){
			if(numRow < 1) numRow = 1;
			if(numRow > 3) numRow = 3;

			numRow = 3 - numRow;

			if(numRow != faceRow){
				var offset_x = numRow * 260;
				if(faceElem)
					faceElem.css({'background-position' : '-' + offset_x +'px' + ' ' +  '-25px' });
				faceRow = numRow;
			}
			
			if(faceId){
				var faceName = faceNames[faceId];
				var strFaceName = '';
				if(numRow == 0)
					strFaceName = 'A LITTLE ' + faceName;
				else if(numRow == 1)
					strFaceName = faceName;
				else if(numRow == 2)
					strFaceName = 'VERY ' + faceName;
				if(faceNameElem)
					faceNameElem.html(strFaceName.toUpperCase());
			}
		}
		
		this.clickPicker = function(e){
			if(!followerOn){
				obj.setFollower(e);
				followerOn = true;
			}else{
				followerOn = false;
			}
			if(config.faceClickHandler) config.faceClickHandler(followerOn);
		}
		
		/* init */
		if(config.faceElement) faceElem = $(config.faceElement);
		if(config.faceNameElement) faceNameElem = $(config.faceNameElement);
		if(config.followElement) followElem = $(config.followElement);
		if(config.backgroundElement) bgElem = $(config.backgroundElement);
		
		faceRow = config.faceRow;
		
		this.setFace(faceRow);
		elem.mousemove(obj.mouseFollow);
		elem.click(obj.clickPicker);
	};
	
	$.fn.intensitypicker = function(options){
		return this.each(function(){
			var element = $(this);

			if (element.data('intensitypicker')) return;
			
			var intensitypicker = new IntensityPicker(this, options);
			element.data('intensitypicker', intensitypicker);
		});
	};
})(jQuery);

var SurveyState = {
	savedSurveyData: null
	,lastVerbatimFile: null
	,verbatimLoadedImages: {}
	,save: false
};

/* Loading object */
var Loading = function(text,disable_nav){
	this.loading_text = text || 'Loading...';
	this.disable_nav = disable_nav;
	this.nextState = '';
	this.nextState = '';
}

Loading.prototype.start = function (){
	/* disable nav buttons */
	if(this.disable_nav){
		this.nav = $('#slider').data('navigation');
		if(this.nav){
			this.nextState = this.nav.nextTopButtonState();
			this.backState = this.nav.backTopButtonState();
			this.nav.nextTopButton(false);
			this.nav.backTopButton(false);
		}
	}
	$("#ajax-preloader-text").text(this.loading_text);
	$("#ajax-preloader").show();
}

Loading.prototype.fin = function (){
	/* enable nav buttons */
	if(this.disable_nav && this.nav){
		this.nav.nextTopButton(this.nextState);
		this.nav.backTopButton(this.backState);
	}
	$("#ajax-preloader").hide('slow');
}

/* Loading fin */

var SurveyData = function(options){
	
	var obj = this;
	
	this.save = function(callDone){
		if(SurveyState.save) return;
		
		SurveyState.save = true;
		
		$("#ajax-preloader-text").text("Save...");
		$("#ajax-preloader").show();
		
		var emotePicker = $('#emote-picker').data('emotepicker');
		var intensityPicker = $('#intensity-picker').data('intensitypicker');
		
		var faceId = emotePicker.getCol() + '_' + emotePicker.getRow();
		var faceName = faceNames[faceId];

		$.ajax({
			type : 'POST',
			url: urlPath,
			
			data: {
				action: 'savesurveyresult',
				emote : faceName,
				intensity_level: intensityPicker.getIntensityLevel() ,
				verbatim: $("#verbatim-textarea").val(),
				out: 'json'
			},
			
			dataType : "json",
			
			complete: function(){
				
				$("#submit-survey-data").data('save_result',true);
				var nav = $('#slider').data('navigation');
				nav.nextTopButton(true);
				SurveyState.save = false;
				
				$("#ajax-preloader").hide(0,function(){
					$("#ajax-preloader-text").text("Loading...");
				});
				
				if(callDone){
					callDone();
				}else{
					nav.nextSlide();
				}
			}
		});
	}
};

var DemoResult = function(options){
	
	var obj = this;
	
	this.save = function(callDone){
		
		$("#ajax-preloader-text").text("Save...");
		$("#ajax-preloader").show();
		
		var demo_res = $("#demo-form").serialize();
		$.ajax({
			type : 'POST',
			url: urlPath,
			
			data: {
				action: 'savedemoresult',
				demo: demo_res,
				out: 'json'
			},
			
			dataType : "json",
			
			complete: function(){
				var nav = $('#slider').data('navigation');
				nav.nextTopButton(true);
				
				$("#ajax-preloader").hide(0,function(){
					$("#ajax-preloader-text").text("Loading...");
				});
				if(callDone){
					callDone();
				}else{
					nav.nextSlide();
				}
			}
		});
	}
};


var UserData = function(options){
	
	var obj = this;
	
	this.save = function(){
		
		$("#ajax-preloader-text").text("Save...");
		$("#ajax-preloader").show();
		
		$.ajax({
			type : 'POST',
			url: urlPath,
			
			data: {
				action: 'saveuserdata',
				name: $("#user-data-form #name").val(),
				email: $("#user-data-form #email").val(),
				phone: $("#user-data-form #phone").val(),
				out: 'json'
			},
			
			dataType : "json",
			
			complete: function(){
				var nav = $('#slider').data('navigation');
				
				$("#ajax-preloader").hide(0,function(){
					$("#ajax-preloader-text").text("Loading...");
				});
				
				nav.nextSlide();
			}
		});
	}
};


function verbatimSlide(call_swithSlide){
	var emotePicker = $('#emote-picker').data('emotepicker');
	var intensityPicker = $('#intensity-picker').data('intensitypicker');
	
	var faceId = emotePicker.getCol() + '_' + emotePicker.getRow();
	
	var faceName = faceNames[faceId];
	var intensityRow = intensityPicker.getRow() + 1;
	
	var fileName = faceName + "_intensity_" + intensityRow;
	if(fileName == SurveyState.lastVerbatimFile){
		call_swithSlide();
		return;
	}
	
	var strFaceName = faceName;
	/*
	var strFaceName = '';
	if( intensityRow == 1)
		strFaceName = 'A LITTLE ' + faceName;
	else if(intensityRow == 2)
		strFaceName = faceName;
	else if(intensityRow == 3)
		strFaceName = 'VERY ' + faceName;
	 */
	var textarea_el = $("#verbatim-textarea");
	if( ! textarea_el.data('reset_field')){
		$("#verbatim-face-name").html(strFaceName.toUpperCase());
		$("#verbatim-textarea-text-word").html(strFaceName.toUpperCase());
		textarea_el.val($("#verbatim-textarea-text").text());
	}
	if( ! SurveyState.verbatimLoadedImages[fileName]){
		var imgSrc = '../images/browser/small/' + fileName + ".png";
		
		$("#ajax-preloader").show();
		$.preload([imgSrc],{
			onFinish : function(){
				SurveyState.verbatimLoadedImages[fileName] = 1;
				$("#verbatim-image-id").attr("src", imgSrc);
			 	$("#ajax-preloader").hide();
			 	call_swithSlide();
			}
		});
	}else{
		call_swithSlide();
	}
	SurveyState.lastVerbatimFile = fileName;
}


function intensitySlide(call_swithSlide){
	
	var emotePicker = $('#emote-picker').data('emotepicker');
	var intensityPicker = $('#intensity-picker').data('intensitypicker');
	
	var faceId = emotePicker.getCol() + '_' + emotePicker.getRow();
	
	if(faceId == intensityPicker.getFaceId()){
		call_swithSlide();
		return;
	}
	
	intensityPicker.setFaceId(faceId);
	
	$('#current-face-name').html(faceNames[faceId]);
	
	var intensityData = faceIntensity[faceId];
	var imgSrc = "../images/browser/" + intensityData.img;
	if( ! intensityData.loaded){
		//$("#ajax-preloader").show();
		var loading = new Loading('Loading...',true);
		loading.start();
		$.preload([imgSrc],{
			onFinish : function(){
				intensityData.loaded = 1;
				intensityPicker.setNewFace(imgSrc);
			 	//$("#ajax-preloader").hide();
				loading.fin();
			 	call_swithSlide();
			}
		});
	}else{
		//image alredy loaded
		intensityPicker.setNewFace(imgSrc);
		call_swithSlide();
	}
}

function submitSurvey(callDone){
	var textarea_el = $("#verbatim-textarea");
	if( ! textarea_el.data('reset_field') || textarea_el.val().length < 4){
		textarea_el.trigger('focus');
		return false;
	}
	var survey_data = new SurveyData();
	survey_data.save(callDone);
}

function createSurvey(){
	
	$("#welcome-slide").bind("activateslide",function(event,nav){
		var descText = $(this).children(".short-desc-value").first().html();
		if(descText) $("#short-desc").html(descText);
		//nav.backTopButton(false);
		nav.backTopButtonVisible(false);
	});
/*	
	$("#welcome-slide").bind("deactivateslide",function(event,nav){
		nav.backTopButton(true);
	});
*/	
	$("#stimulus-slide").bind("deactivateslide",function(event,nav){
		nav.backTopButtonVisible(true);
	}).bind("activateslide",function(event,nav){
		var descText = $(this).children(".short-desc-value").first().html();
		if(descText) $("#short-desc").html(descText);
		nav.backTopButtonVisible(true);
		if($("#welcome-slide").length){
			nav.backTopButtonVisible(true);
			//nav.backTopButton(true);
		}else{
			nav.backTopButtonVisible(false);
			//nav.backTopButton(false);
		}
	});
	
	$("#emote-slide").bind("activateslide",function(event,nav){
		var descText = $(this).children(".short-desc-value").first().html();
		if(descText) $("#instruction-header-text").html(descText);
		
		var picker = $('#emote-picker').data('emotepicker');
		if(picker.getFollow())
			nav.nextTopButton(false);
		else
			nav.nextTopButton(true);
		
	}).bind("deactivateslide",function(event,nav){
		/*
		var emotePicker = $('#emote-picker').data('emotepicker');
		if( ! emotePicker.getFollow()){
			var faceId = emotePicker.getCol() + '_' + emotePicker.getRow();
			var intensityPicker = $('#intensity-picker').data('intensitypicker');
			intensityPicker.setFaceId(faceId);
			$('#current-face-name').html(faceNames[faceId]);
		}
		*/
		nav.nextTopButton(true);
	});
	
	$("#intensity-slide").bind("activateslide",function(event,nav){
		var descText = $(this).children(".short-desc-value").first().html();
		if(descText) $("#instruction-header-text").html(descText);
		var picker = $('#intensity-picker').data('intensitypicker');
	
		//$('#instruction-header').css({visibility: "visible",opacity: 0}).fadeIn("slow");
		
		if(picker.getFollow())
			nav.nextTopButton(false);
		else
			nav.nextTopButton(true);
	});
	
	
	$("#verbatim-slide").bind("activateslide",function(event,nav){
		var descText = $(this).children(".short-desc-value").first().html();
		if(descText) $("#short-desc").html(descText);
		if( ! $("#submit-survey-data").data('save_result')){
			nav.nextTopButton(false);
		}
	}).bind("deactivateslide",function(event,nav){
		nav.nextTopButton(true);
	});
	
	$("#demo-start-slide").bind("activateslide",function(event,nav){
		var descText = $(this).children(".short-desc-value").first().html();
		if(descText) $("#short-desc").html(descText);
		nav.nextTopButton(true);
	});
	
	
	if($("#demo-slide").length){
	
		$("#demo-slide").bind("activateslide",function(event,nav){
			if( ! $("#submit-demo-button").data('save_result')){
				nav.nextTopButton(false);
			}
		});
		//validate form
		$("#demo-form").validate({
			meta: "rules"
			,rules: demoValidateRules
			,invalidHandler: function(e, validator) {
				var errors = validator.numberOfInvalids();
				if(errors)
					$('#demo-form-error').html("Error was detected. Please check and try again.");
				else
					$('#demo-form-error').html("");
			}
			,submitHandler: function(form) {
				var dr = new DemoResult();
				dr.save();
				return false;
			}
			,errorPlacement: function(error, element) {
				var errorPlace = element.attr("name")+"-error";
				error.appendTo("#"+errorPlace);
			}
		});
		
		$("#submit-demo-button").click(function(e){
			$('#demo-form').submit();
			/*
			var dr = new DemoResult();
			dr.save();
			return false;
			*/
		});
		
	}
	
	$("#thanks-slide").bind("activateslide",function(event,nav){
		nav.backTopButtonVisible(false);
		nav.nextTopButtonVisible(false);
	});
	
	$("#verbatim-textarea").focus(function(e){
		var el = $(this);
		if( ! el.data('reset_field')){
			el.val('');
			el.data('reset_field',true);
		}
	});
	
	$("#submit-survey-data").click(function(e){
		//submitSurvey();
		
		var nav = $('#slider').data('navigation');
		nav.nextSlide();
		return false;
	});
	

	
	$("#slider").navigation({
		nextElements: ["#next-button area","#get-started"]
		,prevElements: ["#back-button area"]
		,dotsElement: "#dots-nav"
		,backTopButton: $("#back-button-on")
		,nextTopButton: $("#next-button-on")
		,slidePreloader: function(oldSlideEl,newSlideEl,direction,call_swithSlide){
			//yellow header
			if( newSlideEl.id == "intensity-slide" ||  newSlideEl.id == "emote-slide"){
				var ins_el = $('#instruction-header');
				if(ins_el.css('visibility') == 'hidden')
					ins_el.css({visibility: "visible", opacity: 0}).animate({opacity: 1},600);
			}else{
				var ins_el = $('#instruction-header');
				if(ins_el.css('visibility') == 'visible')
					ins_el.animate({opacity: 0},600,'',function(){ ins_el.css({visibility: "hidden"}) });
			}
		
			if(oldSlideEl.id == "emote-slide" && newSlideEl.id == "intensity-slide"){
				intensitySlide(call_swithSlide);
			}else if(oldSlideEl.id == "intensity-slide" && newSlideEl.id == "verbatim-slide"){
				verbatimSlide(call_swithSlide);
			}else if(oldSlideEl.id == "verbatim-slide" && direction == 'next'){
				submitSurvey(call_swithSlide);
			}else{
				call_swithSlide();
			}
		}
	});
	/*
	$("#next-button area").mouseenter(function() {
		$("#next-button-on").attr('src', '../images/browser/right-arrow-over.png');
	}).mouseleave(function(){
		$("#next-button-on").attr('src', '../images/browser/right-arrow.png');
	});
	
	$("#back-button area").mouseenter(function() {
		$("#back-button-on").attr('src', '../images/browser/left-arrow-over.png');
	}).mouseleave(function(){
		$("#back-button-on").attr('src', '../images/browser/left-arrow.png');
	});
	*/
		
	$("#emote-picker").emotepicker({
		faceElement: "#emote-face"
		,facePickerElement: "#emote-face"
		,followElement: "#emote-mouse-follow"
		,faceRow: 10
		,faceCol: 2
		,faceNameElement: "#emote-face-name"
		,faceClickHandler: function(followOn){
			var nav = $('#slider').data('navigation');
			if(followOn)
				nav.nextTopButton(false);
			else
				nav.nextTopButton(true);
		}
	});
	
	$("#intensity-picker").intensitypicker({
		faceElement: "#intensity-face"
		,followElement: "#intensity-mouse-follow"
//		,faceNameElement: "#intensity-face-name"
		,backgroundElement: "#intensity-bg2"
		,faceClickHandler: function(followOn){
			var nav = $('#slider').data('navigation');
			if(followOn)
				nav.nextTopButton(false);
			else
				nav.nextTopButton(true);
		}
	});
	
	
	
	$("#intensity-bound-top").click(function(){
		var intensityPicker = $('#intensity-picker').data('intensitypicker');
		if(intensityPicker.getFollow()){
			intensityPicker.setIntensityLevel(100);
		}
	});
	
	$("#intensity-bound-bottom").click(function(){
		var intensityPicker = $('#intensity-picker').data('intensitypicker');
		if(intensityPicker.getFollow()){
			intensityPicker.setIntensityLevel(0);
		}
	});
	
	$("#demo-yes-button").click(function(){
		$("#demo-start-part1").hide("slow");
		$("#demo-start-part2").show("slow");
	});
	
	$("#demo-no-button").click(function(){
		var nav = $('#slider').data('navigation');
		nav.nextSlide();
	});
	
	
	$("#submit-data-button").click(function(){
		var user_data = new UserData();
		user_data.save();
		return false;
	});
}

var SurveyRequest = function(options){
	
	var obj = this;
	
	this.getSurvey = function(survey_code){
		$.ajax({
			type: 'POST',
			url: urlPath,
			
			data: {
				action: 'getsurvey',
				survey: survey_code,
				out: 'json'
			},
			
			dataType : "json",
			
			beforeSend: function(){
				$("#survey-error-block").hide();
				$("#survey-loader-img").show();
			},
			
			
			success: function (data, textStatus) {
				if(data.status != 'ok'){
					obj.showError();
				}else{
					obj.startSurvey(data.msg);
				}
			},
			
			error: function (data, textStatus) {
				
				obj.showError();
			}
		});
	}
	
	this.showError = function(){
		$("#survey-loader-img").hide();
		$("#survey-error-block").show();
	}
	
	this.startSurvey = function(survey){
		$("#next-button area").unbind("click");
		var elSurvey = $('<div></div>').append(survey);
		
		var loadingEl = $('#loading-percent');
		$.preload(preloadImages,{
			onFinish : function(){
				$("#survey-area").html(elSurvey);
				createSurvey();
			}
		});
	}
}



function createCodeRequest(){
	//$("#back-button-on").attr({'src' : '../images/browser/back_button_off.png', 'usemap' : ''});
	
	var descText = $("#login-block").children(".short-desc-value").first().html();
	if(descText) $("#short-desc").html(descText);
	
	$("#survey-code").focus(function(e){
		var el = $(this);
		if( ! el.data('reset_field')){
			el.val('');
			el.data('reset_field',true);
		}
	});
	
	var request = new SurveyRequest();
	$("#survey-code-form").submit(function() {
		request.getSurvey($("#survey-code").val());
		return false;
	});
	$("#next-button area").click(function(){
		request.getSurvey($("#survey-code").val());
	});
}

$(document).ready(function(){
	$("#main-content").show();
	
	if( ! (window.surveyCodeRequire === undefined) && surveyCodeRequire){
		createCodeRequest();
	}else{
		createSurvey();
	}
	
	var numLoads = 0;
	var loadingEl = $('#loading-percent');
	$.preload(preloadImages,{
		onFinish : function(){
			$("#loading").fadeOut("fast");
			$("#loading-mask").fadeOut("slow");
		}
		,onComplete : function(load){
			//console.log("load image: "+ load.total + " - " + load.done);
			var percentLoads = Math.ceil((90 * load.done)/load.total) + 10;
			if(percentLoads > 100) percentLoads = 100;
			loadingEl.html(percentLoads);
		}
	});

});

//http://www.netzgesta.de/glossy/
//http://jreject.turnwheel.com/