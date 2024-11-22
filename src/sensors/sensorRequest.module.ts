import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorRequestsController } from './sensorRequests.controller';
import { SensorRequestsService } from './sensorRequests.service';
import { SensorRequest, SensorRequestSchema } from './schemas/sensorRequest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SensorRequest.name, schema: SensorRequestSchema }]),
  ],
  controllers: [SensorRequestsController],
  providers: [SensorRequestsService],
})
export class SensorRequestsModule {}
