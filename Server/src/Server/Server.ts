import Logger from "../Plugs/Logger";
import { APILoader } from "../Plugs/API/APILoader";
import config from "../config";

import GetTest from "../APIs/GetTest";
import GetResourceList from "../APIs/GetResourceList";
import GetBlogList from "../APIs/GetBlogList";
import GetBlogContent from "../APIs/GetBlogContent";
import BlogLike from "../APIs/BlogLike";

class Server {
    private logger = new Logger('Server');
    public static instance: Server;
    private apiLoader = new APILoader();

    constructor() {
        Server.instance = this;
    }

    public async start() {
        // 加载前台API
        this.apiLoader.add(GetTest);
        this.apiLoader.add(GetResourceList);
        this.apiLoader.add(GetBlogList);
        this.apiLoader.add(GetBlogContent);
        this.apiLoader.add(BlogLike);

        this.apiLoader.start(config.apiPort);
    }
}

let _Server = new Server();
export {
    _Server as server,
}