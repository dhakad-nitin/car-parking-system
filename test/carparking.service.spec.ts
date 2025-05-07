import { Test, TestingModule } from '@nestjs/testing';
import { CarParkingService } from '../src/carparking/carparking.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CarParkingService', () => {
  let service: CarParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarParkingService],
    }).compile();

    service = module.get<CarParkingService>(CarParkingService);
  });

  // Test creating parking lots
  describe('createLot', () => {
    it('should create a new parking lot', () => {
      service.createLot('lot1', 3);
      expect(service.getStatus('lot1')).toEqual([]);
    });

    it('should throw error when creating duplicate lot', () => {
      service.createLot('lot1', 3);
      expect(() => service.createLot('lot1', 3))
        .toThrow(BadRequestException);
    });
  });

  // Test parking cars
  describe('park', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
    });

    it('should park a car and return slot number', () => {
      const slot = service.park('lot1', 'MP07SJ6212', 'Blue');
      expect(slot).toBe(1);
    });

    it('should throw error when parking lot is full', () => {
      service.park('lot1', 'MP07SJ6212', 'Blue');
      service.park('lot1', 'MP07SJ6213', 'Red');
      service.park('lot1', 'MP07SJ6214', 'Green');

      expect(() => service.park('lot1', 'MP07SJ6215', 'Yellow'))
        .toThrow(BadRequestException);
    });

    it('should throw error when parking same car twice', () => {
      service.park('lot1', 'MP07SJ6212', 'Blue');
      expect(() => service.park('lot1', 'MP07SJ6212', 'Blue'))
        .toThrow(BadRequestException);
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => service.park('nonexistent', 'MP07SJ6212', 'Blue'))
        .toThrow(NotFoundException);
    });
  });

  // Test freeing slots
  describe('free', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
      service.park('lot1', 'MP07SJ6212', 'Blue');
    });

    it('should free a slot', () => {
      service.free('lot1', 1);
      expect(service.getStatus('lot1')).toEqual([]);
    });

    it('should throw error when freeing non-existent slot', () => {
      expect(() => service.free('lot1', 2))
        .toThrow(BadRequestException);
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => service.free('nonexistent', 1))
        .toThrow(NotFoundException);
    });
  });

  // Test getting status
  describe('getStatus', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
      service.park('lot1', 'MP07SJ6212', 'Blue');
      service.park('lot1', 'MP07SJ6213', 'Red');
    });

    it('should return correct status of parking lot', () => {
      const status = service.getStatus('lot1');
      expect(status).toHaveLength(2);
      expect(status).toEqual([
        { slot: 1, regNo: 'mp07sj6212', color: 'blue' },
        { slot: 2, regNo: 'mp07sj6213', color: 'red' }
      ]);
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => service.getStatus('nonexistent'))
        .toThrow(NotFoundException);
    });
  });

  // Test getting slot by registration number
  describe('getSlotByRegNo', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
      service.park('lot1', 'MP07SJ6212', 'Blue');
    });

    it('should return correct slot for registration number', () => {
      const slot = service.getSlotByRegNo('lot1', 'MP07SJ6212');
      expect(slot).toBe(1);
    });

    it('should return null for non-existent registration number', () => {
      const slot = service.getSlotByRegNo('lot1', 'MP07SJ6213');
      expect(slot).toBeNull();
    });

    it('should throw error when parking lot does not exist', () => {
      expect(() => service.getSlotByRegNo('nonexistent', 'MP07SJ6212'))
        .toThrow(NotFoundException);
    });
  });

  // Test deleting parking lot
  describe('deleteLot', () => {
    beforeEach(() => {
      service.createLot('lot1', 3);
    });

    it('should delete parking lot', () => {
      service.deleteLot('lot1');
      expect(() => service.getStatus('lot1'))
        .toThrow(NotFoundException);
    });

    it('should throw error when deleting non-existent lot', () => {
      expect(() => service.deleteLot('nonexistent'))
        .toThrow(NotFoundException);
    });
  });
}); 