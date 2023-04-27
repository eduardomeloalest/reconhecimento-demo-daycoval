import './config/setup';
import * as functions from 'firebase-functions';
import runtimeOpts from './config/firebase';
import app from './app/controllers/webhook';

export const botWorkplace = functions.runWith(runtimeOpts).https.onRequest(app);
