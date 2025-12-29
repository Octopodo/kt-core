import { it, expect, describe } from "kt-testing-suite-core";
import { KT_Scalar, KT_Vector2D, KT_Vector3D } from "../src";

describe("Agnostic Units (Concrete)", () => {
    describe("KT_Scalar (1D)", () => {
        it("should perform arithmetic on scalars", () => {
            const s1 = new KT_Scalar(10, "px");
            const s2 = new KT_Scalar(5, "px");
            expect(s1.add(s2).value).toBe(15);
            expect(s1.mul(2).value).toBe(20);
        });

        it("should verify scalar equality", () => {
            const s1 = new KT_Scalar(10, "px");
            const s2 = new KT_Scalar(10, "px");
            expect(s1.equals(s2)).toBe(true);
        });
    });

    describe("KT_Vector2D (2D)", () => {
        it("should create and access 2D components", () => {
            const v = new KT_Vector2D([100, 200], "pos");
            expect(v.x()).toBe(100);
            expect(v.y()).toBe(200);
        });

        it("should throw error on invalid dimension", () => {
            let error: any;
            try {
                new KT_Vector2D([1, 2, 3], "oops");
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });

        it("should perform vector addition", () => {
            const v1 = new KT_Vector2D([10, 20], "px");
            const v2 = new KT_Vector2D([5, 5], "px");
            const result = v1.add(v2);
            expect(result.value[0]).toBe(15);
            expect(result.value[1]).toBe(25);
        });

        it("should handle scalar broadcasting in multiplication", () => {
            const v1 = new KT_Vector2D([10, 20], "px");
            const result = v1.mul(3);
            expect(result.value[0]).toBe(30);
            expect(result.value[1]).toBe(60);
        });
    });

    describe("KT_Vector3D (3D)", () => {
        it("should create and access 3D components", () => {
            const v = new KT_Vector3D([1, 2, 3], "pos");
            expect(v.x()).toBe(1);
            expect(v.y()).toBe(2);
            expect(v.z()).toBe(3);
        });

        it("should perform vector subtraction", () => {
            const v1 = new KT_Vector3D([10, 10, 10], "m");
            const v2 = new KT_Vector3D([1, 2, 3], "m");
            const result = v1.sub(v2);
            expect(result.value[0]).toBe(9);
            expect(result.value[1]).toBe(8);
            expect(result.value[2]).toBe(7);
        });
    });

    describe("Cross-Unit Type Safety", () => {
        it("should throw error when adding different dimensions", () => {
            const v2 = new KT_Vector2D([1, 1], "px");
            const v3 = new KT_Vector3D([1, 1, 1], "px");

            let error: any;
            try {
                (v2 as any).add(v3);
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });
    });
});
