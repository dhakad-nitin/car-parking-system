// src/carparking/carparking.controller.ts
import { Controller, Post, Get, Patch, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarParkingService } from './carparking.service';
import { CreateLotDto } from './dtos/create-lot.dto';
import { ParkDto } from './dtos/park.dto';
import { FreeSlotDto } from './dtos/free-slot.dto';

@Controller('carparking') // Base route for all endpoints
export class CarParkingController {
  constructor(private readonly service: CarParkingService) {} // Inject the service

  @Post('create') // Endpoint to create a parking lot
  @UsePipes(new ValidationPipe()) // Validate incoming data
  create(@Body() dto: CreateLotDto) {
    this.service.createLot(dto.id, dto.size); // Create the lot
    return { message: `Lot ${dto.id} created with ${dto.size} slots` }; // Success response
  }

  @Patch(':id/expand') // Endpoint to expand a parking lot
  @UsePipes(new ValidationPipe())
  expand(@Param('id') id: string, @Body('size') size: number) {
    return { totalSlots: this.service.expandLot(id, size) }; // Return new total slots
  }

  @Post(':id/park') // Endpoint to park a car
  @UsePipes(new ValidationPipe())
  park(@Param('id') id: string, @Body() dto: ParkDto) {
    return { slot: this.service.park(id, dto.regNo, dto.color) }; // Return allocated slot
  }

  @Post(':id/free') // Endpoint to free a slot
  @UsePipes(new ValidationPipe())
  free(@Param('id') id: string, @Body() dto: FreeSlotDto) {
    this.service.free(id, dto.slot); // Free the slot
    return { message: `Slot ${dto.slot} freed` }; // Success response
  }

  @Get(':id/status') // Endpoint to get occupied slots
  status(@Param('id') id: string) {
    return { occupied: this.service.getStatus(id) }; // Return occupied slots
  }

  @Get(':id/regnos') // Endpoint to get regNos by color
  regNosByColor(@Param('id') id: string, @Query('color') color: string) {
    return { regNos: this.service.getRegNosByColor(id, color) }; // Return regNos
  }

  @Get(':id/slots') // Endpoint to get slots by color
  slotsByColor(@Param('id') id: string, @Query('color') color: string) {
    return { slots: this.service.getSlotsByColor(id, color) }; // Return slots
  }

  @Get(':id/slot') // Endpoint to get slot by regNo
  slotByRegNo(@Param('id') id: string, @Query('regNo') regNo: string) {
    return { slot: this.service.getSlotByRegNo(id, regNo) }; // Return slot
  }
}