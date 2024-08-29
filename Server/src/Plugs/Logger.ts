class Logger {
    constructor(private namespace: string) {
    }

    private getTime(): string {
        return new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    public info(info: string, ...args: any): void {
        args = args.map((arg: any) => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return arg;
        })
        console.log(`[${this.getTime()}][INFO][${this.namespace}]${info[0] == '[' ? '' : ' '}${info} ` + args.join(' '));
    }

    public warn(info: string, ...args: any): void {
        args = args.map((arg: any) => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return arg;
        })
        console.log(`[${this.getTime()}][WARN][${this.namespace}]${info[0] == '[' ? '' : ' '}${info} ` + args.join(' '));
    }

    public error(info: string, ...args: any): void {
        args = args.map((arg: any) => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return arg;
        })
        console.log(`[${this.getTime()}][ERROR][${this.namespace}]${info[0] == '[' ? '' : ' '}${info} ` + args.join(' '));
    }
}

export default Logger;