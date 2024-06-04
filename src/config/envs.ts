import 'dotenv/config'
import * as joi from 'joi'

const envVarsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required()
}).unknown()



const { error, value: envVars } = envVarsSchema.validate(process.env)

if(error){
    throw new Error(`Config validation error: ${error.message}`)
}

export const envs = {
    PORT : envVars.PORT,
    DATABASE_URL : envVars.DATABASE_URL
}