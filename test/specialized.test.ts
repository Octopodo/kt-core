import { it, expect, describe } from "kt-testing-suite-core";
import {
    KT_Angle,
    KT_Color,
    KT_Rect,
    KT_Timecode,
    KT_Seconds,
    KT_Frames,
} from "../src";

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

        it("should perform angle arithmetic", () => {
            const a1 = KT_Angle.deg(90);
            const a2 = KT_Angle.rad(Math.PI / 2); // 90 deg
            const res = a1.add(a2);
            expect(res.value).toBe(180);
            expect(res.type).toBe("deg");
        });
    });

    describe("KT_Color", () => {
        it("should convert decimal to 8bit", () => {
            const color = KT_Color.fromRGBA(1, 0.5, 0, 1, "decimal");
            const bit8 = color.to("8bit");
            expect(bit8.r()).toBe(255);
            expect(bit8.g()).toBe(127.5);
            expect(bit8.b()).toBe(0);
            expect(bit8.a()).toBe(255);
        });

        it("should convert 8bit to decimal", () => {
            const color = KT_Color.fromRGBA(255, 255, 255, 255, "8bit");
            const dec = color.to("decimal");
            expect(dec.r()).toBe(1);
            expect(dec.g()).toBe(1);
            expect(dec.b()).toBe(1);
            expect(dec.a()).toBe(1);
        });

        it("should perform color arithmetic (addition)", () => {
            const c1 = KT_Color.fromRGBA(0.1, 0.2, 0.3, 1, "decimal");
            const c2 = KT_Color.fromRGBA(0.4, 0.5, 0.6, 0, "decimal");
            const res = c1.add(c2) as KT_Color;
            expect(res.r()).toBeCloseTo(0.5, 5);
            expect(res.g()).toBeCloseTo(0.7, 5);
            expect(res.b()).toBeCloseTo(0.9, 5);
            expect(res.a()).toBe(1);
        });

        it("should perform color arithmetic (scalar multiplication)", () => {
            const c = KT_Color.fromRGBA(0.5, 0.5, 0.5, 1, "decimal");
            const res = c.mul(2) as KT_Color; // Double brightness
            expect(res.r()).toBe(1.0);
            expect(res.g()).toBe(1.0);
            expect(res.b()).toBe(1.0);
            expect(res.a()).toBe(2.0); // Simple math, doesn't clamp alpha by default (standard vector behavior)
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
            const r2 = KT_Rect.from(5, 5, 0, 0); // Offset x, y by 5
            const res = r1.add(r2) as KT_Rect;
            expect(res.x()).toBe(15);
            expect(res.y()).toBe(15);
            expect(res.width()).toBe(50);
            expect(res.height()).toBe(50);
        });
    });

    describe("KT_Timecode", () => {
        it("should format time to string", () => {
            const t = new KT_Seconds(61.5); // 1m 1s 12f @ 24fps
            const tc = KT_Timecode.toString(t, 24);
            expect(tc).toBe("00:01:01:12");
        });

        it("should parse string to time", () => {
            const tc = "00:01:00:12";
            const t = KT_Timecode.toTime(tc, 24);
            expect(t.value).toBe(60.5);
            expect(t.type).toBe("seconds");
        });

        it("should handle semicolon (drop-frame style) in parsing", () => {
            const tc = "00;01;00;12";
            const t = KT_Timecode.toTime(tc, 24);
            expect(t.value).toBe(60.5);
        });

        it("should handle negative time formatting", () => {
            const t = new KT_Seconds(-1);
            const tc = KT_Timecode.toString(t, 24);
            expect(tc).toBe("-00:00:01:00");
        });
    });
});
