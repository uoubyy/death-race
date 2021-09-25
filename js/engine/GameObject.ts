import Phaser from 'phaser'
import Pedestrian from '../game/Pedestrian';
import Texture = Phaser.Textures.Texture;

export default class GameObject extends Phaser.Physics.Arcade.Sprite {
    protected tag: number;
    protected enable: boolean = true;
    protected id: number;

    static IdBase: number = 0;
    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string | Texture, tag: number) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //@ts-ignore
        this.body.allowGravity = false;

        this.tag = tag;
        this.id = GameObject.IdBase++;
    }

    create() {

    }

    update(deltaTime: number) {
        if (this.enable == false)
            return;
    }

    getTag() {
        return this.tag;
    }

    getId() {
        return this.id;
    }

    setEnable(value: boolean) {
        this.enable = value;
        this.setVisible(value);
    }

    isEnable() {
        return this.enable;
    }

    reSpawn(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.setEnable(true);
    }
}
