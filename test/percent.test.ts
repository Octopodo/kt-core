import { it, expect, describe } from "kt-testing-suite-core";
import { KT_Seconds, KT_Percent, KT_Vector2D, KT_Scalar } from "../src";

describe("Universal Percent Interaction", () => {
    describe("Percent + Scalar/Pixels", () => {
        it("should add percentage to pixels using context", () => {
            const pixels = new KT_Scalar(100, "px");
            const extra = new KT_Percent(50); // 50%

            // 100px + 50% (of context 200px) = 100 + 100 = 200px
            const result = pixels.add(extra, 200);
            expect(result.value).toBe(200);
            expect(result.type).toBe("px");
        });
    });

    describe("Percent + Time", () => {
        it("should add percentage to time", () => {
            const duration = new KT_Seconds(10);
            const extra = new KT_Percent(10); // 10%

            // 10s + 10% (of context 60s) = 10 + 6 = 16s
            const result = duration.add(extra, 60);
            expect(result.value).toBe(16);
            expect(result.type).toBe("seconds");
        });
    });

    describe("Percent + Vector2D", () => {
        it("should add percentage to a vector components", () => {
            const pos = new KT_Vector2D([100, 100], "px");
            const move = new KT_Percent(10); // 10%

            // Context is the target size [500, 1000]
            // 10% of 500 = 50, 10% of 1000 = 100
            // [100, 100] + [50, 100] = [150, 200]
            const result = pos.add(move, [500, 1000]);

            expect(result.value[0]).toBe(150);
            expect(result.value[1]).toBe(200);
        });
    });

    describe("Error Handling", () => {
        it("should throw when context is missing for percentage conversion", () => {
            const pixels = new KT_Scalar(100, "px");
            const extra = new KT_Percent(50);

            let error: any;
            try {
                pixels.add(extra); // No context
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });
    });
});
