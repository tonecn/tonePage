import Logger from "../Plugs/Logger";
import { APILoader } from "../Plugs/API/APILoader";
import config from "../config";

// 加载Plugs
import '../Plugs/Service/captchaSession'

// 加载API
import GetTest from "../APIs/GetTest";
import GetResourceList from "../APIs/GetResourceList";
import GetBlogList from "../APIs/GetBlogList";
import GetBlogContent from "../APIs/GetBlogContent";
import BlogLike from "../APIs/BlogLike";
import BlogComment from "../APIs/BlogComment";
import GetBlogComment from "../APIs/GetBlogComment";
import GetCaptcha from "../APIs/GetCaptcha";
import CheckCaptcha from "../APIs/CheckCaptcha";

import Login from "../APIs/Console/Login";
import GetResources from "../APIs/Console/GetResources";
import GetBlogs from '../APIs/Console/GetBlogs'
import SaveResource from '../APIs/Console/SaveResource'
import DelResource from '../APIs/Console/DelResource'
import SaveBlog from '../APIs/Console/SaveBlog'
import DelBlog from '../APIs/Console/DelBlog'
import GetOSSToken from "../APIs/Console/GetOSSToken";

class Server {
    private logger = new Logger('Server');
    public static instance: Server;
    private apiLoader = new APILoader();

    constructor() {
        Server.instance = this;
    }

    public async start() {
        // 加载API
        this.apiLoader.add(GetTest);
        this.apiLoader.add(GetResourceList);
        this.apiLoader.add(GetBlogList);
        this.apiLoader.add(GetBlogContent);
        this.apiLoader.add(BlogLike);
        this.apiLoader.add(BlogComment);
        this.apiLoader.add(GetBlogComment);
        this.apiLoader.add(GetCaptcha);
        this.apiLoader.add(CheckCaptcha);

        this.apiLoader.add(Login);
        this.apiLoader.add(GetResources);
        this.apiLoader.add(SaveResource);
        this.apiLoader.add(DelResource);
        this.apiLoader.add(GetBlogs)
        this.apiLoader.add(SaveBlog);
        this.apiLoader.add(DelBlog);
        this.apiLoader.add(GetOSSToken);

        this.apiLoader.start(config.apiPort);
    }
}

let _Server = new Server();
export {
    _Server as server,
}