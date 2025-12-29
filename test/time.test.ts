import { it, expect, describe } from "kt-testing-suite-core";
import { KT_Time, KT_FPS } from "../src";

describe("Time and FPS Units", () => {
    describe("KT_Time Basic Operations", () => {
        it("should create time in seconds", () => {
            const t = KT_Time.seconds(1);
            expect(t.value).toBe(1);
            expect(t.type).toBe("seconds");
        });

        it("should create time in frames", () => {
            const t = KT_Time.frames(24);
            expect(t.value).toBe(24);
            expect(t.type).toBe("frames");
        });
    });

    describe("Conversions with Context", () => {
        it("should convert seconds to frames with numeric FPS context", () => {
            const t = KT_Time.seconds(1);
            const frames = t.to("frames", 24);
            expect(frames.value).toBe(24);
            expect(frames.type).toBe("frames");
        });

        it("should convert frames to seconds with numeric FPS context", () => {
            const t = KT_Time.frames(48);
            const seconds = t.to("seconds", 24);
            expect(seconds.value).toBe(2);
            expect(seconds.type).toBe("seconds");
        });

        it("should convert with object context { fps: number }", () => {
            const t = KT_Time.seconds(2);
            const frames = t.to("frames", { fps: 30 });
            expect(frames.value).toBe(60);
        });

        it("should throw if context is missing for conversion", () => {
            const t = KT_Time.seconds(1);
            let error: any;
            try {
                t.to("frames");
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });
    });

    describe("Arithmetic Interaction", () => {
        it("should add seconds and frames using context", () => {
            const t1 = KT_Time.seconds(1);
            const t2 = KT_Time.frames(24);

            // 1s + 24f (@24fps) = 2s
            const result = t1.add(t2, 24);
            expect(result.value).toBe(2);
            expect(result.type).toBe("seconds");
        });

        it("should result in frames if the base is frames", () => {
            const t1 = KT_Time.frames(24);
            const t2 = KT_Time.seconds(1);

            // 24f + 1s (@24fps) = 48f
            const result = t1.add(t2, 24);
            expect(result.value).toBe(48);
            expect(result.type).toBe("frames");
        });

        it("should handle division by scalar", () => {
            const t = KT_Time.seconds(10);
            const result = t.div(2);
            expect(result.value).toBe(5);
        });
    });

    describe("KT_FPS Unit", () => {
        it("should create an FPS unit", () => {
            const fps = new KT_FPS(24);
            expect(fps.value).toBe(24);
            expect(fps.type).toBe("fps");
        });
    });
});
