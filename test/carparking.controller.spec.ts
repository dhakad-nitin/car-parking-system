import { Test, TestingModule } from '@nestjs/testing';
import { CarParkingController } from '../src/carparking/carparking.controller';
import { CarParkingService } from '../src/carparking/carparking.service';
import { CreateLotDto } from '../src/carparking/dtos/create-lot.dto';
import { ParkDto } from '../src/carparking/dtos/park.dto';
import { FreeSlotDto } from '../src/carparking/dtos/free-slot.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CarParkingController', () => {
  let controller: CarParkingController;
  let service: CarParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarParkingController],
      providers: [CarParkingService],
    }).compile();

    controller = module.get<CarParkingController>(CarParkingController);
    service = module.get<CarParkingService>(CarParkingService);
  });

  // Test creating parking lot
  describe('create', () => {
    it('should create a new parking lot', () => {
      const dto: CreateLotDto = { id: 'lot1', size: 3 };
      const result = controller.create(dto);
      expect(result).toEqual({
        message: 'Parking lot - lot1 has been successfully created with 3 slots',
        lotId: 'lot1',
        totalSlots: 3
      });
    });

    it('should throw error when creating duplicate lot', () => {
      const dto: CreateLotDto = { id: 'lot1', size: 3 };
      controller.create(dto);
      expect(() => controller.create(dto))
        .toThrow(BadRequestException);
    });
  });

  // Test parking car
  describe('park', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
    });

    it('should park a car and return slot information', () => {
      const dto: ParkDto = { regNo: 'MP07SJ6212', color: 'Blue' };
      const result = controller.park('lot1', dto);
      expect(result).toEqual({
        message: 'Car with registration number MP07SJ6212 has been successfully parked at slot 1',
        lotId: 'lot1',
        slot: 1,
        regNo: 'MP07SJ6212',
        color: 'Blue'
      });
    });

    it('should throw error when parking lot is full', () => {
      service.park('lot1', 'MP07SJ6212', 'Blue');
      service.park('lot1', 'MP07SJ6213', 'Red');
      service.park('lot1', 'MP07SJ6214', 'Green');

      const dto: ParkDto = { regNo: 'MP07SJ6215', color: 'Yellow' };
      expect(() => controller.park('lot1', dto))
        .toThrow(BadRequestException);
    });

    it('should throw error when parking lot does not exist', () => {
      const dto: ParkDto = { regNo: 'MP07SJ6212', color: 'Blue' };
      expect(() => controller.park('nonexistent', dto))
        .toThrow(NotFoundException);
    });
  });

  // Test freeing slot
  describe('free', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
      service.park('lot1', 'MP07SJ6212', 'Blue');
    });

    it('should free a slot and return success message', () => {
      const dto: FreeSlotDto = { slot: 1 };
      const result = controller.free('lot1', dto);
      expect(result).toEqual({
        message: 'Slot 1 in parking lot lot1 has been successfully freed',
        lotId: 'lot1',
        slot: 1
      });
    });

    it('should throw error when freeing non-existent slot', () => {
      const dto: FreeSlotDto = { slot: 2 };
      expect(() => controller.free('lot1', dto))
        .toThrow(BadRequestException);
    });

    it('should throw error when parking lot does not exist', () => {
      const dto: FreeSlotDto = { slot: 1 };
      expect(() => controller.free('nonexistent', dto))
        .toThrow(NotFoundException);
    });
  });

  // Test getting status
  describe('status', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
      service.park('lot1', 'MP07SJ6212', 'Blue');
      service.park('lot1', 'MP07SJ6213', 'Red');
    });

    it('should return parking lot status', () => {
      const result = controller.status('lot1');
      expect(result).toEqual({
        message: 'Current status of parking lot lot1',
        lotId: 'lot1',
        totalOccupied: 2,
        occupied: [
          { slot: 1, regNo: 'mp07sj6212', color: 'blue' },
          { slot: 2, regNo: 'mp07sj6213', color: 'red' }
        ]
      });
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => controller.status('nonexistent'))
        .toThrow(NotFoundException);
    });
  });

  // Test getting slot by registration number
  describe('slotByRegNo', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
      service.park('lot1', 'MP07SJ6212', 'Blue');
    });

    it('should return slot information for registration number', () => {
      const result = controller.slotByRegNo('lot1', 'MP07SJ6212');
      expect(result).toEqual({
        message: 'Car with registration number MP07SJ6212 is parked at slot 1 in parking lot lot1',
        lotId: 'lot1',
        regNo: 'MP07SJ6212',
        slot: 1
      });
    });

    it('should throw error when car not found', () => {
      expect(() => controller.slotByRegNo('lot1', 'MP07SJ6213'))
        .toThrow(NotFoundException);
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => controller.slotByRegNo('nonexistent', 'MP07SJ6212'))
        .toThrow(NotFoundException);
    });
  });

  // Test deleting parking lot
  describe('deleteLot', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
    });

    it('should delete parking lot and return success message', () => {
      const result = controller.deleteLot('lot1');
      expect(result).toEqual({
        message: 'Parking lot lot1 has been deleted successfully',
        lotId: 'lot1'
      });
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => controller.deleteLot('nonexistent'))
        .toThrow(NotFoundException);
    });
  });
}); 