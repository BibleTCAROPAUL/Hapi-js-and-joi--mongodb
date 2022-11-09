const Hapi = require("hapi");
const Mongoose = require("mongoose");
const Joi = require("joi");
const { required } = require("joi");

const server = new Hapi.Server({ "host": "localhost", "port": 3000 });
//DB CONNECTION
Mongoose.connect('mongodb://0.0.0.0:27017/apolloapi', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('CONNECTED TO MONGO!');
    })
    .catch((err) => {
        console.log('OH NO! MONGO CONNECTION ERROR!');
        console.log(err);
    })

//SCHEMA
const PersonModel = Mongoose.model("person", {
    project_name :String,
    description:String,
    consumer_name:String,
    id:Number
    
});

//GET

server.route({
    method: "GET",
    path: "/p",
   
    handler: async (request, h) => {
        try {
            var person = await PersonModel.find().exec();
            return h.response(person);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

    server.start();
    console.log('Connected to PORT 3000...');

