/* eslint-disable @typescript-eslint/ban-types */
import { firestore } from 'firebase-admin';
import { MembersWorkplace } from '../interfaces/bodyRequestWorkplace';
import { calculateScore } from './score-utils';
import { getEnv } from './secretsManager-utils';

import axios from 'axios';


export const setBadge = async (userToSave: MembersWorkplace): Promise<void> => {
  
  const docRef = firestore().collection('members').doc(userToSave.id);
  const thisUser = await docRef.get();
  const thisUserID = thisUser.data().id;
  const currentScore = thisUser.data().score;

  const scoreToSave = calculateScore(currentScore, userToSave.score);

  if (scoreToSave.credencial >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231560125577665097`)
      .then(resp => {
        console.log(
          'Foi adicionado a badge Estrela em Ascensão Alest',
          resp.data,
        );
      })
      .catch(error => {
        console.log('Ja tem a badge Estrela em Ascensão Alest');
      });

    if (scoreToSave.credencial >= 5) {
      graphApi
        .post(`${thisUserID}/badges?badge=workplace_custom%231560130120997976`)
        .then(resp => {
          console.log('Foi adicionado a badge Super Estrela Alest', resp.data);
        })
        .catch(error => {
          console.log('Ja tem a badge Super Estrela Alest');
        });
    }
  }

  if (scoreToSave.artista >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231639502763060711`)
      .then(resp => {
        console.log('Foi adicionado a badge Artista Alest', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Artista Alest');
      });
    if (scoreToSave.artista >= 5) {
      graphApi
        .post(`${thisUserID}/badges?badge=workplace_custom%231639504376393883`)
        .then(resp => {
          console.log('Foi adicionado a badge Super Artista Alest', resp.data);
        })
        .catch(error => {
          console.log('Ja tem a badge Super Artista Alest');
        });
    }
  }

  if (scoreToSave.melhoria >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231639505069727147`)
      .then(resp => {
        console.log('Foi adicionado a badge Parceiro Alest', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Parceiro Alest');
      });
    if (scoreToSave.melhoria >= 5) {
      graphApi
        .post(`${thisUserID}/badges?badge=workplace_custom%231639505663060421`)
        .then(resp => {
          console.log('Foi adicionado a badge Super Parceiro Alest', resp.data);
        })
        .catch(error => {
          console.log('Ja tem a badge Super Parceiro Alest');
        });
    }
  }

  if (scoreToSave.thanksOffered >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231639506379727016`)
      .then(resp => {
        console.log('Foi adicionado a badge Amigo Estou Aqui 1', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Amigo Estou Aqui 1');
      });
  }
  if (scoreToSave.thanksReceived >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231639506633060324`)
      .then(resp => {
        console.log('Foi adicionado a badge Amigo Estou Aqui 2', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Amigo Estou Aqui 2');
      });
  }
  if (scoreToSave.thanks >= 5) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231639506816393639`)
      .then(resp => {
        console.log('Foi adicionado a badge Super Amigo Estou Aqui', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Super Amigo Estou Aqui');
      });
  }

  if (scoreToSave.original >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231560123054332016`)
      .then(resp => {
        console.log('Foi adicionado a badge Comunicador Alest', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Comunicador Alest');
      });
    if (scoreToSave.original >= 5) {
      graphApi
        .post(`${thisUserID}/badges?badge=workplace_custom%231560131384331183`)
        .then(resp => {
          console.log(
            'Foi adicionado a badge Super Comunicador Alest',
            resp.data,
          );
        })
        .catch(error => {
          console.log('Ja tem a badge Super Comunicador Alest');
        });
    }
  }

  if (scoreToSave.daycoval >= 3) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231942191639458487`)
      .then(resp => {
        console.log('Foi adicionado a badge Daycoval III', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Daycoval III');
      });
    if (scoreToSave.daycoval >= 5) {
      graphApi
        .post(`${thisUserID}/badges?badge=workplace_custom%231942191962791788`)
        .then(resp => {
          console.log('Foi adicionado a badge Daycoval V', resp.data);
        })
        .catch(error => {
          console.log('Ja tem a badge Daycoval V');
        });
    }
  }

  if (
    scoreToSave.credencial >= 3 &&
    scoreToSave.artista >= 3 &&
    scoreToSave.melhoria >= 3 &&
    scoreToSave.original >= 3 &&
    scoreToSave.thanks >= 3
  ) {
    const graphApi = axios.create({
      baseURL: await getEnv("graph"),
      headers: { authorization: `Bearer ${await getEnv("token")}` },
    });

    graphApi
      .post(`${thisUserID}/badges?badge=workplace_custom%231639507113060276`)
      .then(resp => {
        console.log('Foi adicionado a badge Colecionador Alest', resp.data);
      })
      .catch(error => {
        console.log('Ja tem a badge Colecionador Alest');
      });
  }
};
