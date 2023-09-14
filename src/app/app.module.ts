import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import loadServerConfig from '../config/loadServerConfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [loadServerConfig]
        })
    ]
})
export class AppModule {}
