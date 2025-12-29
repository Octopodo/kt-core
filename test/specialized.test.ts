import { it, expect, describe } from "kt-testing-suite-core";
import { KT_Angle, KT_Color, KT_Rect, KT_Timecode, KT_Time } from "../src";

describe("Specialized Adobe Units", () => {
    describe("KT_Angle", () => {
        it("should convert deg to rad", () => {
            const angle = KT_Angle.deg(180);
            expect(angle.to("rad").value).toBeCloseTo(Math.PI, 5);
        });

        it("should convert rad to deg", () => {
            const angle = KT_Angle.rad(Math.PI);
            expect(angle.to("deg").value).toBe(180);
        });
    });

    describe("KT_Color", () => {
        it("should convert decimal to 8bit", () => {
            const color = KT_Color.fromRGBA(1, 0.5, 0, 1, "decimal");
            const bit8 = color.to("8bit");
            expect(bit8.r()).toBe(255);
            expect(bit8.g()).toBe(127.5);
        });

        it("should convert 8bit to decimal", () => {
            const color = KT_Color.fromRGBA(255, 255, 255, 255, "8bit");
            const dec = color.to("decimal");
            expect(dec.r()).toBe(1);
        });
    });

    describe("KT_Rect", () => {
        it("should calculate center", () => {
            const rect = KT_Rect.from(100, 100, 200, 200);
            expect(rect.centerX()).toBe(200);
            expect(rect.centerY()).toBe(200);
        });

        it("should perform rect arithmetic", () => {
            const r1 = KT_Rect.from(10, 10, 50, 50);
            const r2 = KT_Rect.from(5, 5, 0, 0);
            const res = r1.add(r2) as KT_Rect;
            expect(res.x()).toBe(15);
            expect(res.width()).toBe(50);
        });
    });

    describe("KT_Timecode", () => {
        it("should format time to string", () => {
            const t = KT_Time.seconds(61.5); // 1m 1s 12f @ 24fps
            const tc = KT_Timecode.toString(t, 24);
            expect(tc).toBe("00:01:01:12");
        });

        it("should parse string to time", () => {
            const tc = "00:01:00:12";
            const t = KT_Timecode.toTime(tc, 24);
            expect(t.value).toBe(60.5);
            expect(t.type).toBe("seconds");
        });
    });
});
