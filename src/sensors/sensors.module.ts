import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { SensorSchema, SensorDataSchema } from './schemas/sensor.schema';
import { SensorRequestsController } from './sensorRequests.controller';
import { SensorRequestsService } from './sensorRequests.service';
import { SensorRequestSchema } from './schemas/sensorRequest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sensor', schema: SensorSchema },
      { name: 'SensorData', schema: SensorDataSchema },
      { name: 'SensorRequest', schema: SensorRequestSchema },
    ]),
  ],
  providers: [SensorsService, SensorRequestsService],
  controllers: [SensorsController, SensorRequestsController],
})
export class SensorsModule {}
