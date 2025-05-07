// src/carparking/entities/parking-lot.entity.ts
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Car } from './car.entity';

export class ParkingLot {
  private totalSlots: number; // Total number of parking slots in the lot
  private occupiedSlots: Map<number, Car>; // Map of slot numbers to parked cars
  private availableSlots: number[]; // Array of available slot numbers, sorted for efficiency
  private colorMap: Map<string, Set<number>>; // Map of colors to sets of slot numbers
  private regMap: Map<string, number>; // Map of registration numbers to slot numbers

  // Constructor to initialize the parking lot with a given size
  constructor(size: number) {
    if (size <= 0) {
      throw new BadRequestException('Parking lot size must be positive');
    }
    this.totalSlots = size;
    this.occupiedSlots = new Map(); // Initialize empty map for occupied slots
    this.availableSlots = Array.from({ length: size }, (_, i) => i + 1); // Fill with slots 1 to size
    this.colorMap = new Map(); // Initialize empty map for color indexing
    this.regMap = new Map(); // Initialize empty map for registration indexing
  }

  // Getter for total number of slots
  getSize(): number {
    return this.totalSlots;
  }

  // Getter for number of available slots
  getAvailableCount(): number {
    return this.availableSlots.length;
  }

  // Getter for number of occupied slots
  getOccupiedCount(): number {
    return this.occupiedSlots.size;
  }

// Method to park a car and return the allocated slot number
  parkCar(car: Car): number {
    if (this.availableSlots.length === 0) {
      throw new BadRequestException('Parking lot is full');
    }
    if (this.regMap.has(car.regNo)) {
      throw new BadRequestException(`Car ${car.regNo} is already parked`);
    }
    const slot = this.availableSlots.shift()!; // Remove and get the smallest available slot
    this.occupiedSlots.set(slot, car); // Assign car to the slot
    this.regMap.set(car.regNo, slot); // Map registration number to slot
    if (!this.colorMap.has(car.color)) {
      this.colorMap.set(car.color, new Set()); // Initialize set for new color
    }
    this.colorMap.get(car.color)!.add(slot); // Add slot to color's set
    return slot; // Return the allocated slot number
  }

  // Method to free a parking slot
  freeSlot(slot: number): void {
    if (!this.occupiedSlots.has(slot)) {
      throw new BadRequestException(`Slot ${slot} is already free`);
    }
    const car = this.occupiedSlots.get(slot)!; // Get the car in the slot
    this.occupiedSlots.delete(slot); // Remove car from occupied slots
    this.regMap.delete(car.regNo); // Remove registration mapping
    this.colorMap.get(car.color)!.delete(slot); // Remove slot from color's set
    this.availableSlots.push(slot); // Add slot back to available list
    this.availableSlots.sort((a, b) => a - b); // Sort to keep smallest slot first
  }

  // Method to expand the parking lot by adding more slots
  expand(size: number): number {
    if (size <= 0) {
      throw new BadRequestException('Expansion size must be positive');
    }
    const start = this.totalSlots + 1; // Start numbering new slots after current total
    for (let i = start; i < start + size; i++) {
      this.availableSlots.push(i); // Add each new slot to available list
    }
    this.totalSlots += size; // Update total slots count
    return this.totalSlots; // Return new total
  }

  getOccupied(): { slot: number; regNo: string; color: string }[] {
    return Array.from(this.occupiedSlots.entries()).map(([slot, car]) => ({
      slot, // Slot number
      regNo: car.regNo, // Registration number of the car
      color: car.color, // Color of the car
    }));
  }

  // Method to get registration numbers of cars by color
  getRegNosByColor(color: string): string[] {
    const slots = this.colorMap.get(color.toLowerCase());
    if (!slots || slots.size === 0) {
      throw new NotFoundException(`No cars found with color ${color}`);
    }
    return Array.from(slots)
      .map(slot => this.occupiedSlots.get(slot)?.regNo)
      .filter(Boolean) as string[];
  }

  // Method to get slot numbers by car color
  getSlotsByColor(color: string): number[] {
    return Array.from(this.colorMap.get(color.toLowerCase()) || []); // Return slots for color or empty array
  }

  // Method to get slot number by registration number
  getSlotByRegNo(regNo: string): number | null {
    return this.regMap.get(regNo.toLowerCase()) || null; // Return slot or null if not found
  }
}