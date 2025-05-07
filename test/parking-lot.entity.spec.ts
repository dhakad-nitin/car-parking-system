import { ParkingLot } from '../src/carparking/entities/parking-lot.entity';
import { Car } from '../src/carparking/entities/car.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingLot Entity', () => {
  let parkingLot: ParkingLot;

  beforeEach(() => {
    parkingLot = new ParkingLot(3); // Create a parking lot with 3 slots
  });

  // Test initialization
  describe('Initialization', () => {
    it('should create a parking lot with specified size', () => {
      expect(parkingLot.getSize()).toBe(3);
      expect(parkingLot.getAvailableCount()).toBe(3);
      expect(parkingLot.getOccupiedCount()).toBe(0);
    });

    it('should throw error for invalid size', () => {
      expect(() => new ParkingLot(0)).toThrow(BadRequestException);
      expect(() => new ParkingLot(-1)).toThrow(BadRequestException);
    });
  });

  // Test parking cars
  describe('Parking Cars', () => {
    it('should park a car and return slot number', () => {
      const car = new Car('MP07SJ6212', 'Blue');
      const slot = parkingLot.parkCar(car);
      expect(slot).toBe(1);
      expect(parkingLot.getAvailableCount()).toBe(2);
      expect(parkingLot.getOccupiedCount()).toBe(1);
    });

    it('should throw error when parking lot is full', () => {
      // Fill the parking lot
      parkingLot.parkCar(new Car('MP07SJ6212', 'Blue'));
      parkingLot.parkCar(new Car('MP07SJ6213', 'Red'));
      parkingLot.parkCar(new Car('MP07SJ6214', 'Green'));

      expect(() => parkingLot.parkCar(new Car('MP07SJ6215', 'Yellow')))
        .toThrow(BadRequestException);
    });

    it('should throw error when parking same car twice', () => {
      const car = new Car('MP07SJ6212', 'Blue');
      parkingLot.parkCar(car);
      expect(() => parkingLot.parkCar(car)).toThrow(BadRequestException);
    });
  });

  // Test freeing slots
  describe('Freeing Slots', () => {
    it('should free a slot and make it available again', () => {
      const car = new Car('MP07SJ6212', 'Blue');
      const slot = parkingLot.parkCar(car);
      parkingLot.freeSlot(slot);
      expect(parkingLot.getAvailableCount()).toBe(3);
      expect(parkingLot.getOccupiedCount()).toBe(0);
    });

    it('should throw error when freeing an already free slot', () => {
      expect(() => parkingLot.freeSlot(1)).toThrow(BadRequestException);
    });

    it('should throw error when freeing an invalid slot', () => {
      expect(() => parkingLot.freeSlot(4)).toThrow(BadRequestException);
    });
  });

  // Test getting occupied slots
  describe('Getting Occupied Slots', () => {
    it('should return correct occupied slots information', () => {
      const car1 = new Car('MP07SJ6212', 'Blue');
      const car2 = new Car('MP07SJ6213', 'Red');
      parkingLot.parkCar(car1);
      parkingLot.parkCar(car2);

      const occupied = parkingLot.getOccupied();
      expect(occupied).toHaveLength(2);
      expect(occupied).toEqual([
        { slot: 1, regNo: 'mp07sj6212', color: 'blue' },
        { slot: 2, regNo: 'mp07sj6213', color: 'red' }
      ]);
    });
  });

  // Test getting cars by color
  describe('Getting Cars by Color', () => {
    it('should return registration numbers of cars by color', () => {
      parkingLot.parkCar(new Car('MP07SJ6212', 'Blue'));
      parkingLot.parkCar(new Car('MP07SJ6213', 'Blue'));
      parkingLot.parkCar(new Car('MP07SJ6214', 'Red'));

      const blueCars = parkingLot.getRegNosByColor('Blue');
      expect(blueCars).toHaveLength(2);
      expect(blueCars).toContain('mp07sj6212');
      expect(blueCars).toContain('mp07sj6213');
    });

    it('should throw error when no cars found with color', () => {
      expect(() => parkingLot.getRegNosByColor('Yellow'))
        .toThrow(NotFoundException);
    });
  });

  // Test getting slot by registration number
  describe('Getting Slot by Registration Number', () => {
    it('should return correct slot number for registration number', () => {
      const car = new Car('MP07SJ6212', 'Blue');
      const slot = parkingLot.parkCar(car);
      expect(parkingLot.getSlotByRegNo('MP07SJ6212')).toBe(slot);
    });

    it('should return null for non-existent registration number', () => {
      expect(parkingLot.getSlotByRegNo('MP07SJ6212')).toBeNull();
    });
  });

  // Test expanding parking lot
  describe('Expanding Parking Lot', () => {
    it('should expand parking lot by specified size', () => {
      const newSize = parkingLot.expand(2);
      expect(newSize).toBe(5);
      expect(parkingLot.getAvailableCount()).toBe(5);
    });

    it('should throw error for invalid expansion size', () => {
      expect(() => parkingLot.expand(0)).toThrow(BadRequestException);
      expect(() => parkingLot.expand(-1)).toThrow(BadRequestException);
    });
  });
}); 