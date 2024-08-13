import { Schema } from 'mongoose';

export const SensorSchema = new Schema({
  bd: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
});

export const SensorDataSchema = new Schema({
  sensorId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  light: { type: Number, required: true },
});
