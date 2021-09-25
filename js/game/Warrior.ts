import { ObjTags, Spritesheets } from "../const";
import MovableObject from "../engine/MovableObject";
import SpawnManager from "./SpawnManager";
import DI from "../utilities/DI";

export default class Warrior extends MovableObject {
	private walkDirection: [number, number] = [0, 0];
	private targetPos: [number, number] = [0, 0];
	private targetId: number = 0;
	private interval: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Spritesheets.Warrior_Move["name"], ObjTags.Warrior);
		this.setScale(0.8, 0.8);

		this.anims.create({
			key: "chase",
			frames: this.anims.generateFrameNumbers(Spritesheets.Warrior_Move["name"], { start: 0, end: Spritesheets.Warrior_Move["framesNum"] - 1 }),
			frameRate: Spritesheets.Warrior_Move["frameRate"],
			repeat: -1,
		});

		this.play("chase");
		this.speed = 8;
		this.setCollideWorldBounds(true);
    }

    create() {

    }

    setTarget(targetId: number) {
		console.log("Warrior start chase ", targetId);

		this.targetId = targetId;
		this.getTargetPos();
    }

	getTargetPos()
	{
		let spawnManager = DI.Get("SpawnManager") as SpawnManager;
		this.targetPos = spawnManager.onGetZombiePos(this.targetId);
        let offset = [this.targetPos[0] - this.x, this.targetPos[1] - this.y];
        this.walkDirection = [offset[0] > 0 ? 1 : (offset[0] < 0 ? -1 : 0), offset[1] > 0 ? 1 : (offset[1] < 0 ? -1 : 0)];
	}

    update(deltaTime: number) {
        if (this.enable == false)
            return;

		this.interval += deltaTime;
		if(this.interval >= 3000)
		{
			this.getTargetPos();
			this.interval = 0;
		}

		let offset = [this.targetPos[0] - this.x, this.targetPos[1] - this.y];
		if(Math.abs(offset[0]) > Math.abs(offset[1]))
			this.setVelocity(this.speed * deltaTime * this.walkDirection[0], 0);
		else
			this.setVelocity(0, this.speed * deltaTime * this.walkDirection[1]);
    }

	setEnable(value: boolean) {
		super.setEnable(value);
		if(value)
			this.play("chase");
		else
			this.anims.stop();
	}
}
