import { it, expect, describe } from "kt-testing-suite-core";
import { KT_IPathAdapter, KT_ProjectPath } from "../src/path";

describe("Path Adapter", () => {
    interface TestItem {
        name: string;
        parent: TestItem | null;
        children?: TestItem[];
    }
    const adapter: KT_IPathAdapter<TestItem> = {
        separator: "//",
        isContainer: (item: TestItem) => !!item.children,
        getName: (item: TestItem) => item.name,
        getParent: (item: TestItem) => item.parent,
        getChildren: (item: TestItem) => item.children || [],
    };
    const pathUtil = new KT_ProjectPath<TestItem>(adapter);

    it("should generate correct path", () => {
        const root: TestItem = { name: "Project", parent: null };
        const folder: TestItem = { name: "src", parent: root };
        const file: TestItem = { name: "index.ts", parent: folder };
        const path = pathUtil.get(file);
        expect(path).toBe("//src//index.ts");
    });

    it("should join paths correctly", () => {
        const joined = pathUtil.join("src", "utils", "file.ts");
        expect(joined).toBe("src//utils//file.ts");
    });
    it("should traverse the structure", () => {
        const root: TestItem = {
            name: "Project",
            parent: null,
            children: [
                {
                    name: "src",
                    parent: null,
                    children: [
                        { name: "index.ts", parent: null },
                        { name: "utils.ts", parent: null },
                    ],
                },
                {
                    name: "tests",
                    parent: null,
                    children: [{ name: "index.test.ts", parent: null }],
                },
            ],
        };
        const items: string[] = [];
        pathUtil.traverse(root, (item) => {
            items.push(item.name);
        });
        expect(items).toEqual([
            "src",
            "index.ts",
            "utils.ts",
            "tests",
            "index.test.ts",
        ]);
    });
});
