import { IsString } from "class-validator";

export class PasskeyRegisterDto {
    credentialResponse: any;
    @IsString({ message: '通行证名称只能是字符串' })
    name: string;
}