import GameObject from "../engine/GameObject";
import { Keys, ObjTags, Spritesheets } from '../const';
import { MovableObj } from "../types/types"

export default class Pod extends GameObject {
	private landTime: number = 1000;
	private openTime: number = 2000; // ms
	private lifeTime: number = 0;
	private opened: boolean = false;
	private actived: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Spritesheets.Pod_Landing["name"], ObjTags.Pod);

        this.body.immovable = true;

        this.anims.create({
            key: "spawn",
            frames: this.anims.generateFrameNumbers(Spritesheets.Pod_Landing["name"], { start: 0, end: Spritesheets.Pod_Landing["framesNum"] - 1 }),
            frameRate: Spritesheets.Pod_Landing["frameRate"],
            repeat: 1,
        });

		this.anims.create({
			key: "open",
			frames: this.anims.generateFrameNumbers(Spritesheets.Pod_Opening["name"], { start: 0, end: Spritesheets.Pod_Opening["framesNum"] - 1 }),
			frameRate: Spritesheets.Pod_Opening["frameRate"],
			repeat: 1,
		});

    }

    create() {
    }

    update(deltaTime: number) {
		if(!this.enable)
			return;
		this.lifeTime += deltaTime;
		if(this.lifeTime >= this.landTime && !this.opened) {
			this.play("open");
			this.opened = true;
			this.setVelocity(0, 0);
		}
		else if(this.lifeTime >= this.landTime + this.openTime)
			this.setEnable(false);
    }

    // active the pod, spawn warrior and destroy
    onActive(x: number, y: number) {
		this.setEnable(true);
		this.actived = true;
		this.lifeTime = 0;
		this.opened = false;
		this.play("spawn");
		this.x = x;
		this.y = -100;
		console.log("target pos", x, y);
		this.setVelocity(0, (y + 100) / 1.0);
    }

	isEnable()
	{
		return this.enable && !this.actived;
	}
}
