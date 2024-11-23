import { Body, Controller, Get, Post, Patch, Param, Delete } from "@nestjs/common";
import { SensorRequestsService } from './sensorRequests.service';
import { SensorRequest } from "./schemas/sensorRequest.schema";

@Controller('sensor-requests')
export class SensorRequestsController {
  constructor(private readonly sensorRequestsService: SensorRequestsService) {}

  @Post()
  create(@Body() requestData: any) {
    return this.sensorRequestsService.createRequest(requestData);
  }

  @Get()
  findAll() {
    return this.sensorRequestsService.findAll();
  }
  @Get(':userId')
  async getUserSensors(@Param('userId') userId: string) {
    return this.sensorRequestsService.findByUser(userId);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() updateData: { status: string }) {
    console.log(updateData);
    return this.sensorRequestsService.updateStatus(id, updateData.status);
  }
  @Patch('update/:id')
  async updateRequest(
    @Param('id') id: string,
    @Body() updateData: Partial<SensorRequest>
  ): Promise<SensorRequest> {
    return this.sensorRequestsService.updateRequest(id, updateData);
  }
  @Delete(':id')
  deleteRequest(@Param('id') id: string) {
    return this.sensorRequestsService.deleteRequest(id);
  }
}
