import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            return await super.canActivate(context);
        } catch (error) {
            // 验证失败时，req.user = null，但允许继续
            const request = context.switchToHttp().getRequest();
            request.user = null;
            return true;
        }
    }
}