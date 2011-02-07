
Ext.ns('App');
//main ui

var App = Ext.apply(new Ext.util.Observable,{

	/**
	 * UI Container object
	 *
	 * @type object
	 */
	ui: {},
	activePage: 0,
	maxPageNum: 2,
	prevCard: null,
	/**
	 * UI pages
	 */

	/**
	 * bootstrap
	 */
	bootstrap: function() {
		this.initUi();
		this.initEventListener();
	}

	/**
	 * init the application ui
	 */
	, initUi: function() {
		this.ui = new App.Ui();
	}

	/**
	 * Init Event Listener
	 */
	, initEventListener: function() {
	}
	
	, nextStimulus: function(e, from){
	
		if(e.type == 'swipe' && e.direction != 'left') return; //don't handle this direction
		
		var animation = {
				type: 'slide',
				direction: 'left'
		};
		if(e.type == 'tap'){
			animation = {
					type: 'flip',
					direction: 'left'
			};
		}
		
		var nextCard = this.ui.emotePage;
		if( this.prevCard ){
			nextCard = this.prevCard;
		}
		App.ui.setCard(nextCard,animation);
	}
	
	, nextTutorial: function(e, from){
		var animation = {
				type: 'slide',
				direction: 'left'
		};
		App.ui.setCard(this.ui.emotePage,animation);
	}
	
	, prevTutorial: function(e,from){
		var animation = {
				type: 'slide',
				direction: 'right'
		};
		App.ui.setCard(this.ui.stimulusPage,animation);
	}
	
	, prevEmote: function(e,from){
		var animation = {
				type: 'slide',
				direction: 'right'
		};
		App.ui.setCard(this.ui.stimulusPage,animation);
	}
	
	, popupEmote: function(e,from){
		var animation = {
			type: 'flip',
			direction: 'right'
		};
		this.prevCard = this.ui.emotePage;
		App.ui.setCard(this.ui.stimulusPage, animation);
	}
	
	, nextEmote: function(e,from){
		var animation = {
				type: 'slide',
				direction: 'left'
		};
		var emoteId = this.ui.emotePage.faceCol + '_' + this.ui.emotePage.faceRow;
		this.ui.intensityPage.setEmote(emoteId);
		App.ui.setCard(this.ui.intensityPage,animation);
	}
	
	, prevIntensity: function(e,from){
		var animation = {
				type: 'slide',
				direction: 'right'
		};
		App.ui.setCard(this.ui.emotePage,animation);
	} 
	
	,nextIntensity: function(e,from){
		var animation = {
				type: 'slide',
				direction: 'left'
		};
		App.ui.setCard(this.ui.verbatimPage,animation);
	}
	
});


Ext.ns('App.Ui');
App.Ui = Ext.extend(Ext.Container, {
	
	stimulusPage: null,
	tutorialPage: null,
	emotePage: null,
	intensityPage: null,
	verbatimPage: null,
	
	initComponent: function() {
		//this.stimulusPage = new App.Ui.StimulusPage();
		//this.tutorialPage = new App.Ui.TutorialPage();
		this.stimulusPage = new App.Ui.WelcomePage()
		this.emotePage = new App.Ui.EmotePage();
		this.intensityPage = new App.Ui.IntensityPage();
		this.verbatimPage = new App.Ui.VerbatimPage();
		
		//add event handlers
		var config = {
			fullscreen: true,
			layout: 'card',
			activeItem: 0,
			animation: 'slide',
			autoDestroy: false,
			items: [
			        this.stimulusPage,
			//        this.tutorialPage,
			        this.emotePage,
			        this.intensityPage,
			        this.verbatimPage
			]
		};
		Ext.apply(this, config);
		App.Ui.superclass.initComponent.call(this);
	}
});


App.Ui.StimulusPageArea = Ext.extend(Ext.Panel, {
	initComponent: function() {
		var config = {
			fullscreen: true,
			layout: 'card',
			scroll: 'vertical',
			html: '<div class="stimulus-desc"><div class="stimulus-desc-title">Arabiatta Sauce</div>' + 
				'<div class="stimulus-desc-text">You just experienced Pepe & Pants Arrabiata Pasta Sauce.' +
				' We\'d like to know how you felt about your experience.</div></div><div class="stimulus-item"><img src="../images/bottle_item.png"></div>'
		};
		Ext.apply(this, config);
		App.Ui.StimulusPageArea.superclass.initComponent.call(this);
	}
	, afterRender: function() {
		App.Ui.StimulusPageArea.superclass.afterRender.call(this);
		this.mon(this.el, {
				swipe: function (e){ 
					return App.nextStimulus(e,this); 
				},
				scope: this
		});
	}
});
Ext.reg('App.Ui.StimulusPageArea', App.Ui.StimulusPageArea);

