var me = true, //判断是黑棋 还是白棋
	over = false,
	count = 0,
	canva = document.getElementById("canvas"),
	context = canva.getContext('2d');
	var board = []; /*落子情况*/  var wins =[]; /*电脑的赢法*/ var mywin = []; /*我的赢法统计*/ var pcwin = [];/*电脑赢法统计*/


//存储黑白棋是否落子情况的数组
for(var i = 0; i < 15; i++){
	board[i] = []; //将维数组改为二维数组
	for(var j = 0; j < 15; j++){
		board[i][j] = 0; //存储黑白棋是否落子情况
	}
}
//赢法数组初始化
for(var i = 0; i < 15; i++){
	wins[i] = [];
	for(var j = 0; j < 15; j++){
		wins[i][j] = [];
	}
}

//落子的5个横向连接 数赢法数组
for(var i = 0; i < 15; i++){
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[i][j + k][count] = true;
		}
		count++;
	}
}

//落子的5个纵向连接 数赢法数组
for(var i = 0; i < 15; i++){
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[j + k][i][count] = true;
		}
		count++;
	}
}

//落子的5个正斜线连接 数赢法数组
for(var i = 0; i < 11; i++){
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}

//落子的5个反斜线连接 数赢法数组
for(var i = 0; i < 11; i++){
	for(var j = 14; j > 3; j--){
		for(var k = 0; k < 5; k++){
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}


for(var i = 0; i < count; i++){
	mywin[i] = 0;
	pcwin[i] = 0;
}

context.strokeStyle = 'black'; //线条颜色

//绘制背景图
var gamebg = new Image();
gamebg.src = 'images/gamebg.jpg';
gamebg.onload = function(){ //当背景图加载完成时
	context.drawImage(gamebg , 15 , 15 , 420 , 420); //绘制背景图
	DrawLinesFn();
}

//绘制棋盘线条
var DrawLinesFn = function(){
	for(var i = 0; i < 15; i++){
		/*
		 * 1、棋盘宽高分别为450px,450px;
		 * 2、padding值为了15px; 为上下左右留空白
		 */
		
		//绘制15条竖线
		context.moveTo(15 + i * 30 , 15);  //线条起点坐标
		context.lineTo(15 + i * 30 , 435); //线条终点坐标
		
		//绘制15条横线
		context.moveTo(15  , 15 + i * 30);
		context.lineTo(435 , 15 + i * 30);
	}
	context.stroke(); //绘制线条（描边）
}

//绘制棋子
var DrawPieceFn = function(i , j , me){
	context.beginPath(); //开始绘制路径
	context.arc(15 + i * 30 , 15 + j * 30 , 13 , 0 , (2 * Math.PI)); //（圆的中心点[横坐标，纵坐标]，大小[半径]，起始弧度， 终止弧度 ）
	context.closePath(); //关闭路径
	var getRadial = context.createRadialGradient(15 + i * 30 , 15 + j * 30 , 0 , 15 + i * 30 , 15 + j * 30 , 14); //渐变色（第一个圆[横坐标，纵坐标 ，渐变大小] ， 第一个圆[横坐标，纵坐标 ，渐变大小]）
	if(me){ //黑棋样式
		getRadial.addColorStop(0 , 'white'); //第一个圆
		getRadial.addColorStop(1 , 'black'); //第二个圆
	}else{ //白棋样式
		getRadial.addColorStop(0 , '#D1D1D1'); 
		getRadial.addColorStop(1 , '#F9F9F9'); 
	}
	
	context.fillStyle = getRadial; // 背景色样式(一个圆的渐变色对象)
	context.fill(); //填充背景色
}

//点击下棋
canva.onclick = function(event){
	if(over){
		return false;
	}
	if(!me){
		return false;
	}
	var event = event || window.event,
		x = event.offsetX,
		y = event.offsetY, 
		i = Math.floor(x / 30), //以canvas左上角为起点坐标event.offsetX位置 除以30[每个交叉点为中心 左右分为15，就是30啦] 然后再向下取整Math.floor();
		j = Math.floor(y / 30); 
	//如果当前被点击的交叉点已经有棋子了，就不能在放棋子的，所以只有在没有被放过棋的交叉点才能下棋子
	if(board[i][j] == 0 || board[i][j] == ''){
		DrawPieceFn(i , j, me);
		board[i][j] = 1; //如果是黑棋，就赋1，并保存在board[][]这个二维数组中
		for(var k = 0; k < count; k++){
			if(wins[i][j][k]){
				mywin[k]++;
				pcwin[k] = 6;
				if(mywin[k] == 5){
					over = true;
					alert('你太牛B啦，你赢啦！');
				}
			}
		}
		if(!over){	
			me = !me; //取反，如果是黑棋，就变为白棋；如果是白棋，就变为黑棋
			ComputerAiFn();
		}
	}
}

//电脑的下棋方法
var ComputerAiFn = function(){
	var myscore = []; //我的赢法统计
	var pcscore = []; //电脑的赢法统计
	var maxnums = save_x = save_y = 0; //棋子的链接总数 ，，
	for(var i = 0; i < 15; i++){
		myscore[i] = [];
		pcscore[i] = [];
		for(var j = 0; j < 15; j++){
			myscore[i][j] = 0;
			pcscore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 15; j++){
			if(board[i][j] == 0){
				for(var k = 0; k < count; k++){
					if(wins[i][j][k]){
						
						//我的赢法统计
						if(mywin[k] == 1){
							myscore[i][j] += 10;
						}
						else if(myscore[k] == 2){
							myscore[i][j] += 100;
						}
						else if(myscore[k] ==3){
							myscore[i][j] += 1000;
						}
						else if(myscore[k] == 4){
							myscore[i][j] += 10000;
						}
						
						//电脑的赢法统计
						if(pcscore[k] == 1){
							pcscore[i][j] += 10000;
						}
						else if(pcscore[k] == 2){
							pcscore[i][j] += 100000;
						}
						else if(pcscore[k] ==3){
							pcscore[i][j] += 1000000;
						}
						else if(pcscore[k] == 4){
							pcscore[i][j] += 10000000;
						}
					}
				}
				
				//我的赢法
				if(myscore[i][j] > maxnums){
					maxnums = myscore[i][j];
					save_x = i;
					save_y = j;
				}
				else if(myscore[i][j] == maxnums){
					if(pcscore[i][j] > pcscore[save_x][save_y]){
						save_x = i;
						save_y = j;
					}
				}
				
				//电脑的赢法
				if(pcscore[i][j] > maxnums){
					maxnums = pcscore[i][j];
					save_x = i;
					save_y = j;
				}
				else if(pcscore[i][j] == maxnums){
					if(myscore[i][j] > myscore[save_x][save_y]){
						save_x = i;
						save_y = j;
					}
				}
			}
		}
	}
	
	//电脑落子的地坐标
	DrawPieceFn(save_x , save_y, false);
	board[save_x][save_y] = 2;
	for(var k = 0; k < count; k++){
		if(wins[save_x][save_y][k]){
			pcwin[k]++;
			mywin[k] = 6;
			if(pcwin[k] == 5){
				over = true;
				alert('哈哈电脑赢啦！');
			}
		}
	}
	if(!over){	
		me = !me; //取反，如果是黑棋，就变为白棋；如果是白棋，就变为黑棋
	}
}

document.getElementById("reset").onclick = function(){
	window.location.reload();
}
