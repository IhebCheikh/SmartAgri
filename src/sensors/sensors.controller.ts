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

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserSensorssss(@Req() req): Promise<Sensor[]> {
    const userId = req.user._id; // L'ID utilisateur extrait du token JWT
    console.log('Retrieved User ID:', userId); // Affiche l'ID utilisateur dans les logs
    if (!userId) {
      throw new BadRequestException('User ID is not available');
    }
    return this.sensorsService.getUserSensors(userId);
  }

  @Get('user/:userId')
  async getUserSensors(@Param('userId') userId: string) {
    return this.sensorsService.findByUser(userId);
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
