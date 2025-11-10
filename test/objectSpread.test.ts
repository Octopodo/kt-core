import { describe, it, expect } from "kt-testing-suite-core";

describe("Object Spread", () => {
    it("should merge objects correctly", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        const merged = { ...obj1, ...obj2 };
        expect(merged).toEqual({ a: 1, b: 3, c: 4 });
    });

    it("should handle nested objects", () => {
        const obj1 = { a: 1, b: { x: 10, y: 20 } };
        const obj2 = { b: { y: 30, z: 40 }, c: 4 };
        const merged = { ...obj1, ...obj2 };
        expect(merged).toEqual({ a: 1, b: { y: 30, z: 40 }, c: 4 });
    });

    it("should spread strings into arrays", () => {
        const str = "hello";
        const chars = [...str];
        expect(chars).toEqual(["h", "e", "l", "l", "o"]);
    });

    it("should merge combined objects", () => {
        const obj1 = { a: 1 };
        const obj2 = { b: 2 };
        const obj3 = { c: 3 };
        const merged = { ...obj1, ...{ ...obj2, ...obj3 } };
        expect(merged).toEqual({ a: 1, b: 2, c: 3 });
    });
    it("should spread arrays", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];
        const combined = [...arr1, ...arr2];
        expect(combined).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it("shoud use hasOwnProperty from Object ", () => {
        const obj = { a: 1, b: 2 };
        expect(obj.hasOwnProperty("a")).toBe(true);
        expect(obj.hasOwnProperty("c")).toBe(false);
    });
});
