import { KT_VectorUnit } from "./units";

/**
 * Agnostic 3D Vector Unit for After Effects and Premiere.
 */
export class KT_Vector3D extends KT_VectorUnit {
    constructor(value: number[], type: string) {
        if (value.length !== 3) {
            throw new Error("KT_Vector3D: Value must be an array of length 3.");
        }
        super(value, type);
    }

    x(): number {
        return this.value[0];
    }
    y(): number {
        return this.value[1];
    }
    z(): number {
        return this.value[2];
    }

    to(targetType: string, context?: any): KT_Vector3D {
        if (this.type === targetType)
            return new KT_Vector3D(this.value, this.type);
        throw new Error(
            `KT_Vector3D: Conversion from ${this.type} to ${targetType} not implemented in agnostic base.`
        );
    }

    static from(x: number, y: number, z: number, type: string): KT_Vector3D {
        return new KT_Vector3D([x, y, z], type);
    }
}
