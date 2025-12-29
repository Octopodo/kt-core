import { KT_ScalarUnit } from "./units";

/**
 * Agnostic Scalar (1D) Unit for After Effects and Premiere.
 */
export class KT_Scalar extends KT_ScalarUnit {
    constructor(value: number, type: string) {
        super(value, type);
    }

    to(targetType: string, context?: any): KT_Scalar {
        if (this.type === targetType)
            return new KT_Scalar(this.value, this.type);
        throw new Error(
            `KT_Scalar: Conversion from ${this.type} to ${targetType} not implemented in agnostic base.`
        );
    }
}
