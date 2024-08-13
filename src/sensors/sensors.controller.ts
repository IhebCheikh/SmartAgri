import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';
import { Sensor } from './interfaces/sensor.interface';
import { SensorData } from './interfaces/sensor-data.interface';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  async create(@Body() createSensorDto: CreateSensorDto): Promise<Sensor> {
    return this.sensorsService.create(createSensorDto);
  }

  @Get()
  async findAll(): Promise<Sensor[]> {
    return this.sensorsService.findAll();
  }

  @Post('data')
  async addSensorData(
    @Body() createSensorDataDto: CreateSensorDataDto,
  ): Promise<SensorData> {
    return this.sensorsService.addSensorData(createSensorDataDto);
  }

  @Get('data/:sensorId')
  async getSensorData(
    @Param('sensorId') sensorId: string,
  ): Promise<SensorData[]> {
    return this.sensorsService.getSensorData(sensorId);
  }
}
