import InputManager from "./InputManager";
import DI from "../utilities/DI";

export default class ObjectController {
    protected veolocity: [number, number] = [0, 0];
    protected angleVeolocity: number = 0;

    protected inputManager: InputManager;

    constructor() {
        this.inputManager = DI.Get('InputManager') as InputManager;
    }

    update(deltaTime: number) {

    }

    getVeolocity() {
        return this.veolocity;
    }

    getAngleVeolocity() {
        return this.angleVeolocity;
    }
}