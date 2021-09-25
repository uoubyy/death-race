export default class Point {
	public readonly x: number;
	public readonly y: number;

	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}

	add(x:number, y:number): Point {
		return new Point(this.x+x, this.y+y);
	}

	mul(val: number): Point {
		return new Point(this.x * val, this.y * val);
	}

	mulP(p: Point): Point {
		return new Point(this.x*p.x, this.y*p.y);
	}
}
