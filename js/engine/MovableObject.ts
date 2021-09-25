import DI from "../utilities/DI";
import GameObject from "./GameObject";
import InputManager from "./InputManager";
import Texture = Phaser.Textures.Texture;

export default class MovableObject extends GameObject {
    protected inputManager: InputManager;

    protected angleSpeed: number = 0;
    protected speed: number = 0;

    // maybe all GameObject need this property
    protected objectDirection: [number, number] = [0, -1];

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string | Texture, tag: number) {
        super(scene, x, y, sprite, tag);
        this.inputManager = DI.Get("InputManager") as InputManager;
    }

    // set object info from config
    init() {

    }

    update(deltaTime: number) {

    }

    // we need to matain the collision status
    onColliderEnter(object1: GameObject, object2: GameObject) {

    }

    onColliderExit(object: GameObject) {

    }
}