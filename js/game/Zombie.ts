import MovableObject from "../engine/MovableObject";
import { Images, Keys, ObjTags, Spritesheets } from '../const';
import GameObject from "../engine/GameObject";
import EventManager from "../utilities/EventManager";
import DI from "../utilities/DI";
import {GameEvents, PedestrianConvertInfo, PedestrianKillInfo, PedestrianPositionInfo, ZombieKillInfo } from "../utilities/events";
import Pedestrian from "./Pedestrian";
import { MovableObj } from "../types/types"
import Warrior from "./Warrior";

const ZombieState = {
    Idle: 0,
    Wander: 1,
    Chase: 2
}

export default class Zombie extends MovableObject {
    private state: number = ZombieState.Idle;
    private stateDurationMax: Map = new Map();
    private stateDuration: number = 0;

    private chaseRadius: number = 10;
    private chaseTarget: PedestrianPositionInfo = {
        X: 0,
        Y: 0,
        ID: -1
    }

    private walkDirection: [number, number] = [0, 0];
    private halfStateDuration: number = 0;// random

    constructor(scene: Phaser.Scene, config: MovableObj) {
        super(scene, config.x, config.y, Spritesheets.ZombieIdle["name"], ObjTags.Zombie);
        this.setCollideWorldBounds(true);
		this.setScale(0.75, 0.75);
        let spriteConfig = Spritesheets.ZombieIdle;

        this.anims.create({
            key: "zombie_idle",
            frames: this.anims.generateFrameNumbers(spriteConfig["name"], { start: 0, end: spriteConfig["framesNum"] - 1 }),
            frameRate: spriteConfig["frameRate"],
            repeat: -1,
        });

        this.anims.create({
            key: "zombie_spawn",
            frames: this.anims.generateFrameNumbers(Spritesheets.Zombie_Spawn["name"], { start: 0, end: Spritesheets.Zombie_Spawn["framesNum"] - 1 }),
            frameRate: Spritesheets.Zombie_Spawn["frameRate"],
            repeat: 0,
        });

        this.stateDurationMax.set(ZombieState.Idle, 3000.0);
        this.stateDurationMax.set(ZombieState.Wander, 5000.0);
        this.stateDurationMax.set(ZombieState.Chase, 5000.0);

        this.speed = config["speed"];
    }

    create() {
        this.play("zombie_spawn");
        //this.onChangeState(ZombieState.Idle);
        let eventManager = DI.Get("EventManager") as EventManager;
        eventManager.addHandler(GameEvents.PedestrianPosUpdate, this.onPedestrianPositionUpdate = this.onPedestrianPositionUpdate.bind(this));
    }

    onChangeState(newState: number) {
        switch (newState) {
            case ZombieState.Idle:
                this.play("zombie_idle");
                break;
            case ZombieState.Wander:
                this.walkDirection = [Phaser.Math.Between(-1, 1), Phaser.Math.Between(-1, 1)];
                this.halfStateDuration = Phaser.Math.FloatBetween(0, 1) * this.stateDurationMax.get(ZombieState.Wander);
                break;
            case ZombieState.Chase:
                let offset = [this.chaseTarget["X"] - this.x, this.chaseTarget["Y"] - this.y];
                let xDir = offset[0] > 0 ? 1 : (offset[0] == 0 ? 0 : 1);
                let yDir = offset[1] > 0 ? 1 : (offset[1] == 0 ? 0 : 1);
                this.walkDirection = [xDir, yDir];
                break;
        }
        this.state = newState;
        this.stateDuration = 0.0;
    }

    onDirReverse() {
        this.walkDirection = [-this.walkDirection[0], -this.walkDirection[1]];
    }

    update(deltaTime: number) {
        if (this.enable == false)
            return;
        super.update(deltaTime);
        // console.log("Zombie update " + this.getId() + ' ' + this.state + ' ' + this.isEnable());

        this.stateDuration += deltaTime;
        if (this.stateDuration >= this.stateDurationMax.get(this.state)) {
            let radio: number = Phaser.Math.FloatBetween(0, 1);
            this.onChangeState(radio <= 0.3 ? ZombieState.Idle : ZombieState.Wander);
        }

        if (this.state == ZombieState.Chase) {
            let offset = [this.chaseTarget["X"] - this.x, this.chaseTarget["Y"] - this.y];
            if (offset[0] > offset[1])
                this.setVelocity(this.walkDirection[0] * deltaTime * this.speed, 0);
            else
                this.setVelocity(0, this.walkDirection[1] * deltaTime * this.speed);
        } else if (this.state == ZombieState.Wander) {
            if (this.stateDuration <= this.halfStateDuration)
                this.setVelocity(this.walkDirection[0] * deltaTime * this.speed, 0);
            else
                this.setVelocity(0, this.walkDirection[1] * deltaTime * this.speed);
        }
    }

    setEnable(value: boolean) {
        super.setEnable(value);
    }

    static onColliderEnter(object1: GameObject, object2: GameObject) {
        if (object1.isEnable() && object2.isEnable()) {

            if (object1.getTag() == ObjTags.Zombie && object2.getTag() == ObjTags.Zombie) {
                let zombie1 = object1 as Zombie;
                zombie1.onDirReverse();
                let zombie2 = object2 as Zombie;
                zombie2.onDirReverse();
            } else if (object1.getTag() == ObjTags.Zombie && object2.getTag() == ObjTags.Pedestrian) {
                console.log("Zombie collider pedestrian ", object1.getId(), object2.getId());
                let pedestrian = object2 as Pedestrian;
				pedestrian.onKilled();
            } else if (object1.getTag() == ObjTags.Zombie && object2.getTag() == ObjTags.Warrior) {
                console.log("Zombie collider warrior ", object1.getId(), object2.getId());
                let eventManager = DI.Get("EventManager") as EventManager;

                eventManager.sendEvent(GameEvents.KilledZombie, { ZombieId: object1.getId() } as ZombieKillInfo);
                eventManager.sendEvent(GameEvents.KilledWarrior, { ZombieId: object1.getId() } as ZombieKillInfo);
                let warrior = object2 as Warrior;
                warrior.setEnable(false);
            }
        }

    }

    onPedestrianPositionUpdate(info: PedestrianPositionInfo) {
        if (this.state != ZombieState.Chase && info["X"] * info["X"] + info["Y"] * info["Y"] <= this.chaseRadius * this.chaseRadius) {
            this.chaseTarget = info;
            this.onChangeState(ZombieState.Chase);
        }
    }
}
