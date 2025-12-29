import { KT_VectorUnit } from "./units";

/**
 * Agnostic Rect Unit.
 * Stores [x, y, width, height].
 */
export class KT_Rect extends KT_VectorUnit {
    constructor(value: number[], type: string = "rect") {
        if (value.length !== 4) {
            throw new Error(
                "KT_Rect: Value must be an array of length 4 [x, y, w, h]."
            );
        }
        super(value, type);
    }

    x(): number {
        return this.value[0];
    }
    y(): number {
        return this.value[1];
    }
    width(): number {
        return this.value[2];
    }
    height(): number {
        return this.value[3];
    }

    centerX(): number {
        return this.x() + this.width() / 2;
    }
    centerY(): number {
        return this.y() + this.height() / 2;
    }

    to(targetType: string, context?: any): KT_Rect {
        if (this.type === targetType) return new KT_Rect(this.value, this.type);
        throw new Error(
            `KT_Rect: Conversion from ${this.type} to ${targetType} not implemented.`
        );
    }

    static from(
        x: number,
        y: number,
        w: number,
        h: number,
        type: string = "rect"
    ): KT_Rect {
        return new KT_Rect([x, y, w, h], type);
    }
}
