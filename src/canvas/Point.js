export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(x) {
        this._x = x;
    }

    set y(y) {
        this._y = y;
    }

    equals(p) {
        return (this.x == p.x) && (this.y == p.y);
    }

    toString() {
        return `(${this.x}, ${this.y})`
    }

    static add(p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }

    static subtract(p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }

    static divide(p, n) {
        return new Point(p.x / n, p.y / n);
    }

    static mod(p) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }

    static midPoint(p1, p2) {
        return Point.divide((Point.add(p1,p2)), 2);
    }
}
