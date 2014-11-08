var popBox = function(){
	var boxWrapper = document.getElementById('popBox'),
		infoBox = boxWrapper.children[0],
		closeBtn = boxWrapper.children[1],
		header = document.getElementById('header');

	var popUp = function(){
		boxWrapper.className = 'show';
		header.className = 'hang';
	};

	var popDown = function(){
		boxWrapper.className = '';
		header.className = '';
		infoBox.innerHTML = '';
	};

	return function(list){
		var touchSupport = ("createTouch" in document),
			eventStr = touchSupport ? 'touchstart' : 'click';
		var popClick = function(e){
			e.preventDefault();
			var target = e.target,
				info = target.getAttribute('data-pop');
			if(!!popList[info]){
				infoBox.innerHTML = popList[info];
				popUp();
			}
		}
		for(i in list){
			list[i].addEventListener(eventStr, popClick, false);
		}

		closeBtn.addEventListener(eventStr, function(e){
			e.preventDefault();
			popDown();
		}, false);
	};
}();

var popList = {
	'qq': '<h5>QQ</h5>\
		   <p>376934557</p>',
	'email': '<h5>EMAIL</h5>\
			  <p>lizouzt@gmail.com</p>',
	'history': '<h5>历史渊源</h5>\
				<p>礼州镇古称“苏祁县”，位于西昌市北部，距西昌仅23公里，地域35平方公里，田地开阔，是西昌市稻麦黍薯礼州古镇礼州古镇及经济作物主要区之一。</p>\
				<p>礼州镇古是古代南方丝绸之路的一大驿站，是天府之国的一座古镇，也是红军长征走过的地方。现在的礼州古镇建于明代，城镇内外有七街八巷。有四大城门，东为迎晖门（现名新运门），南为启文门，西为宝城门，北为迎恩门。</p>\
				<p>礼州历史悠久，曾七朝设县郡，五代置州所，有“蜀军安营驻戌，太平军筑台吊鼓，工农红军打富济贫”等光辉史迹，为南丝绸之路牦牛古道驿站。镇境内有三处古城和新石器遗址，曾出土文物千余件。是西昌的北大门和各民族进行政治、经济、文化交流的重镇。1995年1月14日，经省政府批准，礼州镇被列为四川省级历史文化名镇。</p>\
				<p>礼州古镇多为清代建筑，砖木或土木结构。明亮的天井，高大的风火墙，弯曲的美人靠，精巧的吊脚楼象征着不同祖籍工匠的建筑文化特色。走进礼州民居小院，但见小青瓦覆盖的屋面，穿逗式的梁枋，镂空雕花的门窗，显得是那么的古朴。</p>\
				<span>编辑扩展</span>',
	'future': '<h5>近期变迁</h5>',
	'about': '<h5>关于</h5>\
			  <p>作者乃礼州贵屯人士，数年在外，对家乡之人、之物思念之切之深。然礼州无一主页，巧，此乃吾之技能，故做此网站，聊以寄情。</p>\
			  <p>考虑到家乡人民上网使用工具限制，本网站只保证了最基础的功能，等家乡时代进一步发展，作者会更新本站。</p>\
			  <span>本站不做推广，只待爱乡人士浏览。</span>'
};