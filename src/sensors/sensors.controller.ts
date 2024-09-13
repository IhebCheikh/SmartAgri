import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './interfaces/sensor.interface';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  create(@Body() createSensorDto: CreateSensorDto): Promise<Sensor> {
    return this.sensorsService.createSensor(createSensorDto);
  }

  @Get()
  findAll(): Promise<Sensor[]> {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sensor> {
    return this.sensorsService.findOne(id);
  }

  @Get('user/:userId')
  async getUserSensors(@Param('userId') userId: string) {
    return this.sensorsService.findByUser(userId);
  }

  @Post('/toggle-pump/:sensorId')
  async togglePumps(
    @Body() { sensorId, status }: { sensorId: string; status: boolean },
  ) {
    return this.sensorsService.togglePump(sensorId, status);
  }
  @Post('toggle-pump/:sensorId')
  async togglePump(
    @Param('sensorId') sensorId: string,
    @Body() body: { status: boolean },
  ) {
    // Appelle le service pour mettre à jour le statut de la pompe
    const updatedSensor = await this.sensorsService.togglePump(
      sensorId,
      body.status,
    );
    return updatedSensor;
  }
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSensorDto: UpdateSensorDto,
  ): Promise<Sensor> {
    return this.sensorsService.update(id, updateSensorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Sensor> {
    return this.sensorsService.remove(id);
  }
}
