// src/carparking/dtos/create-lot.dto.ts
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  id: string; // Unique identifier for the parking lot

  @IsInt()
  @Min(1)
  size: number; // Number of slots in the parking lot
}