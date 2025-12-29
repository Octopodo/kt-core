import { it, expect, describe } from "kt-testing-suite-core";
import { KT_Unit, KT_ScalarUnit, KT_VectorUnit } from "../src/units";

// Concrete implementation for testing Scalar
class TestScalar extends KT_ScalarUnit {
    to(targetType: string, context?: any): TestScalar {
        if (this.type === targetType)
            return new TestScalar(this.value, this.type);
        if (this.type === "big" && targetType === "small")
            return new TestScalar(this.value * 10, "small");
        if (this.type === "small" && targetType === "big")
            return new TestScalar(this.value / 10, "big");
        throw new Error("Unsupported");
    }
}

// Concrete implementation for testing Vector
class TestVector extends KT_VectorUnit {
    to(targetType: string, context?: any): TestVector {
        if (this.type === targetType)
            return new TestVector(this.value, this.type);
        if (this.type === "big" && targetType === "small")
            return new TestVector(
                this.value.map((v) => v * 10),
                "small"
            );
        if (this.type === "small" && targetType === "big")
            return new TestVector(
                this.value.map((v) => v / 10),
                "big"
            );
        throw new Error("Unsupported");
    }
}

describe("KT_Unit Hierarchy Refactor", () => {
    describe("Scalar Mathematics", () => {
        it("should handle scalar addition and conversion", () => {
            const u1 = new TestScalar(10, "small");
            const u2 = new TestScalar(1, "big"); // 10 small
            const result = u1.add(u2);
            expect(result.value).toBe(20);
        });

        it("should handle scalar multiplication", () => {
            const u = new TestScalar(10, "px");
            expect(u.mul(2).value).toBe(20);
        });
    });

    describe("Vector Mathematics", () => {
        it("should handle vector addition", () => {
            const v1 = new TestVector([10, 20], "px");
            const v2 = new TestVector([5, 5], "px");
            const res = v1.add(v2);
            expect(res.value[0]).toBe(15);
            expect(res.value[1]).toBe(25);
        });

        it("should handle scalar broadcast on vectors", () => {
            const v = new TestVector([10, 20], "px");
            const res = v.mul(2);
            expect(res.value[0]).toBe(20);
            expect(res.value[1]).toBe(40);
        });

        it("should throw on vector dimension mismatch", () => {
            const v1 = new TestVector([1, 1], "px");
            const v2 = new TestVector([1, 1, 1], "px");
            let err: any;
            try {
                v1.add(v2);
            } catch (e) {
                err = e;
            }
            expect(err).toBeDefined();
        });
    });
});
