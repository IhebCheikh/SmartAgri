import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Sensor } from './interfaces/sensor.interface';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorData } from './interfaces/sensor-data.interface';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Types } from 'mongoose';

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

  async createSensorr(dto: CreateSensorDto) {
    const userId = dto.userId; // userId doit être un ObjectId valide
    const sensor = new this.sensorModel({
      ...dto,
      user: new Types.ObjectId(userId),
      //user: new Schema.Types.ObjectId(userId), // Convertir l'ID en ObjectId si nécessaire
    });

    return await sensor.save();
  }
  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...sensorData } = createSensorDto;
    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }
  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...sensorData } = createSensorDto; // Exclure l'ID du DTO

    // Conversion de l'ID utilisateur en ObjectId si ce n'est pas déjà un ObjectId
    if (sensorData.userId && !Types.ObjectId.isValid(sensorData.userId)) {
      throw new Error('Invalid user ID');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sensorData.userId = new Types.ObjectId(sensorData.userId);

    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().exec();
  }

  async findOne(id: string): Promise<Sensor> {
    return this.sensorModel.findById(id).exec();
  }

  async getUserSensors(userId: string): Promise<Sensor[]> {
    return this.sensorModel.find({ user: userId });
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

  async togglePump(sensorId: string, status: boolean): Promise<void> {
    const sensor = await this.sensorModel.findById(sensorId);
    if (sensor) {
      sensor.status = status;
      await sensor.save();
    }
  }
  async remove(id: string): Promise<Sensor> {
    return this.sensorModel.findByIdAndDelete(id).exec();
  }
}
