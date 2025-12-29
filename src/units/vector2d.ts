import { KT_VectorUnit } from "./units";

/**
 * Agnostic 2D Vector Unit for After Effects and Premiere.
 */
export class KT_Vector2D extends KT_VectorUnit {
    constructor(value: number[], type: string) {
        if (value.length !== 2) {
            throw new Error("KT_Vector2D: Value must be an array of length 2.");
        }
        super(value, type);
    }

    x(): number {
        return this.value[0];
    }
    y(): number {
        return this.value[1];
    }

    to(targetType: string, context?: any): KT_Vector2D {
        if (this.type === targetType)
            return new KT_Vector2D(this.value, this.type);
        throw new Error(
            `KT_Vector2D: Conversion from ${this.type} to ${targetType} not implemented in agnostic base.`
        );
    }

    static from(x: number, y: number, type: string): KT_Vector2D {
        return new KT_Vector2D([x, y], type);
    }
}
