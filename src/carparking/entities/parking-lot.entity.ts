import { BadRequestException } from '@nestjs/common';
import { Car } from './car.entity';

export class ParkingLot {
  private totalSlots: number;
  private occupiedSlots: Map<number, Car>;
  private availableSlots: number[];
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

  parkCar(car: Car): number {
    if (this.availableSlots.length === 0) {
      throw new BadRequestException('Parking lot is full');
    }
    if (this.regMap.has(car.regNo)) {
      throw new BadRequestException(`Car ${car.regNo} is already parked`);
    }
    const slot = this.availableSlots.shift()!;
    this.occupiedSlots.set(slot, car);
    this.regMap.set(car.regNo, slot);
    if (!this.colorMap.has(car.color)) {
      this.colorMap.set(car.color, new Set());
    }
    this.colorMap.get(car.color)!.add(slot);
    return slot;
  }

  freeSlot(slot: number): void {
    if (!this.occupiedSlots.has(slot)) {
      throw new BadRequestException(`Slot ${slot} is already free`);
    }
    const car = this.occupiedSlots.get(slot)!;
    this.occupiedSlots.delete(slot);
    this.regMap.delete(car.regNo);
    this.colorMap.get(car.color)!.delete(slot);
    this.availableSlots.push(slot);
    this.availableSlots.sort((a, b) => a - b);
  }

  expand(size: number): number {
    if (size <= 0) {
      throw new BadRequestException('Expansion size must be positive');
    }
    const start = this.totalSlots + 1;
    for (let i = start; i < start + size; i++) {
      this.availableSlots.push(i);
    }
    this.totalSlots += size;
    return this.totalSlots;
  }
}