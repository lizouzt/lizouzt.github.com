<html>
  <head>
    <style type="text/css">
      #part{
        background-color: rgb(220,220,220);
        border-top: 1px solid #999;
        border-bottom: 1px solid #999;
        height: 400px;
        margin: auto;
        padding: 0;
        position: relative;
        width: 400px;
      }
      li{
        height: 100px;
        list-style: none;
        position: absolute;
        width: 100px;
      }
    </style>
  </head>
  <body>
    <ul id="part"></ul>
    <script>
    var SupTouches = ("createTouch" in document),
      StartEvent = SupTouches ? "touchstart" : "mousedown",
      MoveEvent = SupTouches ? "touchmove" : "mousemove",
      EndEvent = SupTouches ? "touchend" : "mouseup";

    var drag = {
      size: 100,                                 //size of each cel
      el: document.getElementById('part'),      //the UL parent element 
      curEl: null,                              //target element which is been touched or pressed
      oEls: [],                                 //operate elements list
      seq: 0,                                   //num of targets col or row
      startPosList: [],                         //list of operate elements position records
      elBound: document.getElementById('part').getBoundingClientRect(), //bounding of the UL element
      _isBegin: false,                          //is touchstart event started on UL
      _isDroped: true,                         //PC mouseup hack
      type: '',                                 //type ofopeartion
      reset: function(){                        //status reset
        this.curEl = null;
        this._isBegin = false;
        this.startPosList = oEls = [];
        console.log('reset: ' + drag._isBegin);
      }
    };

    var construction = function(){
      var i = j = 4;
      var str = '', size = drag.size;
      for(var r = 0; r < i; r++){
        for(var c = 0; c < j; c++){
          var top = r * size, left = c * size, color = Math.floor((r + c) / 16 * 255);
          str += '<li data-row="' + r + '" data-col="' + c + '" style="background-color: rgb('+color+','+color+','+color+'); top: ' + top + '; left: ' + left + ';"></li>';
        }
      }

      drag.el.innerHTML = str;
    };
    construction();

    var tools = {
      getPoint: function(e){
        var p = {
          x: 0,
          y: 0
        };

        if(SupTouches){
          var touchp = e.touches.item(0);
          p.x = touchp.pageX;
          p.y = touchp.pageY;
        }else{
          p.x = e.clientX;
          p.y = e.clientY;
        }

        return p
      },
      /*
      *选取当前操作逻辑对应的所需元素
      *params {type, num}
      *type: 选取列还是行
      *num: 需要选取的列值或行值
      *
      *return {els}  选取的dom
      **/
      getOperateEls: function(type, num){
        var els = null;
        if(type == 'row')
          els = drag.el.querySelectorAll('li[data-row="' + num + '"]')
        else if(type == 'col')
          els = drag.el.querySelectorAll('li[data-col="' + num + '"]')
        return els;
      },
      /*
      *获取位置信息
      *params {els}  元素队列
      *return {list} 对应参数排序的元素位置队列
      **/
      getPos: function(els){
        var list = [];
        for(var i = 0, j = els.length; i < j; i++){
          var el = els[i],
          position = {
            left: el.style.left,
            top: el.style.top
          };
          list.push(position);
        }
        return list;
      },
      /*
      *判断当前操作元素角色，并收集需要变动的元素集合
      **/
      onstart: function(){
        if(!drag.curEl) 
          return false;

        var curEl = drag.curEl,
        els = null,
        type = '',
        seq = 0,
        row = curEl.dataset['row'],
        col = curEl.dataset['col'];

        if(col == '0' && row == '0'){
          drag.reset();
          return false;
        }

        //列操作
        if(row == '0'){
          type = 'col';
          els = tools.getOperateEls(type, parseInt(col));
        }
        //行操作
        else if(col == '0'){
          type = 'row';
          els = tools.getOperateEls(type, parseInt(row));
        }
        //单元格
        else{
          type = 'cel';
          seq = 
          els = [curEl];
        }

        if(!els || els.length == 0){
          drag.reset();
          return false;
        }

        drag.seq = seq;
        drag.oEls = els;
        drag.type = type;

        console.log('onstart: ');
        console.log(els);
        var list = tools.getPos(els);
        drag.startPosList = list;
        return true;
      },
      /*
      * 判断出界
      * param {np} {x, y}
      * return false or true  如果判断移出界返回false，否则返回新的增量
      **/
      onmove: function(np){
        console.log('onmove: ');
        var bound = drag.elBound,
        curelBound = drag.curEl.getBoundingClientRect();

        //left 增量
        var incLeft = np.x - drag.startPoint.x,
        //top 增量
        incTop = np.y - drag.startPoint.y;

        //新的boundingred
        curelBound.left += incLeft;
        curelBound.right -= incLeft;
        curelBound.top += incTop;
        curelBound.bottom -= incTop;

        //以UL元素为基础判断是否出界
        if (bound.top > curelBound.top || bound.left > curelBound.left || bound.bottom < curelBound.bottom || (bound.right - bound.width) > (curelBound.right - curelBound.width))
          return false

        drag.startPoint = np;

        return {
          left: incLeft,
          top: incLeft
        }
      },
      onend: function(){
        //获取当前操作拖动事件目标元素
        var oEls = drag.oEls, startPosList = drag.startPosList;
        console.log('onend: ');
        console.log(oEls);
        var hPos = tools.getPos(oEls);
        var tars = tools.getDropTar(hPos[0]);

        var reverseDataSet = function(a, b){
          var bset = b.dataset;
          b.dataset.col = a.dataset.col;
          b.dataset.row = a.dataset.row;

          a.dataset.col = bset.col;
          a.dataset.row = bset.row;
        },
        reverseStyle = function(a, b, sp){
          a.style.top = b.style.top;
          a.style.left = b.style.left;

          b.style.top = sp.top;
          b.style.left = sp.left;
        },
        recover = function(){
          for(var i = 0, j = oEls.length; i < j; i++){
            var o = oEls[i], sp = startPosList[i];
            o.style.top = sp.top;
            o.style.left = sp.left;
          }
        };

        if(!tars || tars.length == 0 || oEls.length != tars.length){
          recover();
          return false;
        }

        console.log('onend2222');
        console.log(tars);
        var endPosList = tools.getPos(tars);

        for(var i = 0, j = oEls.length; i < j; i++){
          var o = oEls[i], t = tars[i], sp = startPosList[i];
          reverseDataSet(o, t);
          reverseStyle(o, t, sp);
        }
        return true;
      },
      /*
      *判断返回当前drop替换目标
      *params {pos} 拖动事件的目标元素，列头、行头、或者cel
      *return {els or false} 返回置换目标元素队列，拖动超出范围则返回false
      **/
      getDropTar: function(pos){
        var type = drag.type, size = drag.size, col = row = 0;
        var w = -1 * size, h = 4 * size, els = [];

        pos.top = pos.top.slice(0,-2);
        pos.left = pos.left.slice(0,-2);

        var getNum = function(val){
          return Math.floor(Math.abs(val) / size)
        };

        //超出边界，结束操作
        if(pos.left < w || pos.left > h || pos.top < w || pos.top > h)
          return false

        if(type == 'col'){
          //列头向下移动过多，结束操作
          if(pos.top > size)
            return false

          col = getNum(pos.left);
          els = tools.getOperateEls(type, col);

        } else if(type == 'row'){
          //行头向右移动过多，结束操作
          if(pos.left > size)
            return false

          row = getNum(pos.top);
          els = tools.getOperateEls(type, row);

        } else if(type == 'cel') {
          row = getNum(pos.top);
          col = getNum(pos.left);

          var el = drag.el.querySelectorAll('li[data-col="' + col + '"][data-row="' + row + '"]');
          els = [el];
        }

        var seq = row + '-' + col;
        if(seq == drag.seq)
          return [];
        else
          return els;
      },
      /*
      *遍历移动该移动的元素
      * param {p} {incleft, inctop}
      **/
      elTranslate: function(p){
        var els = drag.oEls;
        
        if(p.left == 0 && p.top ==0)
          return

        for(var i = 0, j = els.length; i < j; i++){
          var el = els[i], top = left = null;

          if(drag.type == 'col')
            left = parseInt(el.style.left.slice(0,-2));
          else if(drag.type == 'row')
            top = parseInt(el.style.top.slice(0,-2));
          else{
            left = parseInt(el.style.left.slice(0,-2));
            top = parseInt(el.style.top.slice(0,-2));
          }

          left != null && (el.style.left = left + p.left + 'px');
          top != null && (el.style.top = top + p.top + 'px');
        }
      }
    };

    drag.el['on' + StartEvent] = function(e){
      e.preventDefault();

      var tar = e.target;
      if(tar.tagName != 'LI')
        return false

      if(!!drag._isBegin){
        console.log('start: ' + drag._isBegin);

        return false
      }

      drag._isBegin = true;

      drag.startPoint = tools.getPoint(e);

      drag.curEl = tar;

      tools.onstart();
    };

    drag.el['on' + MoveEvent] = function(e){
      e.preventDefault();

      if(!drag._isBegin)
        return false

      drag._isDroped = false;

      var nowPoint = tools.getPoint(e);
      var dragable = tools.onmove(nowPoint);
      !!dragable && tools.elTranslate(dragable);
    };

    drag.el['on' + EndEvent] = function(){
      if(!drag._isBegin)
        return false

      var drop = function(){
        drag._isDroped = true;
        tools.onend();
        drag.reset();
      };

      if(!SupTouches){
        if(!drag._isDroped){
          setTimeout(arguments.callee, 100);
        }else{
          drop();
        }
      }

      drop();
    };
    </script>
  </body>
</html>
