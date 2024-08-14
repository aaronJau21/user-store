import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      requireed: [ true, 'Name is required' ]
    },
    available: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
  }
);


export const CategoryModel = mongoose.model( 'Cateogry', CategorySchema );