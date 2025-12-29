import { it, expect, describe } from "kt-testing-suite-core";
import { KT_Seconds, KT_Frames, KT_FPS } from "../src";

describe("Seconds and Frames Units", () => {
    describe("Initialization", () => {
        it("should create seconds", () => {
            const t = new KT_Seconds(1);
            expect(t.value).toBe(1);
            expect(t.type).toBe("seconds");
        });

        it("should create frames", () => {
            const t = new KT_Frames(24);
            expect(t.value).toBe(24);
            expect(t.type).toBe("frames");
        });
    });

    describe("Conversions with Context", () => {
        it("should convert seconds to frames", () => {
            const t = new KT_Seconds(1);
            const frames = t.to("frames", 24);
            expect(frames.value).toBe(24);
            expect(frames.type).toBe("frames");
            expect(frames instanceof KT_Frames).toBe(true);
        });

        it("should convert frames to seconds", () => {
            const t = new KT_Frames(48);
            const seconds = t.to("seconds", 24);
            expect(seconds.value).toBe(2);
            expect(seconds.type).toBe("seconds");
            expect(seconds instanceof KT_Seconds).toBe(true);
        });
    });

    describe("Arithmetic Interaction", () => {
        it("should add seconds and frames using context", () => {
            const s = new KT_Seconds(1);
            const f = new KT_Frames(24);

            // 1s + 24f (@24fps) = 2s
            const result = s.add(f, 24);
            expect(result.value).toBe(2);
            expect(result.type).toBe("seconds");
        });

        it("should result in frames if the base is frames", () => {
            const f = new KT_Frames(24);
            const s = new KT_Seconds(1);

            // 24f + 1s (@24fps) = 48f
            const result = f.add(s, 24);
            expect(result.value).toBe(48);
            expect(result.type).toBe("frames");
        });
    });
});
