var VirtualTour = {
	init : function(opt){
        var defaultLenght = 840, defaultImgs = this._imageSrcs;
        if (navigator.standalone !== undefined) {
            defaultLenght = 500;
            defaultImgs = this._phoneImageSrcs;
            window.kRingRadius = 100;
        }else{
            window.kRingRadius = 150;
        }

        var options = {
            wide: opt.wide || defaultLenght,
            high: opt.high || defaultLenght,
            imgs: opt.imgs || defaultImgs
        };
        transform = 'webkitTransform' in document.body.style ? 'webkitTransform' : 'mozTransform';
        var container = document.getElementById('container'),
            tempStr = '';

        for(var i = 1, j = options.imgs.length; i <= j; i++){
            tempStr += '<img id="face' + i + '" class="face" src="' + options.imgs[i-1] + '" width=' + options.wide +' height=' + options.high +'>';
        }

        container.innerHTML = tempStr;
        var img = document.createElement('img');
        img.style.width = '1px';
        document.body.appendChild(img);
        var load = setInterval(function(){
            var div = container, imgs = options.imgs;
            return function(){
                for(var i = 0, j = imgs.length; i < j; i++){
                    img.src = imgs.pop();
                    if(img.height <= 0)
                        imgs.unshift(img.src);
                }
                if(imgs.length == 0){
                    clearInterval(load);
                    div.style.opacity = '1';
                }
            }
        }(), 100);
        this._gscope = scopeOrientation(document.getElementById('rotateX'), document.getElementById('rotor-x'), document.getElementById('rotateY'), document.getElementById('rotor-y'), document.getElementById('stage'));

        container = null;
        options = null;
	},
	_imageSrcs : ["./images/5th_ave_1.jpg",
                	"./images/5th_ave_2.jpg",
                	"./images/5th_ave_3.jpg",
                	"./images/5th_ave_4.jpg",
                	"./images/5th_ave_5.jpg",
                	"./images/5th_ave_6.jpg"],
    _phoneImageSrcs: ["./images/5th_ave_1.jpg",
                    "./images/5th_ave_2.jpg",
                    "./images/5th_ave_3.jpg",
                    "./images/5th_ave_4.jpg",
                    "./images/5th_ave_5.jpg",
                    "./images/5th_ave_6.jpg"],
}

function scopeOrientation(elementX, rotorX, elementY, rotorY, container, horizontal) {
    this.elementX = elementX;
    this.rotorX = rotorX;
    this.elementY = elementX;
    this.rotorY = rotorY;
    this.startRotationX = 0;
    this.startRotationY = 0;

    var self = this,
        Gravity = 10,
        direction = window.orientation;
        
    function dimensionalJudge(a, b, g){
        var gamma, beta;
        if (direction == 0) {
            gamma = g,
            beta = b;
        }else if(direction == 180){
            gamma = g,
            beta = -b;
        }
        else if(direction == 90){
            gamma = b,
            beta = g;
        }else if(direction == -90){
            gamma = -b;
            beta = g;
        }
        
        if(Math.abs(beta) > 5){
            if(Math.abs(self.startRotationX) < 45 || (self.startRotationX * beta) < 0)
            self.startRotationX = self.startRotationX + (beta / 90) * Gravity / 2;
            console.log('beta: ' + beta);
        }

        if(Math.abs(gamma) > 5){
            self.startRotationY = self.startRotationY + (gamma / 90 ) * Gravity / 2;
            console.log('gamma: ' + gamma);
        }

        self.rotorX.style[transform] = 'rotateX(' + self.startRotationX + 'deg)';
        self.rotorY.style[transform] = 'rotateY(' + self.startRotationY + 'deg)';
    }

    if ( 'createTouch' in document ) {
        var handleOrientationEvent = function(event) {
            if(!!event.alpha){
                var a = event.alpha,
                b = event.beta,
                g = event.gamma;

                dimensionalJudge(a, b, g);
            }
            
        };

        window.addEventListener("MozOrientation", handleOrientationEvent, true);
        window.addEventListener('deviceorientation', handleOrientationEvent, false);

        window.addEventListener('orientationchange', function(e) {
            direction = window.orientation;
        }, false);

    } else {
        new scope(elementX, rotorX, elementY, rotorY, container, horizontal);
    }
}

