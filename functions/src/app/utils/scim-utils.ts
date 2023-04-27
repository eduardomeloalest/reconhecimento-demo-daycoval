import axios from 'axios';
import { getEnv } from './secretsManager-utils';

export async function getUserInfo(collab_id: string): Promise<any> {
 
  return axios
    .get(`Users/${collab_id}`, {
      baseURL: await getEnv("scim"),
      headers: {
        Authorization: `Bearer ${await getEnv("token")}`,
        'User-Agent': 'reconhecimento-alest',
      },
    })
    .then(res => res.data)
    .catch(error => {
      console.log(error.message);
      return error.response;
    });
}
