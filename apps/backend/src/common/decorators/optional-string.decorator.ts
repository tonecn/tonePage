import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

/**
 * 自定义装饰器：将空串转null，并在非null时进行验证
 * 与 class-validator 装饰器组合使用，需放在最上方
 */
export function OptionalString() {
    return function (target: any, propertyKey: string | symbol) {
        Transform(({ value }) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null))(target, propertyKey);
        ValidateIf((o) => o[propertyKey] !== null)(target, propertyKey);
    };
}