function scope(elementX, rotorX, elementY, rotorY, container, horizontal) {
    this.elementX = elementX;
    this.rotorX = rotorX;
    this.elementY = elementX;
    this.rotorY = rotorY;
    this.container = container;
    this.startX = 0;
    this.startY = 0;
    this.startRotationX = 0;
    this.startRotationY = 0;
    this.staticRotationX = 0;
    this.staticRotationY = 0;
    this.tracking = false;
    var _self = this;

    CSSMatrix = 'WebKitCSSMatrix' in window ? WebKitCSSMatrix : ('MozCSSMatrix' in window ? MozCSSMatrix : null);
    if(!CSSMatrix){
        document.body.innerHTML = "<h2 style='width: 80%;padding: 50px 0;color: #fff; text-shadow: 1px 1px 2px #000; font-size: 28px;margin: 0 auto;'>Your browser not supported. User another one, Please!";
        return false;
    }

    this.mousedownHandler = function(e) {
        _self.mouseDown(e)
    };
    this.mousemoveHandler = function(e) {
        _self.mouseMove(e)
    };
    this.mouseupHandler = function(e) {
        _self.mouseUp(e)
    };
    this.mouseoutHandler = function(e) {
        _self.mouseOut(e)
    };
    this.touchstartHandler = function(e) {
        _self.touchStart(e)
    };
    this.touchmoveHandler = function(e) {
        _self.touchMove(e)
    };
    this.touchendHandler = function(e) {
        _self.touchEnd(e)
    };
    this.container.addEventListener('mousedown', this.mousedownHandler, false);
    this.container.addEventListener('mousemove', this.mousemoveHandler, false);
    this.container.addEventListener('mouseup', this.mouseupHandler, false);
    this.container.addEventListener('mouseout', this.mouseoutHandler, false);
    this.container.addEventListener('touchstart', this.touchstartHandler, false);
    this.container.addEventListener('touchmove', this.touchmoveHandler, false);
    this.container.addEventListener('touchend', this.touchendHandler, false);
};

scope.prototype.mouseDown = function(event) {
    this.interactionStart(event.clientX, event.clientY);
    event.preventDefault();
};
scope.prototype.mouseMove = function(event) {
    this.interactionMove(event.clientX, event.clientY);
    event.preventDefault();
};
scope.prototype.mouseUp = function(event) {
    this.interactionEnd(event.clientX, event.clientY);
    event.preventDefault();
};
scope.prototype.mouseOut = function(event) {};
scope.prototype.touchStart = function(event) {
    event.preventDefault();
    this.interactionStart(-event.touches[0].clientX, -event.touches[0].clientY);
};
scope.prototype.touchMove = function(event) {
    event.preventDefault();
    this.interactionMove(-event.touches[0].clientX, -event.touches[0].clientY);
};
scope.prototype.touchEnd = function(event) {
    event.preventDefault();
    this.interactionEnd(0, 0);
};
scope.prototype.interactionStart = function(x, y) {
    this.startX = x;
    this.startY = y;
    this.tracking = true;
    this.elementX.style.webkitAnimationName = 'none';
    this.elementY.style.webkitAnimationName = 'none';
    this.elementX.style.mozAnimationName = 'none';
    this.elementY.style.mozAnimationName = 'none';
    var curXTransform = window.getComputedStyle(this.elementX)[transform];
    var matrix = curXTransform == 'none' ? new CSSMatrix() : new CSSMatrix(curXTransform);
    var angleX = Math.atan2(matrix.m13, matrix.m11);
    if (matrix.m11 < 0) 
        angleX += Math.PI;
    this.staticRotationX -= angleX;
    var curYTransform = window.getComputedStyle(this.elementY)[transform];
    var matrix = curYTransform == 'none' ? new CSSMatrix() : new CSSMatrix(curYTransform);
    var angleY = Math.atan2(matrix.m23, matrix.m22);
    if (matrix.m22 < 0) angleY += Math.PI;
    this.staticRotationY += angleY;
    this.startRotationX = this.staticRotationX;
    this.startRotationY = this.staticRotationY;
    this.setRotation(this.staticRotationX, this.staticRotationY);
    matrix = null;
};
scope.prototype.interactionMove = function(x, y) {
    var deltaX = x - this.startX;
    var deltaY = y - this.startY;
    if (this.tracking) {
        var xDisplacement = Math.atan(deltaX / kRingRadius);
        var yDisplacement = Math.atan(-deltaY / kRingRadius);
        //cos 90deg ＝ 0
        var angleXDelta = yDisplacement * Math.cos(this.staticRotationX);
        var angleYDelta = xDisplacement * Math.cos(this.staticRotationX);
        this.staticRotationX = this.startRotationX + angleXDelta;
        this.staticRotationY = this.startRotationY + angleYDelta;
        this.setRotation(this.staticRotationX, this.staticRotationY);
    }
};
scope.prototype.interactionEnd = function(x, y){
    if (this.tracking) {
        this.setRotation(this.staticRotationX, this.staticRotationY);
        this.tracking = false;
    }
};
scope.prototype.setRotation = function(angleX, angleY) {
    this.rotorX.style[transform] = 'rotateX(' + angleX + 'rad)';
    this.rotorY.style[transform] = 'rotateY(' + angleY + 'rad)';
};

window.onload = function(){
	VirtualTour.init({
        wide: '840',
        high: '840',
        imgs: ["./images/pano_f.jpg","./images/pano_r.jpg","./images/pano_b.jpg","./images/pano_l.jpg","./images/pano_u.jpg","./images/pano_d.jpg"]
    });
}