import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const logger = new Logger('Main');

async function bootstrap() {
  /*
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
   new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
   })
  )
  await app.listen( envs.PORT );
  logger.log(`Server is running on ${await app.getUrl()}`);
  */

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT
      }
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
     whitelist: true,
     forbidNonWhitelisted: true
    })
  );
  logger.log(`Microservice is running on port ${envs.PORT}`)
  await app.listen();
}
bootstrap();
