import Egg from "./Egg";

export { LevelConfig } from "../const"
import Texture = Phaser.Textures.Texture;
import DI from "../utilities/DI";
import Pedestrian from "../game/Pedestrian";
import Grave from "../game/Grave";
import Player from "../game/Player";
import GameObject from "../engine/GameObject";

import Zombie from "./Zombie";
import EventManager from "../utilities/EventManager";
import { GameEvents, GameObjectsInfo, PedestrianConvertInfo, PedestrianKillInfo, WarriorKillInfo, ZombieKillInfo } from "../utilities/events";
import Pod from "./Pod";
import {LevelConfig, MovableObj} from "../types/types";
import Warrior from "./Warrior";
import Logger from "../utilities/logger";
import {AudioTrack} from "../const";
import Phaser from "phaser";

export default class SpawnManager {
    private pedestrians: Pedestrian[] = [];
    private graves: Grave[] = [];
    private eggs: Egg[] = [];
    private zombies: Zombie[] = [];
    private player!: Player;
    private pods: Pod[] = [];
    private warriors: Warrior[] = [];

    private scene!: Phaser.Scene;

    private pedestrianGroup!: Phaser.GameObjects.Group;
    private gravesGroup!: Phaser.GameObjects.Group;
    private zombieGroup!: Phaser.GameObjects.Group;
    private warriorGroup!: Phaser.GameObjects.Group;
    private eventManager!: EventManager;

	private pedDeadAudio!: Phaser.Sound.BaseSound;
	private zombieDeadAudio!: Phaser.Sound.BaseSound;
	private pedInfectAudio!: Phaser.Sound.BaseSound;

    constructor() {

    }

    init(scene: Phaser.Scene, levelConfig: LevelConfig) {
        this.scene = scene;
        this.createFactories(scene);

		this.pedDeadAudio = scene.sound.add(AudioTrack.PedDead);
		this.zombieDeadAudio = scene.sound.add(AudioTrack.ZombieDead);
		this.pedInfectAudio = scene.sound.add(AudioTrack.PedInfect);

        this.eventManager = DI.Get("EventManager") as EventManager;

        this.eventManager.addHandler(GameEvents.KilledPedestrian, this.onPedestrianKilled = this.onPedestrianKilled.bind(this));
        this.eventManager.addHandler(GameEvents.KilledZombie, this.onZombieKilled = this.onZombieKilled.bind(this));
        this.eventManager.addHandler(GameEvents.OffGrave, this.onGraveOff = this.onGraveOff.bind(this));
        this.eventManager.addHandler(GameEvents.PedestrianConverted, this.onPedestrianConverted = this.onPedestrianConverted.bind(this));
        this.eventManager.addHandler(GameEvents.SummonWarrior, this.onWarriorSummoned = this.onWarriorSummoned.bind(this));
        this.eventManager.addHandler(GameEvents.KilledWarrior, this.onWarriorKilled = this.onWarriorKilled.bind(this));

        this.pedestrianGroup = scene.add.group();
        this.gravesGroup = scene.add.group();
        this.zombieGroup = scene.add.group();
        this.warriorGroup = scene.add.group();

        // need change into pass config as parameter
        let playerConfig = levelConfig.Player;
        this.player = scene.add.player(playerConfig);
        this.player?.create();

        let zombiesConfig = levelConfig.Zombies;
        this.zombies = [];
        for (let id in zombiesConfig) {
            let config = zombiesConfig[id];
            this.zombies.push(scene.add.zombie(config));
            this.zombieGroup.add(this.zombies[id]);
            this.zombies[id].create();
        }

        let graveConfig = levelConfig.Graves;
        this.graves = [];
        for (let id in graveConfig) {
            let config = graveConfig[id];
            this.graves.push(scene.add.grave(config.x, config.y));
            this.gravesGroup.add(this.graves[id]);
            this.graves[id].create();
        }

		let eggConf = levelConfig.Eggs;
		this.eggs = [];
		for (let id in eggConf) {
			let config = eggConf[id];
			this.eggs.push(scene.add.egg(config.x, config.y));
			this.gravesGroup.add(this.eggs[id]);
			this.eggs[id].create();
		}

        let pedestrianConfig = levelConfig.Pedestrians;
        this.pedestrians = [];
        for (let id in pedestrianConfig) {
            let config = pedestrianConfig[id];
            this.pedestrians.push(scene.add.pedestrian(config));
            this.pedestrianGroup.add(this.pedestrians[id]);
            this.pedestrians[id].create();
        }

        this.pods = [];

        // register collider with group
        scene.physics.add.collider(this.player, this.zombieGroup, this.player.onColliderEnter, null);
        scene.physics.add.overlap(this.player, this.pedestrianGroup, this.player.onColliderEnter, null);
        scene.physics.add.collider(this.player, this.gravesGroup, this.player.onColliderEnter, null);

        scene.physics.add.collider(this.zombieGroup, this.zombieGroup, Zombie.onColliderEnter, null);
        scene.physics.add.collider(this.zombieGroup, this.gravesGroup, Zombie.onColliderEnter, null);
        scene.physics.add.overlap(this.zombieGroup, this.pedestrianGroup, Zombie.onColliderEnter, null);
        scene.physics.add.overlap(this.zombieGroup, this.warriorGroup, Zombie.onColliderEnter, null);
    }

