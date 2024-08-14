import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      requireed: [ true, 'Name is required' ],
      unique: true
    },
    available: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Cateogry',
      require: true
    }
  },
  {
    timestamps: true
  }
);

export const ProductModel = mongoose.model( 'Product', ProductSchema );