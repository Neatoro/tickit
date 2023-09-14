import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadServerConfig from '../config/loadServerConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entities';
import subscribers from './subscribers';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadServerConfig]
    }),
    TypeOrmModule.forRootAsync({
      async useFactory(configService: ConfigService) {
        const baseConfig = configService.get('database');
        return {
          ...baseConfig,
          entities: entities,
          subscribers: subscribers,
          synchronize: true
        };
      },
      inject: [ConfigService]
    }),
    TicketModule
  ]
})
export class AppModule {}
