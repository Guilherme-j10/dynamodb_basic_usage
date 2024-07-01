import * as dynamoose from "dynamoose";
import { getUlid } from "..";

const DogSchema = new dynamoose.Schema({
  dogId: {
    type: String,
    hashKey: true,
    default: () => getUlid()
  },
  dogName: {
    type: String,
    required: true
  },
  dogBrand: {
    type: String,
    required: true
  },
  sortProp: {
    type: String,
    rangeKey: true,
    default: () => getUlid()
  },
  dogAge: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const Dog = dynamoose.model('Dog', DogSchema, {
  throughput: "ON_DEMAND"
});

export { Dog };