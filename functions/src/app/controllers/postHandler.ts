import { AxiosError } from 'axios';
import {
  saveGenericPost,
  updateGenericPost,
  updateLocale,
  updateDepartment,
  saveLocale,
  saveDepartment,
  checkLocale,
  checkDepartment,
  wasEvaluated,
  getStore,
  getCompanies,
  checkUser,
  updateUser,
  updateGeneralScore,
  saveUser,
  getUser,
  saveGenericComment,
} from '../utils/firebase-utils';
import { setBadge } from '../utils/badges-utils';
import { ICommentToSave, IPostToSave } from '../interfaces/IPostToSave';
import { MembersWorkplace } from '../interfaces/bodyRequestWorkplace';
import {
  sendLikeInPostWorkplacePost,
  sendMessageInWorkplacePost,
} from '../utils/graph-utils';
import { calculateScore } from '../utils/score-utils';
import { defineComment } from '../utils/comments-utils';

export async function postHandler(
  verb: string,
  objectToSave: IPostToSave | ICommentToSave,
  userToSave: MembersWorkplace,
  usersThanksToSave: MembersWorkplace[] = undefined,
  isComment: boolean,
): Promise<void> {
  if (verb === 'add') {
    await sendLikeInPostWorkplacePost(objectToSave.id);
    // promises.push(sendMessageInWorkplacePost(postToSave.id, comment));
    const userSaved = await saveData(userToSave);

    let score = userToSave.score;
    let usersThanksSaved: MembersWorkplace[] = [];
    if (usersThanksToSave != undefined) {
      for (let userThanks of usersThanksToSave) {
        score = calculateScore(userToSave.score, userThanks?.score);
        usersThanksSaved.push(await saveData(userThanks));
      }
    }
    if (!isComment) {
      await saveGenericPost(objectToSave);
    } else {
      const commentToSave: ICommentToSave = {
        ...objectToSave,
        post_id: objectToSave['post_id'],
      };
      await saveGenericComment(commentToSave);
    }

    await updateGeneralScore(score);

    // const user = await getUser(userToSave.id);

    const comment = await defineComment(objectToSave, userSaved, usersThanksSaved);
    await sendMessageInWorkplacePost(objectToSave.id, comment);
    // promises.push(getStore(postToSave.filters.store));
    // promises.push(getCompanies(postToSave.filters.company));
  }
}

async function saveData(user: MembersWorkplace) {
  const userExist = await checkUser(user.id);
  const localeExist = await checkLocale(user.locale);
  const departmentExist = await checkDepartment(user.department);

  let userSaved;
  if (userExist) {
    userSaved = await updateUser(user);
    await setBadge(user);
  } else {
    userSaved = await saveUser(user);
  }
  if (localeExist) {
    await updateLocale(user.locale);
  } else {
    await saveLocale(user.locale);
  }
  if (departmentExist) {
    await updateDepartment(user.department, user.score);
  } else {
    await saveDepartment(user.department, user.score);
  }

  return userSaved;
}

function logError(err: Error | AxiosError) {
  console.error('Error in promises');
  const isAxiosErr = (e: any): e is AxiosError => e.isAxiosError;
  if (isAxiosErr(err)) {
    console.error(JSON.stringify(err.response.data));
    console.error(err.request);
  } else {
    console.error(err);
  }
}
