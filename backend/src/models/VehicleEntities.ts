import { IVehicleAction } from "../interfaces/AppInterfaces";

export class BaseVehicle implements IVehicleAction {
    constructor(
        public brand: string,
        public model: string,
        public vin: string,
        public year: number
    ) {}

    getFullDescription(): string {
        return `${this.brand} ${this.model} (${this.year}) - VIN: ${this.vin}`;
    }

    calculateTax(): number {
        return 150; 
    }
}

export class ElectricVehicle extends BaseVehicle {
    constructor(
        brand: string, 
        model: string, 
        vin: string, 
        year: number,
        public batteryCapacity: number = 60 
    ) {
        super(brand, model, vin, year);
    }

    getFullDescription(): string {
        return `⚡ EV: ${this.brand} ${this.model} (${this.batteryCapacity}kWh)`;
    }

    calculateTax(): number {
        return 0; 
    }
}