App.Ui.StimulusToolbar = Ext.extend(Ext.Toolbar, {
	initComponent: function() {
		var config = {
			title: '<div style="padding-top: 5px;"><img src="../images/e.mote-logo.png"></div>',
			dock: 'top',
			cls: 'emote-toolbar-blue',
			layout: 'hbox'
		};
		Ext.apply(this, config);
		App.Ui.StimulusToolbar.superclass.initComponent.call(this);
	}
	, afterRender: function() {
		App.Ui.StimulusToolbar.superclass.afterRender.call(this);
		this.mon(this.el, {
			tap: App.nextStimulus,
			scope: App
		});
	}
});
Ext.reg('App.Ui.StimulusToolbar', App.Ui.StimulusToolbar);


App.Ui.StimulusPage = Ext.extend(Ext.Panel, {
	initComponent: function() {
	
		var toolBar = new App.Ui.StimulusToolbar();
		var stimulusPageArea = new App.Ui.StimulusPageArea();

		var config = {
			title: 'Stimulus page',
			layout:'card',
			fullscreen: true,
			cls: 'stimulus-bg',
			activeItem: 0, // make sure the active item is set on the container config!
			items: [
			        stimulusPageArea
			],
			dockedItems:[
			             toolBar
			]
		};
		Ext.apply(this, config);
		App.Ui.StimulusPage.superclass.initComponent.call(this);
	}
});
Ext.reg('App.Ui.StimulusPage', App.Ui.StimulusPage);


App.Ui.WelcomePage = Ext.extend(Ext.Panel, {
	initComponent: function() {
	
		var toolBar = new App.Ui.StimulusToolbar();

		var config = {
			title: 'Stimulus page',
			layout:'card',
			fullscreen: true,
			cls: 'stimulus-bg',
			activeItem: 0, // make sure the active item is set on the container config!
			html: '<div class="stimulus-desc">' +
				'<div class="welcome-text">'+
				'You are about to experience <span class="bold-text">e.mote</span>&#0153;, a new <i>(and hopefully fun!)</i> way to give feedback on people, products or services.' +
				'<br/><br/>'+
				'And no worries, your <span class="bold-text">e.mote</span>&#0153; responses are anonymous' +
				'so you can express how you really feel. <br/><br/>' +
				'Enjoy <span class="bold-text">"e.moting!"</span>.<br/><br/>' +
				'</div>' +
				'<div><a href="#" id="get-started"><img src="../images/get_started_button.png"></a></div>' +
			'</div>',

			dockedItems:[
			             toolBar
			]
		};
		Ext.apply(this, config);
		App.Ui.WelcomePage.superclass.initComponent.call(this);
	},
	
	afterRender: function() {
		App.Ui.WelcomePage.superclass.afterRender.apply(this, arguments);
		this.faceEl = Ext.get('get-started');
		this.mon(Ext.get('get-started'), {
			tap: App.nextStimulus,
			scope: App
		});
		//Ext.get('get-started').on(Ext.isChrome ? 'click' : 'tap', this.onStartTap, this);
	}
});
Ext.reg('App.Ui.WelcomePage', App.Ui.WelcomePage);


App.Ui.TutorialPage = Ext.extend(Ext.Panel, {
	initComponent: function() {
		var toolBar = new Ext.Toolbar({
			title: 'Tutorial',
			dock: 'top',
			layout: 'hbox',
			cls: 'emote-toolbar-blue',
			items: [
			        new Ext.Button({
			        	text: 'back',
			        	ui: 'back',
			        	cls: 'emote-toolbar-blue',
			        	style: {
			        		//backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.33, rgb(91,127,219) ), color-stop(0.7, rgb(35,83,194)))"
			        		backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.33, rgb(91,127,219) ), color-stop(0.7, rgb(35,83,194)))"
			        	},
			        	handler: function(e){
			        		return App.prevTutorial(e,this);
			        	}
			        }),
			        {
			        	xtype: 'spacer'
			        },
			        new Ext.Button({
			        	text: 'next',
			        	style: {
			        		//backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.33, rgb(91,127,219) ), color-stop(0.7, rgb(35,83,194)))"
			        		backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
			        	},
			        	handler: function(e){
		        			return App.nextTutorial(e,this);
		        		}
			        })
			]
		});

		var config = {
			fullscreen: true,
			layout: 'card',
			html: '<i>Tutorial page here...</i>',
			dockedItems:[
			            toolBar
			]
		};
		Ext.apply(this, config);
		App.Ui.TutorialPage.superclass.initComponent.call(this);
	}

});
Ext.reg('App.Ui.TutorialPage', App.Ui.TutorialPage);


