//获取Canvas画布和上正文对象
const canvas = document.getElementById('canvas');
const [width, height] = [window.innerWidth, window.innerHeight];
canvas.width = 800 || width;
canvas.height = 600 || height;
const ctx = canvas.getContext('2d');
//声明必备数据
const seriesLabel = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const seriesData = [126, 53, 72, 32, 96, 72, 32,];
const pos = { x: 50, y: 0 };
const [outWidth, outHeight] = [750, 600];
const pad = 50, colPerPad = 0.1, markLen = 10, labelOffset = 8;
const itemColor = 'blue';
let rowNum = 5;
//构建计算基本数据 
const innerWidth = outWidth - pad * 2, innerHeight = outHeight - pad * 2;
const innerTop = pos.y + pad, innerBottom = innerTop + innerHeight;
const innerLeft = pos.x + pad, innerRight = innerLeft + innerWidth;
const xMarkEndY = innerBottom + markLen, xLabelY = innerBottom + labelOffset;
const yMarkEndX = innerLeft - markLen, yLabelX = yMarkEndX - labelOffset;
//计算y轴向的数据
const maxDataY = Math.max(...seriesData);
const rowLabelSize = getRowSize(maxDataY, rowNum);
const maxLabelY = rowLabelSize * rowNum; 
const rowSize = innerHeight / rowNum;
const yLabelsVal = [];
const yMarksY = [];
for (let r = 0; r < rowNum + 1; r++) {
    yLabelsVal.push(maxLabelY - rowLabelSize * r);
    yMarksY.push(innerTop + rowSize * r);
};
//计算行高
function getRowSize(maxDataY, rowNum) {
    const size = Math.ceil(maxDataY / rowNum);
    const len = size.toString().length;
    const index = Math.floor(len / 2);
    const power = Math.pow(10, index);
    const flNum = size / power;
    const intNum = Math.ceil(flNum);
    const c = intNum * power;
    return Math.max(c, 1);
};
//系列图形的数据
const colNum = seriesLabel.length;
const colSize = innerWidth / colNum;
const colPad = colSize * colPerPad;
const itemWidth = colSize - colPad * 2;
const xMarksX = [], xBablesX = [], itemsX = [], itemsHeight = [], itemsY = [];
seriesLabel.forEach((ele, ind) => {
    const basicX = innerLeft + colSize * ind;
    xMarksX.push(basicX + colSize);
    xBablesX.push(basicX + colSize / 2);
    itemsX.push(basicX + colPad);
    const ratio = seriesData[ind] / maxLabelY, 
    itemH = innerHeight * ratio;
    itemsHeight.push(itemH);
    itemsY.push(innerBottom - itemH);
});


//绘制柱体类
class Rect {
    constructor(width = 0, height = 0, color = '#000') {
        this.width = width; this.height = height;
        this.color = color; this.x = 0; this.y = 0;
        this.text = ''; this.data = 0;
    };
    draw(ctx) {
        ctx.save();
        const { x, y, width, height, color } = this;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height); ctx.restore();
    };
    //刻度绘制方法
    static drawLine(ctx, x1, y1, x2, y2, color = 'purple') {
        ctx.save(); ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.lineCap = 'square';
        ctx.strokeStyle = color;
        ctx.stroke(); ctx.restore();
    };
    //文字绘制方法
    static drawText(ctx, text, x, y, textAlign, textBaseline) {
        ctx.save();
        ctx.font = '14px Arial';
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillText(text, x, y);  ctx.restore();
    };
    //坐标绘制方法
    static drawCoord(ctx) {
        //绘制y轴图形 
        this.drawLine(ctx, innerLeft, innerTop, innerLeft, innerBottom);
        yLabelsVal.forEach((ele, ind) => {
            this.drawLine(ctx, innerLeft, yMarksY[ind], yMarkEndX, yMarksY[ind]);
            this.drawText(ctx, ele, yLabelX, yMarksY[ind], 'right', 'middle');
            if (ind !== rowNum) {
                this.drawLine(ctx, innerLeft, yMarksY[ind], innerRight, yMarksY[ind],
                'rgba(0,0,0,0.3)');
            }
        });
        //绘制x轴图形
        this.drawLine(ctx, innerLeft, innerBottom, innerRight, innerBottom);
        seriesLabel.forEach((ele, ind) => {
            this.drawLine(ctx, xMarksX[ind], innerBottom, xMarksX[ind], xMarkEndY);
            this.drawText(ctx, ele, xBablesX[ind], xLabelY, 'center', 'top');
        });
    };
};
//绘制柱体，实例化矩形对象，并将其添加到柱体集合
const series = [];
seriesLabel.forEach((ele, ind) => {
    const item = new Rect(itemWidth, itemsHeight[ind], itemColor);
    item.x = itemsX[ind];
    item.y = itemsY[ind];
    item.text = ele;
    item.data = seriesData[ind];
    series.push(item);
});
//渲染方法
(function render() {
    ctx.clearRect(0, 0, width, height);
    //绘制坐标系
    Rect.drawCoord(ctx);
    //绘制系列图像
    series.forEach((ele) => {
        ele.draw(ctx);
    });
})();