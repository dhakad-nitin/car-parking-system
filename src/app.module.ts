import { Module } from '@nestjs/common';
import { CarparkingModule } from './carparking/carparking.module';

@Module({
  imports: [CarparkingModule],
})
export class AppModule {}
