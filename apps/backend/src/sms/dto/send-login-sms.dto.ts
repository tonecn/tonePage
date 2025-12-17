import { IsPhoneNumber } from "class-validator";

export class SendLoginSmsDto {
    @IsPhoneNumber('CN', { message: '请输入有效的中国大陆手机号' })
    phone: string;
}