App.Ui.EmotePageToolbar = Ext.extend(Ext.Toolbar, {
	initComponent: function() {
		var config = {
			title: 'Emotion',
			dock: 'top',
			cls: 'emote-toolbar-blue',
			layout: 'hbox',
			items:[
					new Ext.Button({
						text: '&nbsp;back&nbsp;',
						handler: App.prevEmote,
						style: {
							backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
						},
						scope: App
					}),
					{xtype: 'spacer'},
					new Ext.Button({
						text: '&nbsp;next&nbsp;',
						handler: App.nextEmote,
						style: {
							backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
						},
						scope: App
					}),
			]
		};
		Ext.apply(this, config);
		App.Ui.EmotePageToolbar.superclass.initComponent.call(this);
	}
});


App.Ui.EmotePage = Ext.extend(Ext.Panel, {
	
	faceEl: null,
	faceCol: 2,
	faceRow: 7,
	maxWidth: 302,
	maxHeight: 325,
	
	faceNames: {
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
	},
	
	initComponent: function() {
		var toolBar = new App.Ui.EmotePageToolbar();
		var config = {
			fullscreen: true,
			layout: 'card',
//			html: '<div id="main_face_desc_area" style="font-weight: bold;font-size: 20px;text-align: center;">AMAZING</div><div id="main_face_area"><div id="face_area"></div><div id="face_shadow"></div></div>',
			html: '<div id="emotion-stimulus"><div class="stimulus-short">Tell us how you felt about your most recent experience with <b>service at Starbucks</b>.</div>'+
			'<div id="face-name"><div style="color: red;font-size: 12px;">Move finger around light blue area to search for emoticon that best reflects your experience.</div></div></div><div class="face-area-bg"><div id="face-area"></div>'+
			'<div class="face-shadow"></div></div>',
			dockedItems: [
			              toolBar
			]
		};
		Ext.apply(this, config);
		App.Ui.EmotePage.superclass.initComponent.call(this);
	}
	
	, afterRender: function() {
		App.Ui.EmotePage.superclass.afterRender.call(this);
		this.faceEl = Ext.get('face-area');
		this.mon(this.faceEl, {
			touchmove: this.onSelectFace,
			scope: this
		});
		
		this.mon(Ext.get('emotion-stimulus'),{
			tap: function(e){
    			return App.popupEmote(e,this);
    		},
			scope: this
		});
	}
	
	, onSelectFace: function(e) {
		var el_x = e.pageX - this.faceEl.getX();
		var el_y = e.pageY - this.faceEl.getY();
		if(el_x > 0 && el_x < this.maxWidth && el_y > 0 && el_y < this.maxHeight){
			var numCol = Math.ceil(el_x/(this.maxWidth/2));
			var numRow = Math.ceil(el_y/(this.maxHeight/10));
			if(numCol != this.faceCol || numRow != this.faceRow){
				var offset_x = (numCol - 1) * this.maxWidth;
				var offset_y = (numRow - 1) * this.maxHeight + 25;
				this.faceEl.setStyle('background-position', offset_x +'px'+' -' + offset_y + 'px' );
				var faceName = this.faceNames[numCol + '_' + numRow];
				Ext.get('face-name').update(faceName.toUpperCase());
				this.faceCol = numCol;
				this.faceRow = numRow;
			}
		}
	}
});
Ext.reg('App.Ui.EmotePage', App.Ui.EmotePage);


App.Ui.IntensityPageToolbar = Ext.extend(Ext.Toolbar, {
	initComponent: function() {
		var config = {
			title: 'Intensity',
			dock: 'top',
			cls: 'emote-toolbar-blue',
			layout: 'hbox',
			items:[
					new Ext.Button({
						text: '&nbsp;back&nbsp;',
						handler: App.prevIntensity,
						style: {
							backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
						},
						scope: App
					}),
					{xtype: 'spacer'},
					new Ext.Button({
						text: '&nbsp;next&nbsp;',
						handler: App.nextIntensity,
						style: {
							backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
						},
						scope: App
					}),
			]
		};
		Ext.apply(this, config);
		App.Ui.IntensityPageToolbar.superclass.initComponent.call(this);
	}
});
Ext.reg('App.Ui.IntensityPageToolbar', App.Ui.IntensityPageToolbar);


