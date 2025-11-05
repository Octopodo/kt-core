import { describe, it, expect } from "kt-testing-suite-core";

describe("Object Spread", () => {
    it("should merge objects correctly", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        const merged = { ...obj1, ...obj2 };
        expect(merged).toEqual({ a: 1, b: 3, c: 4 });
    });

    it("should spread arrays", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];
        const combined = [...arr1, ...arr2];
        expect(combined).toEqual([1, 2, 3, 4, 5, 6]);
    });
});
