import express from "express";
import * as dynamoose from "dynamoose";
import { monotonicFactory } from "ulid";
import { Dog } from "./model/dog";

const app = express();
const ulidFactory = monotonicFactory();

export const getUlid = () => ulidFactory(Date.now());

const connection = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId: "asdfasdf",
    secretAccessKey: "asdfasdf"
  },
  endpoint: "http://localhost:8000",
  region: "us-east-2"
});

dynamoose.aws.ddb.set(connection);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/list_dogs", async (req, res) => {
  const dogs = await Dog.scan().exec();

  return res.json(dogs);
});

app.delete("/remove_dog/:dogId/:rangeKeyId", async (req, res) => {
  const { dogId, rangeKeyId } = req.params;

  await Dog.delete({ dogId, sortProp: rangeKeyId });
  return res.json(true);
});

app.put("/update_dog_name", async (req, res) => {
  const { dogId, rangeKeyId, newName } = req.body;

  await Dog.update({
    dogId,
    sortProp: rangeKeyId
  }, { dogName: newName });
  return res.json(true);
})

app.post("/create_dog", async (req, res) => {
  const { name, brand, age } = req.body;

  const dog = new Dog({
    dogName: name,
    dogBrand: brand,
    dogAge: parseInt(age),
  });

  await dog.save();
  return res.json(true);
});

app.get("/search_dog/:prop/:value", async (req, res) => {
  const { prop, value } = req.params;

  const payload = await Dog
    .scan(prop)
    .contains(value)
    .exec();

  return res.json(payload);
})

app.listen(3000, async () => {
  console.log("app is running...")
});