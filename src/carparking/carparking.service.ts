// src/carparking/carparking.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ParkingLot } from './entities/parking-lot.entity';
import { Car } from './entities/car.entity';

@Injectable()
export class CarParkingService {
  private lots: Map<string, ParkingLot> = new Map(); // Map to store parking lots by ID

  // Method to create a new parking lot
  createLot(id: string, size: number): void {
    if (this.lots.has(id)) {
      throw new BadRequestException(`Lot ${id} already exists`);
    }
    this.lots.set(id, new ParkingLot(size)); // Create and store new parking lot
  }

  // Method to expand an existing parking lot
  expandLot(id: string, size: number): number {
    const lot = this.getLot(id); // Retrieve the parking lot
    return lot.expand(size); // Expand and return new total slots
  }

  // Method to park a car in a parking lot
  park(id: string, regNo: string, color: string): number {
    const lot = this.getLot(id); // Retrieve the parking lot
    const car = new Car(regNo, color); // Create a new car instance
    return lot.parkCar(car); // Park the car and return slot
  }

  // Method to free a slot in a parking lot
  free(id: string, slot: number): void {
    const lot = this.getLot(id); // Retrieve the parking lot
    lot.freeSlot(slot); // Free the specified slot
  }

  // Method to get the status of occupied slots in a parking lot
  getStatus(id: string): { slot: number; regNo: string; color: string }[] {
    const lot = this.getLot(id); // Retrieve the parking lot
    return lot.getOccupied(); // Return occupied slots
  }

  // Method to get registration numbers by color in a parking lot
  getRegNosByColor(id: string, color: string): string[] {
    const lot = this.getLot(id); // Retrieve the parking lot
    return lot.getRegNosByColor(color); // Return regNos for the color
  }

  // Method to get slot numbers by color in a parking lot
  getSlotsByColor(id: string, color: string): number[] {
    const lot = this.getLot(id); // Retrieve the parking lot
    return lot.getSlotsByColor(color); // Return slots for the color
  }

  // Method to get slot number by registration number in a parking lot
  getSlotByRegNo(id: string, regNo: string): number | null {
    const lot = this.getLot(id); // Retrieve the parking lot
    return lot.getSlotByRegNo(regNo); // Return slot or null if not found
  }

  // Method to get color-based car counts for a specific parking lot
  getColorCounts(id: string): Record<string, number> {
    const lot = this.getLot(id); // Retrieve the parking lot
    const colorCounts: Record<string, number> = {};
    const occupied = lot.getOccupied();
    
    // Count cars by color in the specified lot
    for (const car of occupied) {
      const color = car.color.toLowerCase();
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
    
    return colorCounts;
  }

  // Method to delete a parking lot by ID
  deleteLot(id: string): void {
    if (!this.lots.has(id)) {
      throw new NotFoundException(`Lot ${id} not found`);
    }
    this.lots.delete(id);
  }

  // Helper method to retrieve a parking lot by ID
  private getLot(id: string): ParkingLot {
    const lot = this.lots.get(id); // Attempt to get the lot
    if (!lot) {
      throw new NotFoundException(`Lot ${id} not found`);
    }
    return lot; // Return the lot if found
  }
}

export default CarParkingService;