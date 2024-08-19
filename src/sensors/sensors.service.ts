import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor } from './interfaces/sensor.interface';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorData } from './interfaces/sensor-data.interface';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel('Sensor') private readonly sensorModel: Model<Sensor>,
    @InjectModel('SensorData')
    private readonly sensorDataModel: Model<SensorData>,
  ) {}
  async createe(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const newSensor = new this.sensorModel(createSensorDto);
    return newSensor.save();
  }
  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...sensorData } = createSensorDto; // Exclure l'ID du DTO
    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().exec();
  }

  async findOne(id: string): Promise<Sensor> {
    return this.sensorModel.findById(id).exec();
  }

  async update(id: string, sensorData: Partial<Sensor>): Promise<Sensor> {
    try {
      const updatedSensor = await this.sensorModel.findByIdAndUpdate(
        id,
        sensorData,
        { new: true },
      );
      if (!updatedSensor) {
        throw new Error('Sensor not found');
      }
      return updatedSensor;
    } catch (error) {
      // Handle errors, including E11000 duplicate key error
      console.error('Error updating sensor:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<Sensor> {
    return this.sensorModel.findByIdAndDelete(id).exec();
  }
}
