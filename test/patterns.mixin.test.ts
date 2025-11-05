import { describe, it, expect } from "kt-testing-suite-core";
import { KT_Paterns } from "../src/patterns";

describe("Mixin Function Tests", () => {
    // Happy Path Tests
    describe("Happy Path", () => {
        it("should copy a single method from giving class to receiving class", () => {
            function GivingClass() {}
            GivingClass.prototype.testMethod = function () {
                return "test result";
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.testMethod()).toBe("test result");
        });

        it("should preserve this context in copied methods", () => {
            class GivingClass {
                method1() {
                    return "GivingClass value";
                }
                method2() {
                    return this.method1();
                }
            }

            function ReceivingClass(this: any) {
                this.value = "receiving class value";
            }

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.method2()).toBe("GivingClass value");
        });

        it("should copy multiple methods", () => {
            function GivingClass() {}
            GivingClass.prototype.method1 = function () {
                return "method1";
            };
            GivingClass.prototype.method2 = function () {
                return "method2";
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();

            expect(instance.method1()).toBe("method1");
            expect(instance.method2()).toBe("method2");
        });

        it("should copy specific methods when specified", () => {
            function GivingClass() {}
            GivingClass.prototype.method1 = function () {
                return "method1";
            };
            GivingClass.prototype.method2 = function () {
                return "method2";
            };
            GivingClass.prototype.method3 = function () {
                return "method3";
            };

            function ReceivingClass() {}

            (KT_Paterns.Mixin as any)(
                ReceivingClass,
                GivingClass,
                "method1",
                "method3"
            );

            const instance = new (ReceivingClass as any)();

            expect(instance.method1()).toBe("method1");
            expect(instance.method3()).toBe("method3");
            expect(typeof instance.method2).toBe("undefined");
        });

        it("should copy non-function properties", () => {
            function GivingClass() {}
            GivingClass.prototype.stringProperty = "test string";
            GivingClass.prototype.numberProperty = 42;

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();

            expect(instance.stringProperty).toBe("test string");
            expect(instance.numberProperty).toBe(42);
        });

        it("should pass arguments correctly to mixed methods", () => {
            function GivingClass() {}
            GivingClass.prototype.addNumbers = function (a: number, b: number) {
                return a + b;
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.addNumbers(5, 10)).toBe(15);
        });
    });

    // Sad Path Tests
    describe("Sad Path", () => {
        it("should not overwrite existing methods", () => {
            function GivingClass() {}
            GivingClass.prototype.existingMethod = function () {
                return "from giving";
            };

            function ReceivingClass() {}
            ReceivingClass.prototype.existingMethod = function () {
                return "from receiving";
            };

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.existingMethod()).toBe("from receiving");
        });

        it("should handle giving class with no prototype methods", () => {
            function GivingClass() {}
            function ReceivingClass() {}

            expect(() => {
                KT_Paterns.Mixin(ReceivingClass, GivingClass);
                const instance = new (ReceivingClass as any)();
            })
                .not()
                .toThrow();
        });
    });

    // Grey Path Tests (Corner Cases)
    describe("Grey Path", () => {
        it("should handle constructor property correctly", () => {
            function GivingClass() {}
            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.constructor).toBe(ReceivingClass);
        });

        it("should handle methods that return undefined", () => {
            function GivingClass() {}
            GivingClass.prototype.returnsUndefined = function () {
                // returns undefined
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(typeof instance.returnsUndefined()).toBe("undefined");
        });

        it("should handle methods that throw errors", () => {
            function GivingClass() {}
            GivingClass.prototype.throwsError = function () {
                throw new Error("Test error");
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();

            expect(() => {
                instance.throwsError();
            }).toThrow("Test error");
        });

        it("should handle null and undefined properties", () => {
            function GivingClass() {}
            GivingClass.prototype.nullProperty = null;
            GivingClass.prototype.undefinedProperty = undefined;

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();

            expect(instance.nullProperty).toBe(null);
            expect(instance.undefinedProperty).toBe(undefined);
        });

        it("should handle complex object properties", () => {
            function GivingClass() {}
            GivingClass.prototype.objectProperty = {
                nested: { value: "test" },
            };
            GivingClass.prototype.arrayProperty = [1, 2, 3];

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();

            expect(instance.objectProperty.nested.value).toBe("test");
            expect(instance.arrayProperty.length).toBe(3);
            expect(instance.arrayProperty[0]).toBe(1);
        });

        it("should handle methods with complex this usage", () => {
            function GivingClass() {}
            GivingClass.prototype.complexMethod = function () {
                if (!(this as any).data) {
                    (this as any).data = [];
                }
                (this as any).data.push("item");
                return (this as any).data.length;
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.complexMethod()).toBe(1);
            expect(instance.complexMethod()).toBe(2);
            expect(instance.data.length).toBe(2);
        });

        it("should handle methods with variable arguments", () => {
            function GivingClass() {}
            GivingClass.prototype.sumAll = function () {
                let sum = 0;
                for (let i = 0; i < arguments.length; i++) {
                    sum += arguments[i];
                }
                return sum;
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();
            expect(instance.sumAll(1, 2, 3, 4)).toBe(10);
        });

        it("should handle inherited properties correctly", () => {
            function BaseClass() {}
            BaseClass.prototype.baseMethod = function () {
                return "base method";
            };

            function GivingClass() {}
            GivingClass.prototype = new (BaseClass as any)();
            GivingClass.prototype.ownMethod = function () {
                return "own method";
            };

            function ReceivingClass() {}

            KT_Paterns.Mixin(ReceivingClass, GivingClass);

            const instance = new (ReceivingClass as any)();

            expect(instance.ownMethod()).toBe("own method");
            expect(instance.baseMethod()).toBe("base method");
        });
    });
});
