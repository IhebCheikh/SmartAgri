import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor } from './interfaces/sensor.interface';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorData } from './interfaces/sensor-data.interface';
import axios from 'axios';

@Injectable()
export class SensorsService {
  constructor(
    @InjectModel('Sensor') private readonly sensorModel: Model<Sensor>,
    @InjectModel('SensorData')
    private readonly sensorDataModel: Model<SensorData>,
  ) {}

  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const { _id, ...sensorData } = createSensorDto;
    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }

  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const { _id, ...sensorData } = createSensorDto;

    if (sensorData.userId && typeof sensorData.userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    const createdSensor = new this.sensorModel(sensorData);
    return createdSensor.save();
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorModel.find().exec();
  }

  async findOne(id: string): Promise<Sensor> {
    return this.sensorModel.findById(id).exec();
  }

  async findByUser(userId: string): Promise<Sensor[]> {
    return this.sensorModel.find({ userId }).exec();
  }


  async getSensorData(sensorId: string): Promise<SensorData[]> {
    return this.sensorDataModel.find({ sensorId }).exec();
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
      console.error('Error updating sensor:', error);
      throw error;
    }
  }

  async togglePump(sensorId: string, status: boolean): Promise<Sensor> {
    const updatedSensor = await this.sensorModel.findByIdAndUpdate(
      sensorId,
      { status },
      { new: true },
    );

    if (!updatedSensor) {
      throw new Error('Sensor not found');
    }
    return updatedSensor;
  }

  async remove(id: string): Promise<Sensor> {
    return this.sensorModel.findByIdAndDelete(id).exec();
  }

  // Récupère les capteurs de l'utilisateur avec leurs données associées
  async getUserSensorsWithData(userId: string): Promise<any[]> {
    // Récupérer les capteurs en fonction de userId et du type 'Sensor'
    const sensors = await this.sensorModel.find({ userId, type: 'Sensor' }).exec();

    // Récupérer les données associées pour chaque capteur
    const sensorsWithData = await Promise.all(
      sensors.map(async (sensor) => {
        const data = await this.sensorDataModel.find({ sensorId: sensor._id }).exec();
        return { sensor, data };
      })
    );

    return sensorsWithData;
  }
  private flaskUrl = 'http://localhost:5000';

  // Méthode pour détecter les anomalies dans les données
  async detectAnomaly(dataToDetect: number[][]): Promise<any[]> {
    try {
      const response = await axios.post(`${this.flaskUrl}/detect`, { data: dataToDetect });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la détection d'anomalies :", error);
      throw new Error("Échec de la détection d'anomalies.");
    }
  }

}
