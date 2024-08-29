import Logger from "./Plugs/Logger";
let logger = new Logger("Server");
logger.info('服务正启动...');
import { server } from "./Server/Server";
async function main() {
    server.start();
}

main().catch((err) => {
    logger.error(err);
});