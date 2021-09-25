import GameObject from "../engine/GameObject";
import { Spritesheets, ObjTags } from "../const";
import Logger from "../utilities/logger";

export default class Egg extends GameObject {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Spritesheets.Egg["name"], ObjTags.Grave);

        let spriteConfig = Spritesheets.Egg;
        this.anims.create({
            key: "egg_idle",
            frames: this.anims.generateFrameNumbers(spriteConfig["name"], { start: 0, end: spriteConfig["framesNum"] - 1 }),
            frameRate: spriteConfig["frameRate"],
            repeat: -1,
        });
		this.setOrigin(0,0);
		this.setScale(0.5, 0.5);
        this.body.immovable = true;
        this.play("egg_idle");
    }

    create() {

    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    setEnable(value: boolean) {
        super.setEnable(value);
        // if (value)
            // this.play("egg_idle");
    }
}
