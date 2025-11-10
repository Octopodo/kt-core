import { describe, it, expect, throwError } from "kt-testing-suite-core";

describe("Array shim tests", () => {
    it("should have indexOf method", () => {
        const arr = [1, 2, 3, 4, 5];
        const index = arr.indexOf(3);
        expect(index).toBe(2);
    });
});
