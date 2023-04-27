/* eslint-disable @typescript-eslint/ban-types */
import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import firebase from 'firebase-admin';
import { MembersWorkplace } from '../interfaces/bodyRequestWorkplace';
import { ICommentToSave, IPostToSave } from '../interfaces/IPostToSave';
import { IScore } from '../interfaces/IScore';
import { calculateScore, getTotalScore } from './score-utils';

export interface ITagsAgregationDoc {
  [tag: string]: ITagsAgregation;
}

export interface ITagsAgregation {
  message: string;
  tag_name: string;
}

export interface IGroups {
  group_name: string;
}

export interface IEvaluation {
  0: object;
  1: object;
  2: object;
  3: object;
}

export interface IEvalConfirm {
  postid: number;
  created: any;
}

export const saveGenericPost = async (
  postToSave: IPostToSave,
): Promise<void> => {
  const docRef = firestore().collection('posts').doc(postToSave.id);
  const { collab, message_tag, id, filters, created_time } = postToSave;

  await docRef.set({
    collab,
    filters,
    message_tag,
    id,
    created_time: firebase.firestore.Timestamp.fromDate(created_time),
  });
};

export const updateGenericPost = async (
  postToSave: IPostToSave,
  evalu: IEvalConfirm,
): Promise<void> => {
  const docRef = firestore().collection('posts').doc(postToSave.id);
  const { collab, message_tag, id, filters } = postToSave;
  await docRef.update({
    collab,
    message_tag,
    filters,
    id,
    created_time: evalu.created,
  });
};

export const saveGenericComment = async (
  commentToSave: ICommentToSave,
): Promise<void> => {
  const docRef = firestore().collection('comments').doc();
  const { collab, message_tag, id, post_id, filters, created_time } =
    commentToSave;
  await docRef.set({
    collab,
    filters,
    message_tag,
    id,
    post_id,
    created_time: firebase.firestore.Timestamp.fromDate(created_time),
  });
};

export const updateGenericComment = async (
  commentToSave: ICommentToSave,
  evalu: IEvalConfirm,
): Promise<void> => {
  const docRef = firestore().collection('comments').doc(`${evalu.postid}`);
  const { collab, message_tag, id, post_id, filters } = commentToSave;
  await docRef.update({
    collab,
    message_tag,
    filters,
    id,
    post_id,
    created_time: evalu.created,
  });
};

export const saveLocale = async (name: string): Promise<void> => {
  const docRef = firestore().collection('locales').doc(name);
  await docRef.set({ name });
};

export const updateLocale = async (LocaleId: string): Promise<void> => {
  const docRef = firestore().collection('locales').doc(LocaleId);
  const thisLocale = await docRef.get();
  const { name } = thisLocale.data();

  await docRef.update({ name });
};

export const checkLocale = async (name: string): Promise<boolean> => {
  const docRef = await firestore()
    .collection('locales')
    .where('name', '==', name)
    .get();
  if (docRef.empty) {
    return false; // locale não existe
  }
  return true;
};

export const checkDepartment = async (name: string): Promise<boolean> => {
  const docRef = await firestore()
    .collection('departments')
    .where('name', '==', name)
    .get();
  if (docRef.empty) {
    return false; // department não existe
  }
  return true; // department existe
};

export const saveDepartment = async (
  name: string,
  hashScore: IScore,
): Promise<void> => {
  const docRef = firestore().collection('departments').doc(name);
  await docRef.set({ name, score: hashScore });
};

export const updateDepartment = async (
  DepartmentId: string,
  hashScore: IScore,
): Promise<void> => {
  const docRef = firestore().collection('departments').doc(DepartmentId);
  const thisDepartment = await docRef.get();
  const { name, score } = thisDepartment.data();

  const scoreToSave = calculateScore(score, hashScore);

  console.log('scoreToSave', scoreToSave);

  await docRef.update({ name, score: scoreToSave });
};

export const wasEvaluated = async (id: string): Promise<IEvalConfirm> => {
  const docRef = await firestore().collection('posts');
  const posts = await docRef.get();
  const nonEvaluatedObject: IEvalConfirm = {
    postid: 0,
    created: 0,
  };
  posts.forEach(post => {
    if (post.data().post_data.id === id) {
      const obj: IEvaluation = post.data().evaluations;
      nonEvaluatedObject.postid = post.data().id;
      nonEvaluatedObject.created = post.data().post_data.created_time;
    }
  });
  return nonEvaluatedObject;
};

export const checkGroup = async (groupId: string, tag: string): Promise<boolean> => {
  const docRef = await firestore()
    .collection('aggregations')
    .doc('validations')
    .get();

  const groups = docRef.data().groups;
  const groupExists = groups.find(group => group.tag === tag);

  if (groupExists && groupExists.id === groupId) {
    return true; // tudo certo
  } else if (!groupExists) {
    return true;
  }

  return false;
};

