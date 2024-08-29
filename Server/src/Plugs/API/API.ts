import Logger from "../Logger";

abstract class API {

    protected logger: Logger;
    public middlewareFunc: Function[] = [];
    constructor(public method: string, public uri: string, ...func: any) {
        this.logger = new Logger('API][' + method + '][' + uri);
        this.middlewareFunc.push(...func);
    }

    // to override
    public abstract onRequset(data: any, res: any): void;
}

export { API };