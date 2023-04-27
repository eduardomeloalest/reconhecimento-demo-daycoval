import { firestore } from 'firebase-admin';

const db = firestore();
db.settings({ ignoreUndefinedProperties: true });

export default db;