    update(deltaTime: number) {
        this.player.update(deltaTime);

        this.pedestrians.forEach(element => {
            let pedestrian = element as Pedestrian;
            pedestrian.update(deltaTime);
        });

        this.zombies.forEach(element => {
            let zombie = element as Zombie;
            zombie.update(deltaTime);
        });

		this.eggs.forEach(element => {
			let egg = element as Egg;
			egg.update(deltaTime);
		});

		this.warriors.forEach(element => {
			let warrior = element as Warrior;
			warrior.update(deltaTime);
		})

		this.pods.forEach(element => {
			let pod = element as Pod;
			pod.update(deltaTime);
		})
    }

    onPedestrianKilled(info?: PedestrianKillInfo) {
        if (info) {
			this.pedDeadAudio.play();

            let pId = info.PedestrianId;
            for (let i = 0; i < this.pedestrians.length; ++i) {
                let pedestrian = this.pedestrians[i] as Pedestrian;
                if (pedestrian.getId() == pId) {
                    pedestrian.setEnable(false);
                    this.pedestrianGroup?.remove(pedestrian);
                    break;
                }
            }

            let x = info.PositionX;
            let y = info.PositionY;
            for (let i = 0; i < this.graves.length; ++i) {
                let grave = this.graves[i] as Grave;
                if (grave.isEnable() == false) {
                    grave.reSpawn(x, y)
                    return;
                }
            }

            let grave = this.scene?.add.grave(x, y);
            this.graves.push(grave);
            this.gravesGroup?.add(grave);

            if (this.getPedestrianCount() == 0) {
                this.eventManager.sendEvent(GameEvents.LevelFinished, { ZombieCount: this.getZombieCount(), PedestrianCount: 0 } as GameObjectsInfo);
            }
        }
    }

    onZombieKilled(info?: ZombieKillInfo) {
        if (info) {
			this.zombieDeadAudio.play();

            let targetId = info.ZombieId;
            let remZombies = 0;
            this.zombies.forEach(element => {
                let zombie = element as Zombie;
                if (zombie.getId() == targetId) {
                    zombie.setEnable(false);
					this.zombieGroup.remove(zombie);
                } else if(zombie.isEnable()) {
					remZombies++;
				}
            });

			let x = info["PositionX"];
			let y = info["PositionY"];
			for (let i = 0; i < this.graves.length; ++i) {
				let grave = this.graves[i] as Grave;
				if (grave.isEnable() == false) {
					grave.reSpawn(x, y)
					return;
				}
			}

			let grave = this.scene?.add.grave(x, y);
			this.graves.push(grave);
			this.gravesGroup?.add(grave);

			if(remZombies == 0) {
				this.eventManager.sendEvent(GameEvents.LevelFinished, {ZombieCount: 0, PedestrianCount: this.getPedestrianCount()} as GameObjectsInfo);
			}
        }
    }

    onPedestrianConverted(info?: PedestrianConvertInfo) {
        if (info) {
			this.pedInfectAudio.play();

            let _x = info.PositionX;
            let _y = info.PositionY;

            let config = { x: _x, y: _y, speed: 15 };
            let zombie = this.scene.add.zombie(config);
            this.zombies.push(zombie);
            this.zombieGroup.add(zombie);
            zombie.create();

            if (this.getPedestrianCount() == 0) {
                this.eventManager.sendEvent(GameEvents.LevelFinished, { ZombieCount: this.getZombieCount(), PedestrianCount: 0 } as GameObjectsInfo);
            }
        }
    }

