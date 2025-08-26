import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for GraphQL Playground
  app.enableCors();

  await app.listen(4000);
}

void bootstrap();
