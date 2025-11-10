import { describe, it, expect, throwError } from "kt-testing-suite-core";
import { KT_StringUtils } from "../src/stringUtils";

describe("KT_StringUtils Tests", () => {
    // Happy Path Tests
    describe("Happy Path", () => {
        it("should return true for startsWith with case sensitivity", () => {
            const result = KT_StringUtils.startsWith(
                "HelloWorld",
                "Hello",
                true
            );
            expect(result).toBe(true);
        });

        it("should return false for startsWith with case sensitivity", () => {
            const result = KT_StringUtils.startsWith(
                "HelloWorld",
                "hello",
                true
            );
            expect(result).toBe(false);
        });
        it("should return true for startsWith without case sensitivity", () => {
            const result = KT_StringUtils.startsWith(
                "HelloWorld",
                "hello",
                false
            );
            expect(result).toBe(true);
        });

        it("should return true for endsWith with case sensitivity", () => {
            const result = KT_StringUtils.endsWith("HelloWorld", "World", true);
            expect(result).toBe(true);
        });
        it("should return false for endsWith with case sensitivity", () => {
            const result = KT_StringUtils.endsWith("HelloWorld", "world", true);
            expect(result).toBe(false);
        });
        it("should return true for endsWith without case sensitivity", () => {
            const result = KT_StringUtils.endsWith(
                "HelloWorld",
                "world",
                false
            );
            expect(result).toBe(true);
        });
        it("should return true for contains with case sensitivity", () => {
            const result = KT_StringUtils.contains("HelloWorld", "Hello", true);
            expect(result).toBe(true);
        });

        it("should return false for contains with case sensitivity", () => {
            const result = KT_StringUtils.contains("HelloWorld", "hello", true);
            expect(result).toBe(false);
        });
        it("should return true for contains without case sensitivity", () => {
            const result = KT_StringUtils.contains(
                "HelloWorld",
                "hello",
                false
            );
            expect(result).toBe(true);
        });

        it("should return true for match with case sensitivity", () => {
            const result = KT_StringUtils.match("HelloWorld", "Hello", true);
            expect(result).toBe(true);
        });
        it("should return false for match with case sensitivity", () => {
            const result = KT_StringUtils.match("HelloWorld", "hello", true);
            expect(result).toBe(false);
        });
        it("should return true for match without case sensitivity", () => {
            const result = KT_StringUtils.match("HelloWorld", "hello", false);
            expect(result).toBe(true);
        });

        it("should return true for match with flags", () => {
            const result = KT_StringUtils.match(
                "HelloWorld123",
                "\\d+",
                true,
                "g"
            );
            expect(result).toBe(true);
        });
        it("should match equals method correctly", () => {
            const result = KT_StringUtils.equals(
                "HelloWorld",
                "HelloWorld",
                true
            );
            expect(result).toBe(true);
        });
        it("should match equals method with case insensitivity", () => {
            const result = KT_StringUtils.equals(
                "HelloWorld",
                "helloworld",
                false
            );
            expect(result).toBe(true);
        });

        it("should accept RegExp as search parameter", () => {
            const result = KT_StringUtils.startsWith(
                "HelloWorld",
                /^hello/i,
                true
            );
            expect(result).toBe(true);
        });
    });

    // Edge Case Tests
    describe("Edge Cases", () => {
        it("should return false for startsWith when search string is longer", () => {
            const result = KT_StringUtils.startsWith("Hi", "Hello", true);
            expect(result).toBe(false);
        });
        it("should return false for endsWith when search string is longer", () => {
            const result = KT_StringUtils.endsWith("Hi", "World", true);
            expect(result).toBe(false);
        });
        it("should return false for contains when search string is longer", () => {
            const result = KT_StringUtils.contains("Hi", "Hello", true);
            expect(result).toBe(false);
        });
        it("should return false for match when search string is longer", () => {
            const result = KT_StringUtils.match("Hi", "Hello", true);
            expect(result).toBe(false);
        });
        //test regexp edge cases
        it("should return false for startsWith when RegExp matches longer string", () => {
            const result = KT_StringUtils.startsWith("Hi", /Hello/, true);
            expect(result).toBe(false);
        });

        it("should return false for endsWith when RegExp dont match the end", () => {
            const result = KT_StringUtils.endsWith("elloHi", /ello$/, true);
            expect(result).toBe(false);
        });
    });

    //sad Path Tests
    describe("Sad Path", () => {
        it("should return false for empty search string in startsWith", () => {
            const result = KT_StringUtils.startsWith("HelloWorld", "", true);
            expect(result).toBe(false);
        });
        it("should return false for empty search string in endsWith", () => {
            const result = KT_StringUtils.endsWith("HelloWorld", "", true);
            expect(result).toBe(false);
        });
        it("should return false for empty search string in contains", () => {
            const result = KT_StringUtils.contains("HelloWorld", "", true);
            expect(result).toBe(false);
        });
        it("should return false for empty search string in match", () => {
            const result = KT_StringUtils.match("HelloWorld", "", true);
            expect(result).toBe(false);
        });
    });
});
