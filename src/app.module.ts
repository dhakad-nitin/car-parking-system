import { Module } from '@nestjs/common';
import { CarparkingModule } from './carparking/carparking.module';
import { AppController } from './app.controller';

@Module({
  imports: [CarparkingModule],
  controllers: [AppController],
})
export class AppModule {}
