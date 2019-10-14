function Mine(tr,td,mineNum){
    this.tr = tr;
    this.td = td;
    this.mineNum = mineNum;

    this.squares = [];
    this.tds = [];
    this.surplusMine = mineNum;
    this.allRight = false;

    this.parsent=document.querySelector(".gameBox");

}

Mine.prototype.randomNum = function(){
    var square = new Array(this.tr*this.td);
    for(var i=0;i<square.length ; i++){
        square[i] = i;
    }
    square.sort(function(){
        return 0.5-Math.random()
    });
    return square.slice(0,this.mineNum);
}

Mine.prototype.init = function (){
    var rn = this.randomNum();
    var n=0;
    for(var i=0 ; i<this.tr;i++){
        this.squares[i] = [];
        for(var j=0;j<this.td;j++){
            // this.square[i][j]=;
            // n++;
            if(rn.indexOf(++n) != -1){
                this.squares[i][j] = {type: 'mine',x:j,y:i};
            }else{
                this.squares[i][j]={type:'number',x:j,y:i,value:0};
            }
        }
    }

   
    this.updateNum();
    this.createDom();
    this.parsent.oncontextmenu=function(){
        return false;
    }

    this.mineNumDom = document.querySelector('.mineNum');
    this.mineNumDom.innerHTML = this.surplusMine;
};

Mine.prototype.createDom = function(){
    var This = this;
    var table = document.createElement("table");

    for(var i=0 ; i<this.tr;i++){
        var domTr = document.createElement("tr");
        this.tds[i]=[];

        for(var j=0 ; j<this.td;j++){
            var domTd = document.createElement("td");
            // domTd.innerHTML=0

            domTd.pos = [i,j];
            domTd.onmousedown=function(){
                This.play(event,this);

            };
            this.tds[i][j] = domTd;
            
            // if(this.squares[i][j].type == 'mine'){
            //     domTd.className = "mine"; 
            // }
            // if(this.squares[i][j].type == 'number'){
            //     domTd.innerHTML = this.squares[i][j].value;
            // }
            // domTd.oncontextmenu = function(){
            //     return false;
            // }
            domTr.appendChild(domTd);
        }
        table.appendChild(domTr);
    }
    this.parsent.innerHTML='';
    this.parsent.appendChild(table);
};

Mine.prototype.getAround = function(square){
    var x=square.x;
    var y=square.y;
    var result = [];
    for(var i=x-1;i<=x+1;i++){
        for(var j=y-1;j<=y+1;j++){
            if(i<0 || j<0 || i>this.td-1 || j>this.tr-1 || (i==x&&j==y)||this.squares[j][i].type == 'mine'){
                continue;
            }
            result.push([j,i]);
        }
    }
    return result;
};

Mine.prototype.updateNum =function(){
    for(var i=0;i<this.tr;i++){
        for(var j=0;j<this.td;j++){
            if(this.squares[i][j].type == "number"){
                continue;
            }
            var num=this.getAround(this.squares[i][j]);
            // console.log(num);
            for(var k=0;k<num.length;k++){
                // num[i] == [0,1]
                // num[i][0] ==0
                // num[i][1] == 1
            
                this.squares[num[k][0]][num[k][1]].value+=1;
            }
        }
    }
}

Mine.prototype.play = function(ev,obj){
    var This=this;
    if(ev.which == 1 && obj.className!='flag'){

        var curSquare = this.squares[obj.pos[0]][obj.pos[1]];
        var cl=['zero','one','two','three','four','five','six','seven','eigth']
        if(curSquare.type == 'number'){
            obj.innerHTML=curSquare.value;
            obj.className = cl[curSquare.value];

            if(curSquare.value == 0){
                obj.innerHTML = '';

                function getAllZero(square){
                    var around = This.getAround(square);
                    for(var i=0;i<around.length;i++){
                        var x=around[i][0];
                        var y=around[i][1]; 
                        This.tds[x][y].className=cl[This.squares[x][y].value];

                        if(This.squares[x][y].value == 0){
                            if(!This.tds[x][y].check){
                                This.tds[x][y].check =true;
                                getAllZero(This.squares[x][y]);
                            }
                        }else{
                            This.tds[x][y].innerHTML=This.squares[x][y].value;
                        }
                    }
                    
                }
                getAllZero(curSquare);
            }
        }else{
            // console.log("点到雷！")
            this.gameOver(obj);
        }
    }


    if(ev.which == 3){
        if(obj.className && obj.className !='flag'){
            return;
        }

        obj.className=obj.className == 'flag'?'':'flag';

        if(this.squares[obj.pos[0]][obj.pos[1]].type == 'mine'){
            this.allRight =true;
        }else{
            this.allRight=false;
        }
        if(obj.className == 'flag'){
            this.mineNumDom.innerHTML = --this.surplusMine;
        }else{
            this.mineNumDom.innerHTML = ++this.surplusMine;
        }
        if(this.surplusMine ==0){
            if(this.allRight){
                alert("游戏通过");
            }else{
                alert("游戏失败");
                this.gameOver();
            }

        }

    }
}

Mine.prototype.gameOver = function (clickTd){
    for(var i=0;i<this.tr;i++){
        for(var j=0;j<this.td;j++){
            if(this.squares[i][j].type=='mine'){
                this.tds[i][j].className = 'mine';
            }
            this.tds[i][j].onmousedown =null;
        }
    }
    if(clickTd){
        clickTd.style.backgroundColor='#f00';
    }
}


var btns=document.querySelectorAll('.level button');
var mine =null;
var ln=0;
var arr=[[9,9,10],[16,16,40],[28,28,99]];
for(let i=0;i<btns.length-1;i++){
    btns[i].onclick=function(){
        btns[ln].className='';
        this.className="active";
        mine=new Mine(...arr[i]);
        mine.init();
        ln=i;
    }
}
btns[0].onclick();
btns[3].onclick=function(){
    mine.init();
}
// var mine = new Mine(28,28,99);
// mine.init();
