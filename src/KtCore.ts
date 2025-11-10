import { KT_Paterns } from "./patterns";
import "./es-shim";
class __KT_Core {
    private name = "KtCore";
    private version = "1.0.0";
    public patterns = KT_Paterns;
    salute() {
        const obj = { name: "KtCore", version: "1.0.0" };
        alert(JSON.stringify(obj));
        alert(`Hello from ${this.name} `);
    }

    init() {
        return this.name;
    }
    Module(name: string, module: any) {
        if ((this as any)[name]) {
            $.writeln(`Module ${name} already exists`);
            return;
        }
        (this as any)[name] = module;
    }
}

export const KT_Core = new __KT_Core();
