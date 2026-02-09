import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('Professional Project Management API with real-time capabilities')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Workspaces', 'Workspace management')
    .addTag('Projects', 'Project management')
    .addTag('Tasks', 'Task management')
    .addTag('Activity', 'Analytics and activity feed')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'TaskFlow API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 30px 0 }
    `,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');

  // Setup Swagger documentation
  setupSwagger(app);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    TaskFlow Server                        ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 API:       http://localhost:${port}/api                ║
║  📚 Docs:      http://localhost:${port}/api/docs           ║
║  🔌 WebSocket: ws://localhost:${port}                      ║
╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
