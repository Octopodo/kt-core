import { KT_ScalarUnit } from "./units";

/**
 * Agnostic Angle Unit.
 * Supports 'deg' (degrees) and 'rad' (radians).
 */
export class KT_Angle extends KT_ScalarUnit {
    constructor(value: number, type: "deg" | "rad" = "deg") {
        super(value, type);
        this.allowedTypes = ["deg", "rad"];
    }

    to(targetType: "deg" | "rad", context?: any): KT_Angle {
        if (this.type === targetType) {
            return new KT_Angle(this.value, this.type as any);
        }

        let newValue: number;

        if (this.type === "deg" && targetType === "rad") {
            newValue = this.value * (Math.PI / 180);
        } else if (this.type === "rad" && targetType === "deg") {
            newValue = this.value * (180 / Math.PI);
        } else {
            throw new Error(
                `KT_Angle: Unsupported conversion from ${this.type} to ${targetType}`
            );
        }

        return new KT_Angle(newValue, targetType);
    }

    static deg(val: number): KT_Angle {
        return new KT_Angle(val, "deg");
    }

    static rad(val: number): KT_Angle {
        return new KT_Angle(val, "rad");
    }
}
