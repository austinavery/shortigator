import mongoose, { Schema, Document } from "mongoose";

export interface URLRequest {
  fullURL: string;
}

export interface URLMetaOutput extends Document, URLRequest {
  shortURL: string;
}

const URLSchema = new Schema({
  fullURL: {
    type: String,
    required: true,
  },
  shortURL: {
    type: String,
    required: true,
  },
});

export const URLMeta = mongoose.model<URLMetaOutput>("URL", URLSchema);
