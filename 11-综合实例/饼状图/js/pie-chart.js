//获取Canvas画布和上正文对象
const canvas = document.querySelector('#canvas'); 
const [width, height] = [window.innerWidth, window.innerHeight];    
canvas.width = 800 || width;
canvas.height = 600 || height;
const ctx = canvas.getContext('2d');  
//声明必备数据
const seriesLabel = ['文具盒', '2B铅笔', '图画本', '橡皮擦', '量角器']; 
const seriesData = [116, 88,53, 62,  25];   
const pos = { x: canvas.width / 2, y: canvas.height / 2 };  
const radius = 200; 
const colorSpace = ['cyan', 'green',  'orange','blue', 'red',]; 
//构建计算基本数据 
const labelSum = eval(seriesData.join('+'));   
const seriesAngle = []; 
const seriesColor = []; 
const seriesRadius = []; 
seriesData.forEach((ele, ind) => {
    const dataScalar = ele / labelSum;  
    const angleLen = dataScalar * Math.PI * 2; 
    let startAngle = ind === 0 ? 0 : seriesAngle[ind - 1][1]; 
    const endAngle = startAngle + angleLen; 
    seriesAngle.push([startAngle, endAngle]);
    const color = colorSpace[ind];
    seriesColor.push(color); 
    const itemRadius = radius - ind * 10; 
    seriesRadius.push(itemRadius);
});
//根据数据绘制扇形类
class Sector {
    constructor(radius, start, end, color = 'chocolate') {
        this.radius = 0;  this.realRad = radius;
        this.expandRad = radius + 20;  this.startAngle = start;
        this.endAngle = end; this.color = color;
        this.x = 0;  this.text = ''; this.data = 0; this.textAlign = 'left'; 
        this.p1 = { x: 0, y: 0 }; this.p2 = { x: 0, y: 0 };
        this.p3 = { x: 0, y: 0 }; this.p4 = { x: 0, y: 0 };
        this.vr = 0;  this.ar = 0.03;
        this.bounce = 0.6; this.state = 0;
    }
    //更新引导线点位，基于圆形位置、半径、起始弧度，结束弧度
    updatePoints() {
        const { realRad, startAngle, endAngle, x, y, p1, p2, p3, p4 } = this;
        const dir = startAngle + (endAngle - startAngle) / 2;
        const p1Len = realRad + 22;
        p1.x = Math.cos(dir) * p1Len + x; p1.y = Math.sin(dir) * p1Len + y;
        let d = 1; const p2Len = realRad + 70;
        p2.x = Math.cos(dir) * p2Len + x; p2.y = Math.sin(dir) * p2Len + y;
        if (Math.cos(dir) < 0) {
            d = -1; this.textAlign = 'right';
        }
        p3.x = p2.x + 20 * d; p3.y = p2.y;
        p4.x = p3.x + 10 * d; p4.y = p2.y;
    };           
    //半径扩展动画expand(时间差，结束状态)
    expand(diff, endR) {
        const { ar, bounce } = this; 
        this.vr += ar;  
        this.radius += this.vr * diff; 
        if (this.radius > endR) { 
            this.radius = endR; this.vr *= -bounce; 
        }
    }; 
    //基于state 状态更新半径 0初始状态, 1鼠标划上, 2鼠标划出
    updateRad(diff) {
        const { state, realRad, expandRad } = this;
        switch (state) {
            case 0: this.expand(diff, realRad); break;
            case 1: this.expand(diff, expandRad); break;
            case 2: this.shrink(diff, realRad); break;
        }
    };
   //半径收缩动画shrink(时间差，结束状态)
    shrink(diff, endR) {
        const { ar, bounce } = this;
        this.vr -= ar; this.radius += this.vr * diff; 
        if (this.radius < endR) { 
            this.radius = endR;  this.vr *= -bounce; 
        }
    };
    //绘图方法，会制扇形、引导线、标签文字
    draw(ctx) {
        const { x, y, radius, startAngle, endAngle, color, 
        p1, p2, p3, p4, text, textAlign } = this;
        ctx.save(); 
        ctx.beginPath(); 
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, endAngle);    //绘制扇形
        ctx.fillStyle = color; 
        ctx.fill();
        ctx.beginPath(); 
        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y); 
        ctx.lineTo(p2.x, p2.y);     //绘制引导线
        ctx.lineTo(p3.x, p3.y);
        ctx.strokeStyle = color || 'white';
        ctx.stroke();  
        ctx.fillStyle = color || 'yellow'; 
        ctx.textBaseline = 'middle';
        ctx.textAlign = textAlign;  
        ctx.font = 'bold 18px  Arial';
        ctx.fillText(text, p4.x, p4.y);  //绘制标签文字
        ctx.restore();
    };
}
//实例化扇形将扇形，并添加到系列集合中
const series = [];
seriesAngle.forEach((ele, ind) => {
    const item = new Sector(seriesRadius[ind], ele[0], ele[1], seriesColor[ind]);
    item.x = pos.x; item.y = pos.y;
    item.text = seriesLabel[ind] +'：' + seriesData[ind];
    item.data = seriesData[ind];
    item.updatePoints();
    series.push(item);
});
//饼图渲染
let time = new Date();
(function render() {
    const now = new Date();
    const diff = now - time;
    time = now;
    ctx.clearRect(0, 0, width, height);
    series.forEach((item) => {
        item.updateRad(diff);
        item.draw(ctx);
    });
    requestAnimationFrame(render);
})();

