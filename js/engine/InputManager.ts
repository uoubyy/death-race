import { Keys, Tags } from '../const';
import Set = Phaser.Structs.Set;
import Logger from "../utilities/logger";
import { KeyState } from "../types/types";
import EventManager from "../utilities/EventManager";
import DI from "../utilities/DI";
import { GameEvents, InputChangeInfo } from "../utilities/events";

export default class InputManager {
    private keys: object;
    private input!: Set<string>;
    private eventManager!: EventManager;

    private readonly keysList: string[] = [Keys.Right, Keys.Down, Keys.Up, Keys.Left, Keys.Reset, Keys.Action];
    private keyStates: Record<string, KeyState> = {};

    constructor(scene: Phaser.Scene) {
        this.keys = scene.input.keyboard.addKeys(this.keysList.join(","));
        this.input = new Set();
        this.eventManager = DI.Get("EventManager") as EventManager;

        Logger.detail(this.keys, Tags.Input);
        for (let k of this.keysList) {
            // @ts-ignore
            this.keys[k].on('down', (key) => this.onKeyStateChange(k, true));
            // @ts-ignore
            this.keys[k].on('up', (key) => this.onKeyStateChange(k, false));

            this.keyStates[k] = {
                isJustDown: false,
                isJustUp: false,
                held: false
            }
        }
    }

    onKeyStateChange(k: string, down: boolean) {
        this.eventManager.sendEvent(GameEvents.InputChange, {
            Key: k,
            IsDown: down,
            IsUp: !down,
        } as InputChangeInfo)
    }

    update(deltaTime: number) {
        this.input.clear();


        // @ts-ignore
        if (this.keys.A.isDown) {
            this.input.set(Keys.Left);
        }
        // @ts-ignore
        if (this.keys.D.isDown) this.input.set(Keys.Right);
        // @ts-ignore
        if (this.keys.W.isDown) this.input.set(Keys.Up);
        // @ts-ignore
        if (this.keys.S.isDown) this.input.set(Keys.Down);
        // @ts-ignore
        if (this.keys.R.isDown) this.input.set(Keys.Reset);
        // @ts-ignore
        if (this.keys.SPACE.isDown) this.input.set(Keys.Action);
    }

    getInput(): Set<string> {
        return this.input;
    }
}
