import { KT_Scalar } from "./scalar";
import { KT_Unit } from "./units";

/**
 * Agnostic Time Unit in Seconds.
 */
export class KT_Seconds extends KT_Scalar {
    constructor(value: number) {
        super(value, "seconds");
    }

    to(targetType: string, context?: any): KT_Unit<any> {
        if (targetType === "seconds") {
            return new KT_Seconds(this.value);
        }

        if (targetType === "frames") {
            let fps: number | undefined;
            if (typeof context === "number") {
                fps = context;
            } else if (context && typeof context.fps === "number") {
                fps = context.fps;
            }

            if (fps === undefined) {
                throw new Error(
                    "KT_Seconds: Conversion to frames requires an FPS context."
                );
            }

            return new KT_Frames(this.value * fps);
        }

        if (targetType === "percent") {
            // Basic percent conversion if context is provided
            if (context === undefined)
                throw new Error(
                    "KT_Seconds: Percent conversion requires context."
                );
            return new KT_Scalar(
                (this.value / Number(context)) * 100,
                "percent"
            );
        }

        throw new Error(`KT_Seconds: Unsupported conversion to ${targetType}`);
    }
}

/**
 * Agnostic Time Unit in Frames.
 */
export class KT_Frames extends KT_Scalar {
    constructor(value: number) {
        super(value, "frames");
    }

    to(targetType: string, context?: any): KT_Unit<any> {
        if (targetType === "frames") {
            return new KT_Frames(this.value);
        }

        if (targetType === "seconds") {
            let fps: number | undefined;
            if (typeof context === "number") {
                fps = context;
            } else if (context && typeof context.fps === "number") {
                fps = context.fps;
            }

            if (fps === undefined) {
                throw new Error(
                    "KT_Frames: Conversion to seconds requires an FPS context."
                );
            }

            return new KT_Seconds(this.value / fps);
        }

        throw new Error(`KT_Frames: Unsupported conversion to ${targetType}`);
    }
}
