export class Car {
    constructor(
      public regNo: string,
      public color: string,
    ) {
      this.regNo = regNo.toLowerCase();
      this.color = color.toLowerCase();
    }
  
    toJSON() {
      return {
        regNo: this.regNo,
        color: this.color,
      };
    }
  }