import { KT_Scalar } from "./scalar";

/**
 * Agnostic Time Unit for After Effects and Premiere.
 * Supports 'seconds' and 'frames'.
 */
export class KT_Time extends KT_Scalar {
    constructor(value: number, type: "seconds" | "frames") {
        super(value, type);
        this.allowedTypes = ["seconds", "frames"];
    }

    to(targetType: "seconds" | "frames", context?: any): KT_Time {
        if (this.type === targetType) {
            return new KT_Time(this.value, this.type as any);
        }

        let fps: number | undefined;

        if (typeof context === "number") {
            fps = context;
        } else if (context && typeof context.fps === "number") {
            fps = context.fps;
        }

        if (fps === undefined) {
            throw new Error(
                `KT_Time: Conversion from ${this.type} to ${targetType} requires an FPS context.`
            );
        }

        let newValue: number;

        if (this.type === "seconds" && targetType === "frames") {
            newValue = this.value * fps;
        } else if (this.type === "frames" && targetType === "seconds") {
            newValue = this.value / fps;
        } else {
            throw new Error(
                `KT_Time: Unsupported conversion from ${this.type} to ${targetType}`
            );
        }

        return new KT_Time(newValue, targetType);
    }

    static seconds(val: number): KT_Time {
        return new KT_Time(val, "seconds");
    }

    static frames(val: number): KT_Time {
        return new KT_Time(val, "frames");
    }
}
