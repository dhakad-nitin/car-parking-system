// src/carparking/dtos/free-slot.dto.ts
import { IsInt, Min } from 'class-validator';

export class FreeSlotDto {
  @IsInt()
  @Min(1)
  slot: number; // Slot number to free
}