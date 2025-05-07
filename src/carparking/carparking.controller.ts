// src/carparking/carparking.controller.ts
import { Controller, Post, Get, Patch, Param, Body, Query, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
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
    return { 
      message: `Parking lot - ${dto.id} has been successfully created with ${dto.size} slots`,
      lotId: dto.id,
      totalSlots: dto.size
    }; // Success response
  }

  @ApiOperation({ summary: 'Expand an existing parking lot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Parking lot expanded successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Patch(':id/expand') // Endpoint to expand a parking lot
  @UsePipes(new ValidationPipe())
  expand(@Param('id') id: string, @Body('size') size: number) {
    const totalSlots = this.service.expandLot(id, size);
    return { 
      message: `Parking lot - ${id} has been expanded by ${size} slots`,
      lotId: id,
      totalSlots: totalSlots
    }; // Return new total slots
  }

  @ApiOperation({ summary: 'Park a car in the parking lot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 201, description: 'Car parked successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @ApiResponse({ status: 400, description: 'No available slots' })
  @Post(':id/park') // Endpoint to park a car
  @UsePipes(new ValidationPipe())
  park(@Param('id') id: string, @Body() dto: ParkDto) {
    const slot = this.service.park(id, dto.regNo, dto.color);
    return { 
      message: `Car with registration number ${dto.regNo} has been successfully parked at slot ${slot}`,
      lotId: id,
      slot: slot,
      regNo: dto.regNo,
      color: dto.color
    }; // Return allocated slot
  }

  @ApiOperation({ summary: 'Free a parking slot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Slot freed successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot or slot not found' })
  @Post(':id/free') // Endpoint to free a slot
  @UsePipes(new ValidationPipe())
  free(@Param('id') id: string, @Body() dto: FreeSlotDto) {
    this.service.free(id, dto.slot); // Free the slot
    return { 
      message: `Slot ${dto.slot} in parking lot ${id} has been successfully freed`,
      lotId: id,
      slot: dto.slot
    }; // Success response
  }

  @ApiOperation({ summary: 'Get parking lot status' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Returns occupied slots' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Get(':id/status') // Endpoint to get occupied slots
  status(@Param('id') id: string) {
    const occupied = this.service.getStatus(id);
    return { 
      message: `Current status of parking lot ${id}`,
      lotId: id,
      totalOccupied: occupied.length,
      occupied: occupied
    }; // Return occupied slots
  }

  @ApiOperation({ summary: 'Get registration numbers by car color' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiQuery({ name: 'color', description: 'Color of the car' })
  @ApiResponse({ status: 200, description: 'Returns list of registration numbers' })
  @ApiResponse({ status: 404, description: 'Parking lot not found or no cars found with the specified color' })
  @Get(':id/regnos') // Endpoint to get regNos by color
  regNosByColor(@Param('id') id: string, @Query('color') color: string) {
    const regNos = this.service.getRegNosByColor(id, color);
    return { 
      message: `Found ${regNos.length} car(s) with color ${color} in parking lot ${id}`,
      lotId: id,
      color: color,
      regNos: regNos
    }; // Return regNos
  }

  @ApiOperation({ summary: 'Get parking slots by car color' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiQuery({ name: 'color', description: 'Color of the car' })
  @ApiResponse({ status: 200, description: 'Returns list of parking slots' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Get(':id/slots') // Endpoint to get slots by color
  slotsByColor(@Param('id') id: string, @Query('color') color: string) {
    const slots = this.service.getSlotsByColor(id, color);
    return { 
      message: `Found ${slots.length} slot(s) occupied by cars with color ${color} in parking lot ${id}`,
      lotId: id,
      color: color,
      slots: slots
    }; // Return slots
  }

  @ApiOperation({ summary: 'Get parking slot by registration number' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiQuery({ name: 'regNo', description: 'Registration number of the car' })
  @ApiResponse({ status: 200, description: 'Returns parking slot number' })
  @ApiResponse({ status: 404, description: 'Car not found in parking lot' })
  @Get(':id/slot') // Endpoint to get slot by regNo
  slotByRegNo(@Param('id') id: string, @Query('regNo') regNo: string) {
    const slot = this.service.getSlotByRegNo(id, regNo);
    return { 
      message: `Car with registration number ${regNo} is parked at slot ${slot} in parking lot ${id}`,
      lotId: id,
      regNo: regNo,
      slot: slot
    }; // Return slot
  }

  @ApiOperation({ summary: 'Get count of cars by color for a specific parking lot' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns counts of cars by color for the specified parking lot',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'number'
      },
      example: {
        "white": 5,
        "red": 2,
        "blue": 3
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Get(':id/count_by_color') // Endpoint to get color-based counts for a specific lot
  getColorCounts(@Param('id') id: string) {
    const counts = this.service.getColorCounts(id);
    return {
      message: `Color-based car counts for parking lot ${id}`,
      lotId: id,
      counts: counts
    };
  }

  @ApiOperation({ summary: 'Delete a parking lot by ID' })
  @ApiParam({ name: 'id', description: 'Parking lot ID' })
  @ApiResponse({ status: 200, description: 'Parking lot deleted successfully' })
  @ApiResponse({ status: 404, description: 'Parking lot not found' })
  @Delete(':id')
  deleteLot(@Param('id') id: string) {
    this.service.deleteLot(id);
    return {
      message: `Parking lot ${id} has been deleted successfully`,
      lotId: id
    };
  }
}

export default CarParkingController;