import { Car } from '../src/carparking/entities/car.entity';

describe('Car Entity', () => {
  // Test case for creating a car with valid data
  it('should create a car with valid registration number and color', () => {
    const car = new Car('MP07SJ6212', 'Blue');
    expect(car.regNo).toBe('mp07sj6212'); // Should be converted to lowercase
    expect(car.color).toBe('blue'); // Should be converted to lowercase
  });

  // Test case for toJSON method
  it('should convert car to JSON format', () => {
    const car = new Car('MP07SJ6212', 'Blue');
    const json = car.toJSON();
    expect(json).toEqual({
      regNo: 'mp07sj6212',
      color: 'blue'
    });
  });

  // Test case for case insensitivity
  it('should handle case insensitive registration numbers and colors', () => {
    const car = new Car('MP07SJ6212', 'BLUE');
    expect(car.regNo).toBe('mp07sj6212');
    expect(car.color).toBe('blue');
  });

  // Test case for special characters in registration number
  it('should handle registration numbers with special characters', () => {
    const car = new Car('MP-07-SJ-6212', 'Blue');
    expect(car.regNo).toBe('mp-07-sj-6212');
  });

  // Test case for empty strings
  it('should handle empty strings', () => {
    const car = new Car('', '');
    expect(car.regNo).toBe('');
    expect(car.color).toBe('');
  });
}); 