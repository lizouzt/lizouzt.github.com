Globle = {
	push: function(o){
		for(var key in o){
			Globle[key] = o[key];
		}
	}
}

var page = function(){}
page.dashStr = '';
page.boardStr = '';
page.variation = false;
page.dotting = false;
page.decimal = false;
page.isdeleting = false;
page.curtar = null;
page.cnnums = ['〇','一','二','三','四','五','六','七','八','九'];
page.baseunits = ['','十','百','千'];
page.units = ['','万','亿','兆','京','垓','秭','穰','沟','涧','正','载','极','恒河沙','阿僧祇','那由他','不可思议','无量','大数'];
page.initFontSize = function(){
	var inputH = Globle.inputDisplay.clientHeight;
	Globle.inputDisplay.style.fontSize = inputH + 'px';
	Globle.inputDisplay.style.lineHeight = inputH + 'px';
	Globle.inputDisplay.ins = inputH - 5;
	Globle.inputDisplay.criticalPoint = Globle.inputDisplay.clientWidth;
	Globle.keyboard.style.lineHeight = Globle.keyboard.children[0].clientHeight + 'px';
	Globle.outputDisplay.style.height = Globle.board.clientHeight - 110 + 'px';
}
page.updateDisplay = function(){
	this.dashFlowCtr();
	Globle.inputDisplay.children[0].innerHTML = this.dashStr;
	Globle.outputDisplay.innerHTML = this.boardStr;
}
page.dashFlowCtr = function(){
	var disp = Globle.inputDisplay, cw = disp.children[0].offsetWidth, dif = disp.clientWidth - cw;
	if(!!this.isdeleting){
		if(dif > disp.criticalPoint){
			disp.style.fontSize = 5 + Math.ceil(disp.ins * (dif / disp.clientWidth)) + 'px';
			disp.criticalPoint = dif;
			this.isdeleting = false;
		}
	}else{
		if(dif < disp.criticalPoint){
			disp.style.fontSize = 5 + Math.floor(disp.ins * (dif / disp.clientWidth)) + 'px';
			disp.criticalPoint = dif;
		}
	}
}
page.boardFlowCtr = function(){
	this.decimal = false;
	var len = this.dashStr.length, unit = '', result = '';
	if(len >= 72){
		result = '反人类数字......';
		Globle.outputDisplay.className = 'disabled';
		setTimeout(function(){
			Globle.outputDisplay.className = '';
		}, 500);
	}else{
		var tempStr = this.dashStr.split('.');
		var before = tempStr[0].split('').reverse();
		var after = tempStr[1];

		var sets = Math.ceil(before.length / 4);
		for(var i = sets - 1; i >= 0; i--){
			var num = i * 4;
			var aset = before.slice(num, num + 4);
			aset = aset.reverse();
			var unit = this.units[i];
			var setTemp = this.baseSetCtr(aset);
			result += setTemp == ('〇' || '零') ? setTemp : setTemp.replace(/[〇+|零+]$/, '') + unit;
		}
		result = result.replace(/〇+|零+/g, this.cnnums[0]).replace(/(〇+|零+)$/, '');

		if(!!after){
			this.decimal = true;
			var afterTemp = this.baseSetCtr(after);
			if(result.length == 0)
				result += this.cnnums[0];
			result += '点' + afterTemp;
		}
	}
	this.boardStr = result;
}
page.baseSetCtr = function(aset){
	var str = '', zc = 0;
	for(var i = 0, j = aset.length - 1; i <= j; i++){
		var cnnum = this.cnnums[parseInt(aset[i])];
		if(aset[i] == 0){
			if(zc == 0 || this.decimal){
				str += cnnum;
				zc = 1;
			}
		}else{
			var baseunit = this.baseunits[j - i];
			str += this.decimal ? cnnum : cnnum + baseunit;
		}
	}
	return str;
}
/*位数和转换*/
page.delChar = function(){
	this.isdeleting = true;
	this.dashStr = this.dashStr.slice(0, -1);
	this.boardFlowCtr();
	this.updateDisplay();
}
page.addChar = function(num){
	this.dashStr += num;
	this.boardFlowCtr();
	this.updateDisplay();
}
page.clearResult = function(){
	this.dashStr = '';
	this.boardStr = '';
	this.isdeleting = false;
	this.updateDisplay();
}
page.sparkle = function(el){
	this.curtar.className = '';
	el.className = 'disabled';
	this.variation = true;
	var self = this;
	setTimeout(function(){
		el.className = '';
		self.variation = false;
		self.dotting = false;
	}, 500);
}
page.initEvent = function(){
	var self = this,
		clock = 0,
		delInterval = null,
	del = function(){
		if(self.dashStr.length < 1)
			self.sparkle(self.curtar);
		else{
			self.delChar();
			delInterval = setInterval(function(){
				if(clock <= 2000){
					if(self.dashStr.length < 1){
						self.sparkle(self.curtar);
						clearInterval(delInterval);
						delInterval = null;
						clock = 0;
					}else{
						self.delChar();
						clock += 100;
					}
				}else{
					self.clearResult();
					this.isdeleting = false;
					clearInterval(delInterval);
					delInterval = null;
					clock = 0;
				}
			}, 100);
		}
	},
	point = function(){
		if(self.dashStr.indexOf('.') == -1){
			if(self.dashStr.length == 0)
				self.addChar('0.');
			else
				self.addChar('.');
		}else
			self.sparkle(self.curtar);
	}
	zero = function(){
		if(self.dashStr.length > 0)
			self.addChar('0');
		else
			self.addChar('0.');
	};

	Globle.keyboard.addEventListener('touchstart', function(e){
		e.preventDefault();
		var target = e.target;
		if(!!target && target.tagName == 'DIV' && !self.dotting && !self.variation){
			target.className = 'actived';
			var str = target.innerHTML;
			self.curtar = target;
			self.dotting = true;
			clock = 0;
			if(str == '☜')
				del();
			else if(str == '.')
				point();
			else if(str == '0')
				zero();
			else{
				self.addChar(str);
			}
		}
	}, false);

	Globle.keyboard.addEventListener('touchend', function(){
		if(!self.variation){
			self.curtar.className = '';
			self.dotting = false;
			if(!!delInterval){
				clearInterval(delInterval);
				delInterval = null;
				clock = 0;
			}
			if(!!this.isdeleting)
				this.isdeleting = false;
		}
	});
}
page.initCtrEvent = function(){
	var ctrBtn = Globle.ctrPanel.querySelectorAll('li'),
		self = this;

	ctrBtn[0].addEventListener('touchstart', function(){
		this.className = 'actived';
		ctrBtn[1].className = '';
		self.cnnums = ['〇','一','二','三','四','五','六','七','八','九'];
		self.baseunits = ['','十','百','千'];
		self.units = ['','万','亿','兆','京','垓','秭','穰','沟','涧','正','载','极','恒河沙','阿僧祇','那由他','不可思议','无量','大数'];
		self.boardFlowCtr();
		self.updateDisplay();
	}, false);

	ctrBtn[1].addEventListener('touchstart', function(){
		this.className = 'actived';
		ctrBtn[0].className = '';
		self.cnnums = ['〇','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
		self.baseunits = ['','拾','佰','仟'];
		self.units = ['','萬','億','兆','京','垓','秭','穰','溝','澗','正','載','極','恆河沙','阿僧祇','那由他','不可思議','無量','大數'];
		self.boardFlowCtr();
		self.updateDisplay();
	}, false);

	ctrBtn[3].addEventListener('touchstart', function(){
		this.className = 'actived';
		ctrBtn[4].className = '';
		self.cnnums[0] = '〇';
		self.boardFlowCtr();
		self.updateDisplay();
	}, false);

	ctrBtn[4].addEventListener('touchstart', function(){
		this.className = 'actived';
		ctrBtn[3].className = '';
		self.cnnums[0] = '零';
		self.boardFlowCtr();
		self.updateDisplay();
	}, false);

	window.addEventListener('orientationchange', function(){
		self.initFontSize();
		self.updateDisplay();
	}, false);
}
page.init = function(){
	page.initFontSize();
	page.initEvent();
	page.initCtrEvent();
}

window.onload = function(){
	if(!document.getElementById('dash'))
		return;
	Globle.push({
		dash: document.getElementById('dash'),
		board: document.getElementById('board'),
		inputDisplay: dash.querySelector('article p'),
		keyboard: dash.querySelector('section'),
		outputDisplay: board.querySelector('article'),
		ctrPanel: board.querySelector('section')
	});
	page.init();
}
