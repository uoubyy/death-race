import GameObject from "../engine/GameObject";
import { Images, Spritesheets, ObjTags } from "../const";

export default class Grave extends GameObject {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Spritesheets.GraveSpawn["name"], ObjTags.Grave);

        let spriteConfig = Spritesheets.GraveSpawn;
        this.anims.create({
            key: "grave_spawn",
            frames: this.anims.generateFrameNumbers(spriteConfig["name"], { start: 0, end: spriteConfig["framesNum"] - 1 }),
            frameRate: spriteConfig["frameRate"],
            repeat: 0,
        });

        this.body.immovable = true;
        this.play("grave_spawn");
    }

    create() {

    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    setEnable(value: boolean) {
        super.setEnable(value);
        if (value)
            this.play("grave_spawn");
    }
}
