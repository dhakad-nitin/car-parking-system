// src/carparking/dtos/park.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ParkDto {
  @IsString()
  @IsNotEmpty()
  regNo: string; // Registration number of the car

  @IsString()
  @IsNotEmpty()
  color: string; // Color of the car
}