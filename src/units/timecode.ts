import { KT_Seconds, KT_Frames } from "./time";
import { KT_Unit } from "./units";

/**
 * Utility for parsing and formatting Adobe Timecode.
 */
export class KT_Timecode {
    /**
     * Formats a time unit into a timecode string.
     */
    static toString(time: KT_Unit<number>, fps: number): string {
        const totalSeconds = time.to("seconds", fps).value;
        const absSeconds = Math.abs(totalSeconds);

        const h = Math.floor(absSeconds / 3600);
        const m = Math.floor((absSeconds % 3600) / 60);
        const s = Math.floor(absSeconds % 60);
        const f = Math.floor(((absSeconds % 1) + 0.00001) * fps); // Small epsilon for precision

        const pad = (n: number) => (n < 10 ? "0" + n : n.toString());

        let result = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
        if (totalSeconds < 0) result = "-" + result;

        return result;
    }

    /**
     * Parses a timecode string into a KT_Seconds object.
     * Supports formats like "HH:MM:SS:FF" or "HH:MM:SS;FF" (drop frame).
     */
    static toTime(tc: string, fps: number): KT_Seconds {
        // ES3 safe way to replace all semicolons with colons before splitting
        const parts = tc.split(";").join(":").split(":");
        if (parts.length !== 4) {
            throw new Error(
                `KT_Timecode: Invalid timecode format "${tc}". Expected HH:MM:SS:FF`
            );
        }

        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const s = parseInt(parts[2], 10);
        const f = parseInt(parts[3], 10);

        const totalSeconds = h * 3600 + m * 60 + s + f / fps;
        return new KT_Seconds(totalSeconds);
    }
}
