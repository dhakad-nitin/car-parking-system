// src/carparking/entities/car.entity.ts
export class Car {
    // Constructor to initialize a Car with registration number and color
    constructor(
      public regNo: string, // Registration number of the car
      public color: string, // Color of the car
    ) {
      this.regNo = regNo.toLowerCase(); // Convert regNo to lowercase for consistency
      this.color = color.toLowerCase(); // Convert color to lowercase for consistency
    }
  
    // Method to convert Car instance to JSON for serialization
    toJSON() {
      return {
        regNo: this.regNo,
        color: this.color,
      };
    }
  }