import { KT_Unit, KT_ScalarUnit } from "./units";

/**
 * Universal Percent Unit.
 * Can be added to any other unit if a base context is provided.
 */
export class KT_Percent extends KT_ScalarUnit {
    constructor(value: number) {
        super(value, "percent");
    }

    /**
     * Converts a percentage to a target type value using the provided context as the 100% reference.
     */
    to(targetType: string, context?: any): KT_Unit<any> {
        if (targetType === "percent") {
            return new KT_Percent(this.value);
        }

        if (context === undefined || context === null) {
            throw new Error(
                `KT_Percent: Conversion to ${targetType} requires a 100% reference context.`
            );
        }

        const multiplier = this.value / 100;
        let newValue: number | number[];

        if (this.isArray(context)) {
            newValue = context.map((v) => v * multiplier);
        } else if (typeof context === "number") {
            newValue = context * multiplier;
        } else if (context instanceof KT_Unit) {
            if (this.isArray(context.value)) {
                newValue = context.value.map((v) => v * multiplier);
            } else {
                newValue = (context.value as number) * multiplier;
            }
        } else {
            newValue = Number(context) * multiplier;
        }

        return new (KT_Percent as any).Result(newValue, targetType);
    }

    private static Result = class extends KT_Unit<any> {
        to(targetType: string, context?: any): KT_Unit<any> {
            if (targetType === this.type) return this;
            throw new Error(
                "KT_Percent.Result: Conversion not supported on anonymous result."
            );
        }
    };
}
