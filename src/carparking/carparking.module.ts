import { Module } from '@nestjs/common';
import CarParkingController from './carparking.controller';
import CarParkingService from './carparking.service';

@Module({
  controllers: [CarParkingController],
  providers: [CarParkingService],
})
export class CarparkingModule {}
