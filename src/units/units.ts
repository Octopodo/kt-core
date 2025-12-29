/**
 * Minimal base class for all Units.
 */
export abstract class KT_Unit<T = number | number[]> {
    value: T;
    type: string;
    protected allowedTypes: string[] = [];

    constructor(value: T, type: string) {
        this.value = value;
        this.type = type;
    }

    /**
     * Converts this unit to a target type.
     * Use KT_Unit<any> as return type to allow cross-hierarchy conversions (e.g. Percent -> Vector).
     */
    abstract to(targetType: string, context?: any): KT_Unit<any>;

    toString() {
        return `${this.value} ${this.type}`;
    }

    protected isArray(val: any): val is number[] {
        return Object.prototype.toString.call(val) === "[object Array]";
    }

    /**
     * Converts an incoming unit to this unit's type for arithmetic.
     * Broadened to KT_Unit<any> to support universal units like Percent.
     */
    protected transform(unit: KT_Unit<any>, context?: any): T {
        if (unit.type === this.type) {
            return unit.value;
        }
        return unit.to(this.type, context).value;
    }
}

/**
 * Specialized Unit for Scalar (1D) values.
 */
export abstract class KT_ScalarUnit extends KT_Unit<number> {
    add(unit: KT_Unit<any>, context?: any): KT_ScalarUnit {
        const otherValue = this.transform(unit, context);
        return new (this.constructor as any)(
            this.value + otherValue,
            this.type
        );
    }

    sub(unit: KT_Unit<any>, context?: any): KT_ScalarUnit {
        const otherValue = this.transform(unit, context);
        return new (this.constructor as any)(
            this.value - otherValue,
            this.type
        );
    }

    mul(operand: KT_Unit<any> | number, context?: any): KT_ScalarUnit {
        const otherValue =
            typeof operand === "number"
                ? operand
                : this.transform(operand, context);
        return new (this.constructor as any)(
            this.value * otherValue,
            this.type
        );
    }

    div(operand: KT_Unit<any> | number, context?: any): KT_ScalarUnit {
        const otherValue =
            typeof operand === "number"
                ? operand
                : this.transform(operand, context);
        if (otherValue === 0) throw new Error("KT_Units: Division by zero");
        return new (this.constructor as any)(
            this.value / otherValue,
            this.type
        );
    }

    equals(unit: KT_Unit<any>, context?: any): boolean {
        try {
            const otherValue = this.transform(unit, context);
            return Math.abs(this.value - otherValue) < 0.000001;
        } catch (e) {
            return false;
        }
    }
}

/**
 * Specialized Unit for Vector (ND) values.
 */
export abstract class KT_VectorUnit extends KT_Unit<number[]> {
    add(unit: KT_Unit<any>, context?: any): KT_VectorUnit {
        const otherValue = this.transform(unit, context);
        if (this.value.length !== otherValue.length)
            throw new Error("KT_Units: Dimension mismatch");
        const newValue = this.value.map((v, i) => v + otherValue[i]);
        return new (this.constructor as any)(newValue, this.type);
    }

    sub(unit: KT_Unit<any>, context?: any): KT_VectorUnit {
        const otherValue = this.transform(unit, context);
        if (this.value.length !== otherValue.length)
            throw new Error("KT_Units: Dimension mismatch");
        const newValue = this.value.map((v, i) => v - otherValue[i]);
        return new (this.constructor as any)(newValue, this.type);
    }

    mul(operand: KT_Unit<any> | number, context?: any): KT_VectorUnit {
        let newValue: number[];
        if (typeof operand === "number") {
            newValue = this.value.map((v) => v * operand);
        } else {
            const otherValue = this.transform(operand, context);
            if (this.value.length !== otherValue.length)
                throw new Error("KT_Units: Dimension mismatch");
            newValue = this.value.map((v, i) => v * otherValue[i]);
        }
        return new (this.constructor as any)(newValue, this.type);
    }

    div(operand: KT_Unit<any> | number, context?: any): KT_VectorUnit {
        let newValue: number[];
        if (typeof operand === "number") {
            if (operand === 0) throw new Error("KT_Units: Division by zero");
            newValue = this.value.map((v) => v / operand);
        } else {
            const otherValue = this.transform(operand, context);
            if (this.value.length !== otherValue.length)
                throw new Error("KT_Units: Dimension mismatch");
            newValue = this.value.map((v, i) => {
                if (otherValue[i] === 0)
                    throw new Error("KT_Units: Division by zero");
                return v / otherValue[i];
            });
        }
        return new (this.constructor as any)(newValue, this.type);
    }

    equals(unit: KT_Unit<any>, context?: any): boolean {
        try {
            const otherValue = this.transform(unit, context);
            if (this.value.length !== otherValue.length) return false;
            return this.value.every(
                (v, i) => Math.abs(v - otherValue[i]) < 0.000001
            );
        } catch (e) {
            return false;
        }
    }
}
