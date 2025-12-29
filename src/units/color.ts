import { KT_VectorUnit } from "./units";

/**
 * Agnostic Color Unit (RGBA).
 * Supports 'decimal' (0.0-1.0) and '8bit' (0-255).
 */
export class KT_Color extends KT_VectorUnit {
    /**
     * @param value [r, g, b, a]
     * @param type 'decimal' or '8bit'
     */
    constructor(value: number[], type: "decimal" | "8bit" = "decimal") {
        if (value.length !== 4) {
            throw new Error(
                "KT_Color: Value must be an array of 4 components [r, g, b, a]."
            );
        }
        super(value, type);
        this.allowedTypes = ["decimal", "8bit"];
    }

    r(): number {
        return this.value[0];
    }
    g(): number {
        return this.value[1];
    }
    b(): number {
        return this.value[2];
    }
    a(): number {
        return this.value[3];
    }

    to(targetType: "decimal" | "8bit", context?: any): KT_Color {
        if (this.type === targetType) {
            return new KT_Color(this.value, this.type as any);
        }

        let newValue: number[];

        if (this.type === "decimal" && targetType === "8bit") {
            newValue = this.value.map((v) => v * 255);
        } else if (this.type === "8bit" && targetType === "decimal") {
            newValue = this.value.map((v) => v / 255);
        } else {
            throw new Error(
                `KT_Color: Unsupported conversion from ${this.type} to ${targetType}`
            );
        }

        return new KT_Color(newValue, targetType);
    }

    static fromRGBA(
        r: number,
        g: number,
        b: number,
        a: number,
        type: "decimal" | "8bit" = "decimal"
    ): KT_Color {
        return new KT_Color([r, g, b, a], type);
    }
}
