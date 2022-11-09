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


    

//POST

server.route({
    method: "POST",
    path: "/person",
    options: {
        validate: {}
    },
    handler: async (request, h) => {
        try {
            var person = new PersonModel(request.payload);
            var result = await person.save();
            return h.response(result);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

//GET

server.route({
    method: "GET",
    path: "/people/{id}",
    options:{
    validate: {
        payload: {
            projectname: Joi.string().required,
            description: Joi.string().required,
            consumername: Joi.string().required,
            id:Joi.number().required
        }  
        },
        failAction: (request, h, error) => {
            return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover();
        }
    },
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

