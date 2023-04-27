import axios from 'axios';
import { getEnv } from './secretsManager-utils';
// import { graph, token } from '../../config/env';

export async function sendLikeInPostWorkplacePost(postId: string) {
  const graphApi = axios.create({
    baseURL: await getEnv("graph"),
    headers: { authorization: `Bearer ${await getEnv("token")}` },
  });

  try {
    return await graphApi.post(`${postId}/likes`);
  } catch (e) {
    console.log(e.message);
    return 0;
  }
}

export const sendMessageInWorkplacePost = async (
  postId: string,
  message: string,
) => {

  const graphApi = axios.create({
    baseURL: await getEnv("graph"),
    headers: { authorization: `Bearer ${await getEnv("token")}` },
  });

  try {
    return await graphApi.post(`${postId}/comments`, { message: message });
  } catch (e) {
    console.log(e.message);
    return 0;
  }
};

export async function getInforUserGraphApi(workplace_id: string) {
  const graphApi = axios.create({
    baseURL: await getEnv("graph"),
    headers: { authorization: `Bearer ${await getEnv("token")}` },
  });

  try {
    return await graphApi
      .get(workplace_id, {
        params: {
          fields: 'id,name,email,department,title,division,active',
        },
      })
      .then(res => res.data);
  } catch (e) {
    console.log(e.message);
    return 0;
  }
}

export const getGroupInformation = async (group_id: string) => {
  const graphApi = axios.create({
    baseURL: await getEnv("graph"),
    headers: { authorization: `Bearer ${await getEnv("token")}` },
  });
  try {
    return await graphApi
      .get(group_id, {
        params: {
          fields: 'id,owner,privacy,purpose,name,member_count',
        },
      })
      .then(res => res.data);
  } catch (e) {
    console.log(e.message);
    return 0;
  }
};

export const getPostInformation = async (id_Post: string): Promise<any> => {
  const graphApi = axios.create({
    baseURL: await getEnv("graph"),
    headers: { authorization: `Bearer ${await getEnv("token")}` },
  });
  try {
    return await graphApi.get(id_Post, {
      params: {
        fields: 'from,created_time,link,message,to,id,message_tags',
      },
    });
  } catch (e) {
    console.log(e.message);
    return 0;
  }
};