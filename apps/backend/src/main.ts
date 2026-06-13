import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Temporarily disable session and passport middleware to test core functionality
  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET || 'your-session-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: 3600000,
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //     },
  //   }),
  // );

  // app.use(passport.initialize());
  // app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
