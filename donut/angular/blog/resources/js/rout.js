var scrollHandler = function(e){
	var offsetH = window.pageYOffset;
	var alreadyH = /hg/i.test(document.body.className);
	if(offsetH >= 50 && !alreadyH)
		document.body.className += ' hg';
	else if(offsetH < 50 && alreadyH)
		document.body.className = document.body.className.replace(/\s*hg/gi, '');
}

var web = function(){}
web.initGlobleVariables = function(){
	window.__mordern = !!window.history.pushState;
}
web.bindPageEvent = function(){
	if(__mordern){
		
	}
}
web.init = function(){
	this.initGlobleVariables();
	this.bindPageEvent();
	console.log('init');
}

web.init();
window.onscroll = scrollHandler;