    onWarriorSummoned() {
		let eggIdle: boolean = false;
		let spawnPos: [number, number] = [0, 0];
        for (let i = 0; i < this.eggs.length; ++i) {
            let egg = this.eggs[i] as Egg;
			if(egg.isEnable())
			{
                console.log("egg set false");
				spawnPos = [egg.x, egg.y];
				egg.setEnable(false);
				eggIdle = true;
				break;
			}
        }

		if(!eggIdle)
			return;

		// Open Pod
        let podIdle: boolean = false;
        let targetId: number = 0;//[number, number] = [0, 0];

        this.pods.forEach(element => {
            let pod = element as Pod;
            if (pod.isEnable()) {
				podIdle = true;
				pod.setEnable(true);
				pod.onActive(spawnPos[0], spawnPos[1]);
                return;
            }
        });

		if(podIdle == false) {
			let newPod = this.scene.add.pod(this.scene, spawnPos[0], spawnPos[1]);
			this.pods.push(newPod);
			newPod.onActive(spawnPos[0], spawnPos[1]);
		}

        console.log("onWarriorSummoned spawnPos", spawnPos);

        let distance: number = -1;
        for (let i = 0; i < this.zombies.length; ++i) {
            if (this.zombies[i].isEnable() == true) {
                // no need to be very accurate
                let dis = Math.abs(this.zombies[i].x - spawnPos[0]) + Math.abs(this.zombies[i].y - spawnPos[1]);
                if (distance < 0 || dis < distance) {
                    targetId = this.zombies[i].getId();//[this.zombies[i].x, this.zombies[i].y];
                    distance = dis;
                }
            }
        }

        // no live zombie left
        if (distance <= 0)
            return;

		this.scene.time.delayedCall(3000, this.onWarriorSpawn, [spawnPos, targetId], this);
    }

	onWarriorSpawn(spawnPos: [number, number], targetId: number)
	{
		// Create Warrior
		for (let i = 0; i < this.warriors.length; ++i) {
			if (this.warriors[i].isEnable() == true) {
				this.warriors[i].reSpawn(spawnPos[0], spawnPos[1]);
				this.warriors[i].setTarget(targetId);
				this.warriorGroup.add(this.warriors[i]);
				return;
			}
		}

		let warrior = this.scene?.add.warrior(spawnPos[0], spawnPos[1]);
		warrior.setTarget(targetId);
		this.warriors.push(warrior);
		this.warriorGroup.add(warrior);
	}

    onWarriorKilled(info: WarriorKillInfo) {
        for (let i = 0; i < this.warriors.length; ++i) {
            if (this.warriors[i].getId() == info.WarriorId) {
                this.warriors[i].setEnable(false);
                this.warriorGroup.remove(this.warriors[i]);
                return;
            }
        }
    }

    private getPedestrianCount(): number {
        let count = 0;
        this.pedestrians.forEach(elem => {
            let e = elem as Pedestrian;
            if (e.isEnable()) {
                count++;
            }
        });
        return count;
    }

    private getZombieCount(): number {
        let count = 0;
        this.zombies.forEach(elem => {
            let e = elem as Zombie;
            if (e.isEnable()) {
                count++;
            }
        });
        return count;
    }

    onGraveOff(objectId?: number) {
        console.log("onGraveOff " + objectId);
    }

    onGetZombiePos(zombieID: number): [number, number]
    {
        for(let i = 0; i < this.zombies.length; ++i)
        {
            let zombie = this.zombies[i] as Zombie;

            if(zombie.getId() == zombieID)
            {
                return [zombie.x, zombie.y];
            }
        }
    }

    createFactories(scene: Phaser.Scene) {
        Phaser.GameObjects.GameObjectFactory.register(
            'gameObject', function (x: number, y: number, sprite: Texture, tag: number, movable = true) {
                return new GameObject(scene, x, y, sprite, tag);
            }
        )

        Phaser.GameObjects.GameObjectFactory.register('player',
            function (this: Phaser.GameObjects.GameObjectFactory, config: MovableObj) {
                return new Player(scene, config);
            });

        Phaser.GameObjects.GameObjectFactory.register('pedestrian',
            function (config: MovableObj) {
                return new Pedestrian(scene, config);
            });

        Phaser.GameObjects.GameObjectFactory.register('grave',
            function (x: number, y: number) {
                return new Grave(scene, x, y);
            });

		Phaser.GameObjects.GameObjectFactory.register('egg',
			function (x: number, y: number) {
				return new Egg(scene, x, y);
			});

        Phaser.GameObjects.GameObjectFactory.register('zombie',
            function (config: MovableObj) {
                const zombie = new Zombie(scene, config);
                return zombie;
            });

        Phaser.GameObjects.GameObjectFactory.register('pod', function (x: number, y: number) {
            const pod = new Pod(scene, x, y);
            return pod;
        });

        Phaser.GameObjects.GameObjectFactory.register('warrior', function (x: number, y: number) {
            const warrior = new Warrior(scene, x, y);
            return warrior;
        });
    }

	cleanup() {
		this.eventManager.removeHandlers(GameEvents.KilledPedestrian);
		this.eventManager.removeHandlers(GameEvents.KilledZombie);
		this.eventManager.removeHandlers(GameEvents.OffGrave);
		this.eventManager.removeHandlers(GameEvents.PedestrianConverted);
		this.eventManager.removeHandlers(GameEvents.SummonWarrior);
		this.eventManager.removeHandlers(GameEvents.KilledWarrior);

		this.player.cleanup();
	}

}
