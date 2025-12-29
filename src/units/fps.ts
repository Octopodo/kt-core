import { KT_Scalar } from "./scalar";

/**
 * Agnostic FPS Unit.
 */
export class KT_FPS extends KT_Scalar {
    constructor(value: number) {
        super(value, "fps");
    }

    to(targetType: string, context?: any): KT_FPS {
        if (targetType === "fps") {
            return new KT_FPS(this.value);
        }
        throw new Error(`KT_FPS: Cannot convert fps to ${targetType}`);
    }
}
