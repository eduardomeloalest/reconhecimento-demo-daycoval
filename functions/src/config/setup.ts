import * as admin from 'firebase-admin';
import { install } from 'source-map-support';

install();

if (admin.apps.length === 0) admin.initializeApp();
