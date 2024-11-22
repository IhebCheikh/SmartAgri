import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SensorRequest extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: 'pending' }) // 'pending', 'accepted', 'rejected'
  status: string;

  @Prop()
  userId: string; // L'utilisateur ayant fait la demande
}

export const SensorRequestSchema = SchemaFactory.createForClass(SensorRequest);
