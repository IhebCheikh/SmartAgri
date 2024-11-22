import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './interfaces/sensor.interface';
import { SensorData } from './interfaces/sensor-data.interface';

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

  @Get('/data/:sensorId')
  async getSensorData(@Param('sensorId') sensorId: string): Promise<SensorData[]> {
    return this.sensorsService.getSensorData(sensorId);
  }

  @Post('toggle-pump/:sensorId')
  async togglePump(
    @Param('sensorId') sensorId: string,
    @Body() body: { status: boolean },
  ) {
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


  // Nouvelle méthode pour récupérer les capteurs avec leurs données et détecter les anomalies
  @Get(':userId/data/detect-anomalyy')
  async getUserSensorsWithAnomalyDetections(@Param('userId') userId: string) {
    const sensorsWithData = await this.sensorsService.getUserSensorsWithData(userId);
    const dataToDetect = sensorsWithData.flatMap((sensorData) => sensorData.data.map(d => [d.temperature, d.humidity, d.light]));
    const anomalies = await this.sensorsService.detectAnomaly(dataToDetect);

    // Associer les anomalies détectées aux capteurs correspondants
    sensorsWithData.forEach((sensorData, index) => {
      sensorData.anomalies = anomalies.slice(index * sensorData.data.length, (index + 1) * sensorData.data.length);
    });

    return sensorsWithData;
  }

  @Get(':userId/detect-anomaly')
  async getUserSensorsWithAnomalyDetection(@Param('userId') userId: string) {
    // Étape 1 : Récupérer les capteurs et leurs données
    const sensorsWithData = await this.sensorsService.getUserSensorsWithData(userId);

    // Étape 2 : Préparer les données pour la détection d'anomalies
    const dataToDetect = sensorsWithData.flatMap((sensorData) =>
      sensorData.data.map((d) => [d.humidity, d.light, d.temperature])
    );

    // Étape 3 : Appeler le service de détection d'anomalies
    const anomalyResult = await this.sensorsService.detectAnomaly(dataToDetect);
    //console.log('anomalyResult', anomalyResult);
    // Récupérer la première clé de l'objet
    const firstKey = Object.keys(anomalyResult)[0];

    // Récupérer la valeur associée à la première clé
    const anomalies = anomalyResult[firstKey];
    //console.log('anomalies', anomalies);

    // Étape 4 : Associer les anomalies aux capteurs correspondants
    sensorsWithData.forEach((sensorData, index) => {
      sensorData.anomalies = anomalies.slice(
        index * sensorData.data.length,
        (index + 1) * sensorData.data.length
      );
    });

    // Retourner les capteurs avec leurs données et les anomalies associées
    return sensorsWithData;
  }

  @Post('detect-anomaly')
  async detectAnomaly(@Body('data') sensorData: number[][]) {
    return this.sensorsService.detectAnomaly(sensorData);
  }

}
