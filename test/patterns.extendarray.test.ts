import { describe, it, expect } from "kt-testing-suite-core";
import { KT_Paterns } from "../src/patterns";

describe("ExtendArray Function Tests", () => {
    // Happy Path Tests
    describe("Happy Path", () => {
        it("should create a subclass that inherits from Array", () => {
            function MyArray() {}
            const SubArray = KT_Paterns.ExtendArray(MyArray);

            const instance = new (SubArray as any)();
            expect(instance).toBeInstanceOf(Array);
            expect(Array.isArray(instance)).toBe(true);
        });

        it("should copy methods from the subclass to the array", () => {
            function MyArray() {}
            MyArray.prototype.customMethod = function () {
                return "custom result";
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(instance.customMethod()).toBe("custom result");
        });

        it("should initialize array with arguments using init method", () => {
            function MyArray() {}
            MyArray.prototype.init = function () {
                return [1, 2, 3];
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(instance.length).toBe(3);
            expect(instance[0]).toBe(1);
            expect(instance[1]).toBe(2);
            expect(instance[2]).toBe(3);
        });

        it("should call configure method if it exists", () => {
            let configured = false;
            function MyArray() {}
            MyArray.prototype.init = function () {
                return [1];
            };
            MyArray.prototype.configure = function () {
                configured = true;
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(configured).toBe(true);
        });

        it("should support array methods like push and pop", () => {
            function MyArray() {}
            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            instance.push(1);
            instance.push(2);
            expect(instance.length).toBe(2);
            expect(instance.pop()).toBe(2);
            expect(instance.length).toBe(1);
        });

        it("should pass arguments to init and configure methods", () => {
            let initArgs: any[] = [];
            let configureArgs: any[] = [];

            function MyArray() {}
            MyArray.prototype.init = function () {
                initArgs = Array.prototype.slice.call(arguments);
                return [];
            };
            MyArray.prototype.configure = function () {
                configureArgs = Array.prototype.slice.call(arguments);
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)(1, 2, 3);

            expect(initArgs).toEqual([1, 2, 3]);
            expect(configureArgs).toEqual([1, 2, 3]);
        });
    });

    // Sad Path Tests
    describe("Sad Path", () => {
        it("should provide default init method if not present", () => {
            function MyArray() {}
            // No init method defined

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)(1, 2, 3);

            expect(instance.length).toBe(3);
            expect(instance[0]).toBe(1);
            expect(instance[1]).toBe(2);
            expect(instance[2]).toBe(3);
        });

        it("should handle subclass without configure method", () => {
            function MyArray() {}
            MyArray.prototype.init = function () {
                return [1];
            };
            // No configure method

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(instance.length).toBe(1);
            expect(instance[0]).toBe(1);
        });

        it("should handle empty subclass", () => {
            function MyArray() {}
            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(instance).toBeInstanceOf(Array);
            expect(instance.length).toBe(0);
        });
    });

    // Grey Path Tests (Corner Cases)
    describe("Grey Path", () => {
        it("should handle configure method throwing error", () => {
            function MyArray() {}
            MyArray.prototype.init = function () {
                return [];
            };
            MyArray.prototype.configure = function () {
                throw new Error("Configure error");
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);

            expect(() => {
                new (SubArray as any)();
            }).toThrow("Configure error");
        });

        it("should handle init method throwing error", () => {
            function MyArray() {}
            MyArray.prototype.init = function () {
                throw new Error("Init error");
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);

            expect(() => {
                new (SubArray as any)();
            }).toThrow("Init error");
        });

        it("should handle subclass with complex prototype chain", () => {
            function BaseArray() {}
            BaseArray.prototype.baseMethod = function () {
                return "base";
            };

            function MyArray() {}
            MyArray.prototype = new (BaseArray as any)();
            MyArray.prototype.myMethod = function () {
                return "my";
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(instance.myMethod()).toBe("my");
            expect(instance.baseMethod()).toBe("base");
        });

        it("should handle multiple instances with different data", () => {
            function MyArray() {}
            MyArray.prototype.init = function (value: any) {
                return [value];
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance1 = new (SubArray as any)("first");
            const instance2 = new (SubArray as any)("second");

            expect(instance1[0]).toBe("first");
            expect(instance2[0]).toBe("second");
            expect(instance1.length).toBe(1);
            expect(instance2.length).toBe(1);
        });

        it("should handle subclass methods accessing this correctly", () => {
            function MyArray() {}
            MyArray.prototype.init = function () {
                return [];
            };
            MyArray.prototype.getLength = function () {
                return this.length;
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();
            instance.push(1, 2, 3);

            expect(instance.getLength()).toBe(3);
        });

        it("should handle subclass with static properties", () => {
            function MyArray() {}
            MyArray.staticProp = "static value";

            const SubArray = KT_Paterns.ExtendArray(MyArray);

            // Static properties should not be copied to prototype
            expect((SubArray as any).staticProp).toBeUndefined();
        });

        it("should handle subclass with constructor that takes no arguments", () => {
            function MyArray() {
                // Constructor logic
            }
            MyArray.prototype.init = function () {
                return [42];
            };

            const SubArray = KT_Paterns.ExtendArray(MyArray);
            const instance = new (SubArray as any)();

            expect(instance[0]).toBe(42);
        });
    });
});