App.Ui.IntensityPage = Ext.extend(Ext.Panel, {
	
	faceIntensity: {
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
	},
	
	prevEmoteId: null,
	intensityEl: null,
	intensityFaceEl: null,
	intensityBgEl: null,
	start_y: null,
	maxBgHeight: 300,
	maxHeight: 325,
	faceRow: 1,
	faceName: '',
	
	initComponent: function() {
		var toolBar = new App.Ui.IntensityPageToolbar();
		var config = {
			fullscreen: true,
			layout: 'card',
			html: '<div id="intensity-stimulus"><div class="stimulus-short">The Arrabiata Pasta Sauce made me feel:</div><div id="iface-name">AMAZING</div></div><div id="intensity-big-area" class="face-area-bg"><div id="intensity-area"></div><div class="face-shadow"></div></div><div id="intensity-bg2"></div>',
			dockedItems: [
			              toolBar
			]
		};
		Ext.apply(this, config);
		App.Ui.IntensityPage.superclass.initComponent.call(this);
	}
	
	, afterRender: function() {
		App.Ui.IntensityPage.superclass.afterRender.call(this);
		this.intensityEl = Ext.get('intensity-big-area');
		this.intensityFaceEl = Ext.get('intensity-area');
		this.intensityBgEl = Ext.get('intensity-bg2');
		this.start_y = this.intensityBgEl.getY();
/*		
		this.mon(this.intensityEl, {
			touchmove: this.onSelectIntensity,
			scope: this
		});
		this.mon(this.intensityBgEl, {
			touchmove: this.onSelectIntensity,
			scope: this
		});
*/
		this.mon(this.intensityEl, {
			touchmove: this.onSelectIntensity,
			scope: this
		});
	}
	
	,setEmote: function(emoteId){
		var imgSrc = this.faceIntensity[emoteId].img;
		this.intensityFaceEl.setStyle('background', "url('../images/" + imgSrc + "') 0px -35px" );
		this.faceName = App.ui.emotePage.faceNames[emoteId];
		Ext.get('iface-name').update(this.faceName.toUpperCase());
	}
	
	,onSelectIntensity: function(e){
		var el_y = e.pageY - this.intensityEl.getY();
		//console.info('el_y: ' + el_y + ", bgY: " + this.intensityBgEl.getY());
		var bg_height = this.start_y - e.pageY;
		if(bg_height <= this.maxBgHeight ){
			this.intensityBgEl.setStyle('height', bg_height + 'px' );
		}
		if(el_y > 0 && el_y < this.maxHeight){
			var num_row = Math.ceil(el_y/(this.maxHeight/3));
			if( num_row != this.faceRow){
				var offset_x = (3 - num_row) * 302;
				this.intensityFaceEl.setStyle('background-position', '-' + offset_x +'px'+' -35px' );
				var fullFaceName = this.faceName;
				if(num_row == 1)
					fullFaceName = 'very ' + fullFaceName;
				if(num_row == 3)
					fullFaceName = 'a little ' + fullFaceName;
				Ext.get('iface-name').update(fullFaceName.toUpperCase());
				
			}
			this.faceRow = num_row;
		}
	}

});
Ext.reg('App.Ui.IntensityPage', App.Ui.IntensityPage);


App.Ui.VerbatimToolbar = Ext.extend(Ext.Toolbar, {
	initComponent: function() {
		var config = {
			title: 'Emotion',
			dock: 'top',
			cls: 'emote-toolbar-blue',
			layout: 'hbox',
			items:[
					new Ext.Button({
						text: '&nbsp;back&nbsp;',
						handler: App.prevVerbatim,
						style: {
							backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
						},
						scope: App
					}),
					{xtype: 'spacer'},
					new Ext.Button({
						text: '&nbsp;next&nbsp;',
						handler: App.nextVerbatim,
						style: {
							backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%,   color-stop(0.7, rgb(3,43,117) ), color-stop(0.33, rgb(106,127,183)))"
						},
						scope: App
					}),
			]
		};
		Ext.apply(this, config);
		App.Ui.VerbatimToolbar.superclass.initComponent.call(this);
	}
});

App.Ui.VerbatimPage = Ext.extend(Ext.Panel, {
	initComponent: function() {
	
		var toolBar = new App.Ui.VerbatimToolbar();

		var config = {
			title: '&nbsp;',
			layout:'card',
			fullscreen: true,
			cls: 'stimulus-bg',
			activeItem: 0, // make sure the active item is set on the container config!
			html: '<div>You said your experience with [SHORT DESCRIPTION] made you feel [EMOTION]. Why?</div>' + 
			'<textarea>Because...</textarea>',
			dockedItems:[
			             toolBar
			]
		};
		Ext.apply(this, config);
		App.Ui.VerbatimPage.superclass.initComponent.call(this);
	}
});
Ext.reg('App.Ui.VerbatimPage', App.Ui.VerbatimPage);

Ext.setup({
		fullscreen: true,
		tabletStartupScreen: 'images/sencha_ipad.png',
		phoneStartupScreen: 'images/sencha_iphone.png',
		//icon: 'icon.png',
		addGlossToIcon: false,
		onReady: App.bootstrap,
		scope: App
});

//Preloader
//http://www.ajaxblender.com/howto-create-preloader-like-at-extjs-com.html
