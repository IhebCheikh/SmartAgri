import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorRequest } from './schemas/sensorRequest.schema';

@Injectable()
export class SensorRequestsService {
  constructor(
    @InjectModel(SensorRequest.name) private readonly sensorRequestModel: Model<SensorRequest>,
  ) {}

  async createRequest(requestData: any) {
    const { _id, ...requestDataa } = requestData;
    const request = new this.sensorRequestModel(requestDataa);
    return request.save();
  }

  async findAll() {
    return this.sensorRequestModel.find().exec();
  }

  async findByUser(userId: string): Promise<SensorRequest[]> {
    return this.sensorRequestModel.find({ userId }).exec();
  }
  async updateStatus(id: string, status: string) {
    const request = await this.sensorRequestModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  async deleteRequest(id: string) {
    const result = await this.sensorRequestModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return { message: `Request with ID ${id} has been deleted` };
  }
}
