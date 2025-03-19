export class KT {
    private name = 'KtCore';
    private version = '1.0.0';

    static salute() {
        const obj = { name: 'KtCore', version: '1.0.0' };
        alert(JSON.stringify(obj));
        alert(`Hello from ${this.name} `);
    }

    static init() {
        return this.name;
    }
    static Module(name: string, module: any) {
        if ((this as any)[name]) {
            $.writeln(`Module ${name} already exists`);
            return;
        }
        (this as any)[name] = module;
    }
}
