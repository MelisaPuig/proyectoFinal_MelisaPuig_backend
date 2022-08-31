import mongoose from 'mongoose';

class Mongo {
  async connect(url: string): Promise<boolean> {
    const logError = (message: string) => console.error(message);
    const log = (message: string) => console.log(message);

    const mongooseConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true, // <- Even if it's not recommended for production, it's responsability of the app to index the model.
      autoCreate: true,
      heartbeatFrequencyMS: 10000,
    };

    return new Promise((resolve, reject) => {
      try {
        mongoose.connection.on('connected', () => resolve(true));
        mongoose.connection.on('connecting', () => log('MongoDB connecting...'));
        mongoose.connection.on('open', () => log('MongoDB connected...'));
        mongoose.connection.on('reconnecting', () => log('MongoDB reconnecting...'));
        mongoose.connection.on('reconnected', () => log('MongoDB reconnected...'));
        mongoose.connection.on('error', (err) => logError(err.message));
        mongoose.connection.on('disconnected', () => logError('MongoDB disconnected...'));
        mongoose.connect(url, mongooseConfig, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  getDB(): typeof mongoose.connection.db {
    if (mongoose.STATES[mongoose.connection.readyState] !== 'connected') {
      throw new Error("MongoDB isn't connected.");
    }
    return mongoose.connection.db;
  }

  async close(): Promise<boolean> {
    try {
      if (mongoose.STATES[mongoose.connection.readyState] === 'disconnected') {
        return true;
      }
      await mongoose.connection.close();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new Mongo();
