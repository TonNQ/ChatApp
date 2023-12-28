import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
const mongoose = require('mongoose');
import { accessibleRecordsPlugin } from '@casl/mongoose';
import MongoosePaginate = require('mongoose-paginate-v2');
import MongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
import socketIO from 'socket.io';
import http from 'http';
import { initSocket } from './socket';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private server: http.Server;
  private io: socketIO.Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 5000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    // this.initializeSwagger();
    this.initializeErrorHandling();

    // create http server and socket.io instance
    this.server = http.createServer(this.app);
    this.io = new socketIO.Server(this.server);
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });

    initSocket(this.server);
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    MongoosePaginate.paginate.options = {
      lean: false,
      limit: 100,
    };
    mongoose.plugin(accessibleRecordsPlugin);
    mongoose.plugin(MongoosePaginate);
    mongoose.plugin(MongooseAggregatePaginate);
    if (this.env !== 'production') {
      mongoose.set('debug', true);
    }

    mongoose.connect(dbConnection.url, dbConnection.options, () => {});
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(
      hpp({
        whitelist: ['filter', 'sort'],
      }),
    );
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      }),
    );
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use('/public', (req, res, next) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    });
    this.app.use('/public', express.static(__dirname + '/public'));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.1',
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
        servers: [{ url: 'http://localhost:5000/' }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      // apis: ['swagger.yaml'],
      apis: ['./src/routes/*.ts', './src/models/*.ts'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
