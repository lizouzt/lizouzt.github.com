document.createElement("nav");
document.createElement("header");
document.createElement("footer");
document.createElement("section");
document.createElement("aside");
document.createElement("article");
var scrollIE = function(dir, el, dis){
	var seq = dis / 10,		
		i = 0;

	var interval = setInterval(function(){
		if(i < 10){
			if(dir == 'left')
				el.style.left = parseInt(el.style.left.slice(0, -2)) + seq + 'px';
			else
				el.style.top = parseInt(el.style.top.slice(0, -2)) + seq + 'px';
			++i;
		}else
			clearInterval(interval);
	}, 50);
}