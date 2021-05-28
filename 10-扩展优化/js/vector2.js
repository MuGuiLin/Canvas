/**
 * 二维向量相关方法
 * */
export default class Vector2 {
    // 坐标极 dir：方向, len 长度
    static polar(dir, len) {
        return new Vector2(
            Math.cos(dir) * len,
            Math.sin(dir) * len
        );
    };

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    };

    // 加法 v:向量
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    // 减法
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    // 获取角度
    angle() {
        const { x, y } = this;
        let dir = Math.atan2(y, x);
        if (0 > dir) {
            dir += Math.PI * 2;
        };
        return dir;
        /**
         * Math.atan2()
         * 圆角度
         *      360度 = Math.PI * 2;（如同钟表转一圈）
         *      180度 = Math.PI     || Math.PI * 2 / 2 ;
         *       90度 = Math.PI / 2 || Math.PI * 2 / 4;
         *       45度 = Math.PI / 4 || Math.PI * 2 / 8;
         *  
         *      圆的4分之3 = Math.PI * 3 / 4;
         */
    };

    // 旋转弧度 
    rotate(a) {
        const { x, y } = this;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    };

    // 获取长度
    length() {
        const { x, y } = this;
        // 勾股定理
        return Math.sqrt(x * x + y * y);
    };

    // 设置长度
    setLength(len) {
        const { x, y } = this;
        const r = this.length();
        const cos = x / r;
        const sin = y / r;
        this.x = cos * len;
        this.y = sin * len;
        return this;
    };

    // 克隆
    clone() {
        return new Vector2(this.x, this.y);
    };

    // 复制
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
};