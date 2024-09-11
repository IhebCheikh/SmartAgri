import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './interfaces/sensor.interface';

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
  @Get('user')
  getUserSensors(@Req() req) {
    const userId = req.user._id;
    return this.sensorsService.getUserSensors(userId);
  }

  @Post('/toggle-pump')
  async togglePump(
    @Body() { sensorId, status }: { sensorId: string; status: boolean },
  ) {
    return this.sensorsService.togglePump(sensorId, status);
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