export const getAllValidTags = async (): Promise<any> => {
  const docRef = await firestore()
    .collection('aggregations')
    .doc('validations')
    .get();

  return docRef.data().tags
}

export const checkTag = async (tag: any): Promise<any> => {
  const docRef = await firestore()
    .collection('aggregations')
    .doc('validations')
    .get();

  const tags = docRef.data().tags.map(tagF => {
    // console.log({ id: tagF.id, score: tagF.score });
    return { id: tagF.id, score: tagF.score, name: tagF.name };
  });

  // console.log(tags);
  let tagexists;

  if (tag.type == 'user') {
    return { exists: true, score: 0, type: 'user', id: tag.id, tagexists: tag };
  } else {
    tagexists = tags.find(tagName => tagName.name === tag.name.toLowerCase());
  }

  console.log(`Tag: ${tag} existe? ${tagexists}`); // tagexist tem que ser vazia/undefined se a tag não existir

  if (tagexists != undefined) {
    return { exists: true, score: tagexists.score, tagexists, type: 'hashtag' }; // existe
  }

  // return false;//não existe
  return { exists: false, score: 0, type: undefined }; // não existe
};

export const getStore = async (store: string): Promise<void> => {
  const docRef = firestore().collection('aggregations');
  const storesField = await docRef
    .where('stores', 'array-contains', store)
    .get();
  if (storesField.empty) {
    const docRefToSave = firestore().collection('aggregations').doc('filters');
    await docRefToSave.update({
      stores: firestore.FieldValue.arrayUnion(store),
    });
  }
};

export const getCompanies = async (company: string): Promise<void> => {
  const docRef = firestore().collection('aggregations');
  const companiesField = await docRef
    .where('companies', 'array-contains', company)
    .get();
  if (companiesField.empty) {
    const docRefToSave = firestore().collection('aggregations').doc('filters');
    await docRefToSave.update({
      companies: firestore.FieldValue.arrayUnion(company),
    });
  }
};

export const checkUser = async (userId: string): Promise<boolean> => {
  const docRef = await firestore().collection('members').doc(userId);

  const doc = await docRef.get();
  if (!doc.exists) {
    return false; // usuario não existe
  }
  return true; // usuario existe
};

export const saveUser = async (userToSave: MembersWorkplace): Promise<MembersWorkplace> => {
  const docRef = firestore().collection('members').doc(userToSave.id);

  const totalScore = getTotalScore(userToSave.score);

  await docRef.set({ ...userToSave, totalScore });

  return userToSave;
};

export const updateUser = async (
  userToSave: MembersWorkplace,
): Promise<MembersWorkplace> => {
  const docRef = firestore().collection('members').doc(userToSave.id);
  const thisUser = await docRef.get();
  const currentScore = thisUser.data().score;

  if(currentScore.hasOwnProperty("daycoval")){

    console.log("TEM A CHAVE DAYCOVAL NO OBJ" + JSON.stringify(currentScore));

  } else {
    console.log("NÃO TEM A CHAVE DAYCOVAL NO OBJ" + JSON.stringify(currentScore));

    currentScore.daycoval = 0;

    console.log("AGORA TEM " + JSON.stringify(currentScore));
  }

  console.log("CURRENT SCORE " + "Tipo: " + typeof(currentScore) + " - "+   JSON.stringify(currentScore))
  console.log("USER TO SAVE " + JSON.stringify(userToSave.score))

  const scoreToSave = calculateScore(currentScore, userToSave.score);
  const totalScore = getTotalScore(scoreToSave);
  console.log('total score: ', totalScore);

  userToSave = {
    ...userToSave,
    score: scoreToSave,
  };

  await docRef.update({
    ...userToSave,
    totalScore,
  });

  console.log('docref totalScore: ', totalScore);

  return userToSave;
};

export const updateGeneralScore = async (hashScore: IScore): Promise<void> => {
  const docRef = firestore().collection('aggregations').doc('validations');
  const document = await docRef.get();
  const tagsToUpdate = document.data().tags;

  for (let tag of tagsToUpdate) {
    if (tag.name === '#thanks') {
      tag.score += hashScore.thanks;
    } else if (tag.name === '#original') {
      tag.score += hashScore.original;
    } else if (tag.name === '#artista') {
      tag.score += hashScore.artista;
    } else if (tag.name === '#melhoria') {
      tag.score += hashScore.melhoria;
    } else if (tag.name === '#credencial') {
      tag.score += hashScore.credencial;
    } else if (tag.name === '#daycoval') {
      tag.score += hashScore.daycoval;
    }
  }

  await docRef.update({
    tags: tagsToUpdate,
  });
};

export const getUser = async (id: string): Promise<MembersWorkplace> => {
  const docRef = firestore().collection('members').doc(id);
  const doc = await docRef.get();

  const user: MembersWorkplace = {
    ...doc.data(),
  };

  return user;
};
