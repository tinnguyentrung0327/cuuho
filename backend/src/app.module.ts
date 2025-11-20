import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [PrismaModule, UsersModule, RequestsModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
