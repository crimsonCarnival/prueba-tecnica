import { app } from './app';
import { env } from './config/environment';
import { initializeDatabase } from './database/connection';

async function bootstrap(): Promise<void> {
  await initializeDatabase();
  console.log('Base de datos inicializada');

  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
