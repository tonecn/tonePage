import { IsObject } from "class-validator";

export class PasskeyLoginDto {
    @IsObject()
    credentialResponse: any;
}