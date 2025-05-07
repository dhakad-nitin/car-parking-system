// src/carparking/carparking.controller.ts
import { Controller, Post, Get, Patch, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CarParkingService } from './carparking.service';
import { CreateLotDto } from './dtos/create-lot.dto';
import { ParkDto } from './dtos/park.dto';
import { FreeSlotDto } from './dtos/free-slot.dto';

@ApiTags('Car Parking')
@Controller('carparking') // Base route for all endpoints
export class CarParkingController {
  constructor(private readonly service: CarParkingService) {} // Inject the service

  @ApiOperation({ summary: 'Create a new parking lot' })
  @ApiResponse({ status: 201, description: 'Parking lot created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post('create') // Endpoint to create a parking lot
  @UsePipes(new ValidationPipe()) // Validate incoming data
  create(@Body() dto: CreateLotDto) {
    this.service.createLot(dto.id, dto.size); // Create the lot
    return { message: `Lot ${dto.id} created with ${dto.size} slots` }; // Success response
  }

  @ApiOperation({ summary: 'Expand an existing parking lot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Parking lot expanded successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Patch(':id/expand') // Endpoint to expand a parking lot
  @UsePipes(new ValidationPipe())
  expand(@Param('id') id: string, @Body('size') size: number) {
    return { totalSlots: this.service.expandLot(id, size) }; // Return new total slots
  }

  @ApiOperation({ summary: 'Park a car in the parking lot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 201, description: 'Car parked successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @ApiResponse({ status: 400, description: 'No available slots' })
  @Post(':id/park') // Endpoint to park a car
  @UsePipes(new ValidationPipe())
  park(@Param('id') id: string, @Body() dto: ParkDto) {
    return { slot: this.service.park(id, dto.regNo, dto.color) }; // Return allocated slot
  }

  @ApiOperation({ summary: 'Free a parking slot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Slot freed successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot or slot not found' })
  @Post(':id/free') // Endpoint to free a slot
  @UsePipes(new ValidationPipe())
  free(@Param('id') id: string, @Body() dto: FreeSlotDto) {
    this.service.free(id, dto.slot); // Free the slot
    return { message: `Slot ${dto.slot} freed` }; // Success response
  }

  @ApiOperation({ summary: 'Get parking lot status' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Returns occupied slots' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Get(':id/status') // Endpoint to get occupied slots
  status(@Param('id') id: string) {
    return { occupied: this.service.getStatus(id) }; // Return occupied slots
  }

  @ApiOperation({ summary: 'Get registration numbers by car color' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiQuery({ name: 'color', description: 'Color of the car' })
  @ApiResponse({ status: 200, description: 'Returns list of registration numbers' })
  @ApiResponse({ status: 404, description: 'Parking lot not found or no cars found with the specified color' })
  @Get(':id/regnos') // Endpoint to get regNos by color
  regNosByColor(@Param('id') id: string, @Query('color') color: string) {
    return { regNos: this.service.getRegNosByColor(id, color) }; // Return regNos
  }

  @ApiOperation({ summary: 'Get parking slots by car color' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiQuery({ name: 'color', description: 'Color of the car' })
  @ApiResponse({ status: 200, description: 'Returns list of parking slots' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Get(':id/slots') // Endpoint to get slots by color
  slotsByColor(@Param('id') id: string, @Query('color') color: string) {
    return { slots: this.service.getSlotsByColor(id, color) }; // Return slots
  }

  @ApiOperation({ summary: 'Get parking slot by registration number' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiQuery({ name: 'regNo', description: 'Registration number of the car' })
  @ApiResponse({ status: 200, description: 'Returns parking slot number' })
  @ApiResponse({ status: 404, description: 'Car not found in parking lot' })
  @Get(':id/slot') // Endpoint to get slot by regNo
  slotByRegNo(@Param('id') id: string, @Query('regNo') regNo: string) {
    return { slot: this.service.getSlotByRegNo(id, regNo) }; // Return slot
  }
}

export default CarParkingController;