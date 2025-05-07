import { BadRequestException } from '@nestjs/common';
import { Car } from './car.entity';

export class ParkingLot {
  private totalSlots: number;
  private occupiedSlots: Map<number, Car>;
  private availableSlots: number[]; // Sorted array acting as a min-heap
  private colorMap: Map<string, Set<number>>;
  private regMap: Map<string, number>;

  constructor(size: number) {
    if (size <= 0) {
      throw new BadRequestException('Parking lot size must be positive');
    }
    this.totalSlots = size;
    this.occupiedSlots = new Map();
    this.availableSlots = Array.from({ length: size }, (_, i) => i + 1);
    this.colorMap = new Map();
    this.regMap = new Map();
  }

  getSize(): number {
    return this.totalSlots;
  }

  getAvailableCount(): number {
    return this.availableSlots.length;
  }

  getOccupiedCount(): number {
    return this.occupiedSlots.size;
  }
}