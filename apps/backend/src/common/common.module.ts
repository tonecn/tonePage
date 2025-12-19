import { Module } from '@nestjs/common';
import { RolesGuard } from './guard/roles.guard';
import { UserModule } from 'src/user/user.module';

@Module({
    providers: [RolesGuard],
    imports: [UserModule],
    exports: [RolesGuard],
})
export class CommonModule { }
