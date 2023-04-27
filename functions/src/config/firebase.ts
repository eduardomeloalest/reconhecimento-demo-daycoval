import { RuntimeOptions } from 'firebase-functions';

const runtimeOpts: RuntimeOptions = {
  timeoutSeconds: 540,
  memory: '4GB',
};

export default runtimeOpts;
