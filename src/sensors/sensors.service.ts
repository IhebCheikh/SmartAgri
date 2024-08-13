import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor } from './interfaces/sensor.interface';
import { SensorData } from './interfaces/sensor-data.interface';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel('Sensor') private readonly sensorModel: Model<Sensor>,
    @InjectModel('SensorData')
    private readonly sensorDataModel: Model<SensorData>,
  ) {}

  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const createdSensor = new this.sensorModel(createSensorDto);
    return createdSensor.save();
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().exec();
  }

  async addSensorData(
    createSensorDataDto: CreateSensorDataDto,
  ): Promise<SensorData> {
    const createdSensorData = new this.sensorDataModel(createSensorDataDto);
    return createdSensorData.save();
  }

  async getSensorData(sensorId: string): Promise<SensorData[]> {
    return this.sensorDataModel.find({ sensorId }).exec();
  }
}
