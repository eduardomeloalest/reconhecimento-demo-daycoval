/* eslint-disable consistent-return */
import express, { Request, Response } from 'express';
import {
  getGroupInformation,
  getInforUserGraphApi,
  getPostInformation,
} from '../utils/graph-utils';
import { getUserInfo } from '../utils/scim-utils';
import { checkTag, checkGroup, getAllValidTags } from '../utils/firebase-utils';
import {
  BodyRequestWorkplace,
  MembersWorkplace,
} from '../interfaces/bodyRequestWorkplace';
import { postHandler } from './postHandler';
import { IScore } from '../interfaces/IScore';
import { ICommentToSave, IPostToSave } from '../interfaces/IPostToSave';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  console.log('GET request from webhook started');
  if (req.query['hub.mode'] === 'subscribe') {
    res.status(202).send(req.query['hub.challenge']);
  } else {
    res.status(203).send('Request not allowed');
  }
});

app.post('/', async (req: Request, res: Response) => {
  const { body } = req;
  const entry = body.entry[0];
  const { value, field } = entry.changes[0];

  console.log(value.message)
  if (!value.message) return res.end(); // mensagem do post
  if (field !== "posts" && field !== "comments") return res.end();


  const message = value.message.toLowerCase();
  const targeType = value.target_type; // group ou event
  const { verb } = value; // add, edit, delete

  const isFieldPost = field === 'posts';// se é um post
  const isFieldComment = field === 'comments' // se é um comentario

  // const isGroupTargetType = targeType === 'group'; // se foi postado no grupo
  // tipo de acao
  const isAddVerb = verb === 'add';
  const isEditVerb = verb === 'edit';

  value.message = value.message.trim();
  value.message = value.message.replace('# ', '')
  const hasHashtags = value.message.indexOf('#') > -1
  if (!hasHashtags) return res.end();

  // const validGroup = await checkGroup(entry.id);

  let validHashTag = false;
  let hasTagUser = false;
  let usersToThanksId = [];
  let hashScore: IScore = {
    thanks: 0,
    thanksOffered: 0,
    thanksReceived: 0,
    original: 0,
    artista: 0,
    melhoria: 0,
    credencial: 0,
    daycoval: 0,
  };

  let hashtags = [];

  let userToSave: MembersWorkplace;
  userToSave = {
    score: hashScore,
  };

  let validGroup = false;
  const validTags = await getAllValidTags();
  for (let tag of validTags) {
    if (message.indexOf(tag.name) > -1) {
      validGroup = await checkGroup(entry.id, tag.name);
      userToSave.score[tag.name.slice(1)] = 1;
      validHashTag = true;
      hashtags.push(tag);

      break;
    }
  }
  console.log('USER SCORE', userToSave.score);

  if (value.message_tags !== undefined) {
    for (let user of value.message_tags) {
      hasTagUser = true;
      if (user.type == 'user') {
        usersToThanksId.push(user.id);
      }
    }
  }

  /*
  for (let i = 0; i < value.message_tags.length; i += 1) {
    console.log('message_tags id, value\n');
    console.log(value.message_tags[i]);
    const isTrue = await checkTag(value.message_tags[i]);
    if (isTrue.exists) {
      hashtags.push(isTrue.tagexists);
      validHashTag = true;
      let oneTag = true;
      if (isTrue?.type != 'user' && oneTag) {
        oneTag = false;
        if (isTrue.tagexists.name === '#melhoria') {
          userToSave.score.melhoria = 1;
        } else if (isTrue.tagexists.name === '#thanks') {
          userToSave.score.thanks = 1;
          userToSave.score.thanksOffered = 1;
        } else if (isTrue.tagexists.name === '#original') {
          userToSave.score.original = 1;
        } else if (isTrue.tagexists.name === '#artista') {
          validGroup = await checkGroup(entry.id, isTrue.tagexists.name);
          userToSave.score.artista = 1;
        } else {
          validGroup = await checkGroup(entry.id, isTrue.tagexists.name);
          userToSave.score.credencial = 1;
        }
      } else if (isTrue?.type == 'user') {
        hasTagUser = true;
        usersToThanksId.push(isTrue.id);
      }
    }
  }
  */

  if (isFieldComment && userToSave.score.thanks == 0) return res.end();

  const postInformation = await getPostInformation(value.post_id);

  const isInvalid =
    !postInformation ||
    !validHashTag ||
    !validGroup ||
    !(isAddVerb || isEditVerb) ||
    !value.message ||
    !hasHashtags

  if (isInvalid) {
    console.log('invalid');
    console.log(postInformation);
    console.log(validHashTag);
    console.log(validGroup); // TO DO
    console.log(isAddVerb || isEditVerb);
    console.log(value.message);
    return res.end();
  }
  console.log('Body of requisition:', JSON.stringify(body));

  const userInformation: any = await getInforUserGraphApi(value.from.id);
  console.log('passei aqui 1');
  console.log(userInformation);

  const userAdd = await getUserInfo(value.from.id);
  console.log('passei aqui 2');

  userToSave = {
    ...userToSave,
    id: userInformation.id,
    name: userInformation.name,
    department: userInformation.department
      ? userInformation.department
      : 'Sem Departamento',
    locale: userAdd.addresses
      ? userAdd.addresses[0].formatted
      : 'Sem Localização',
    title: userInformation.title ? userInformation.title : '',
    status: userInformation.active,
  };

  let usersToThanks: MembersWorkplace[] = [];
  if (hasTagUser && userToSave.score.thanks > 0) {
    for (let userThanksId of usersToThanksId) {
      // não é possível dar thanks para vc mesmo
      if (userThanksId != userToSave.id) {
        const userInformation: any = await getInforUserGraphApi(userThanksId);
        console.log(userInformation);

        const userAdd = await getUserInfo(userThanksId);
        console.log('passei aqui 3');

        const score = {
          thanks: 1,
          thanksOffered: 0,
          thanksReceived: 1,
          original: 0,
          artista: 0,
          melhoria: 0,
          credencial: 0,
          daycoval: 0,
        };

        const userThanksToSave: MembersWorkplace = {
          id: userInformation.id,
          name: userInformation.name,
          department: userInformation.department
            ? userInformation.department
            : 'Sem Departamento',
          locale: userAdd.addresses
            ? userAdd.addresses[0].formatted
            : 'Sem Localização',
          title: userInformation.title ? userInformation.title : '',
          status: userInformation.active,
          score,
        };
        userToSave.score.thanksOffered += 1;

        console.log('User thanks: ' + userThanksToSave);

        usersToThanks.push(userThanksToSave);
      }
    }
  } else if (userToSave.score.thanks > 0) {
    return res.end();
  }

  console.log('hashScore para salvar ' + hashScore);

  let postOrCommentToSave: IPostToSave | ICommentToSave;
  if (isFieldPost) {
    postOrCommentToSave = {
      id: value.post_id,
      created_time: new Date(value.created_time),
      filters: {
        locale: userAdd.addresses
          ? userAdd.addresses[0].formatted
          : 'Sem Localização',
        department: userInformation.department
          ? userInformation.department
          : 'Sem Departamento',
      },
      message_tag: hashtags,
      collab: value.from.name,
    };

  } else if (isFieldComment) {
    postOrCommentToSave = {
      id: value.comment_id,
      post_id: value.post_id,
      created_time: new Date(value.created_time),
      filters: {
        locale: userAdd.addresses
          ? userAdd.addresses[0].formatted
          : 'Sem Localização',
        department: userInformation.department
          ? userInformation.department
          : 'Sem Departamento',
      },
      message_tag: hashtags,
      collab: value.from.name
    }
  }

  await postHandler(verb, postOrCommentToSave, userToSave, usersToThanks, isFieldComment);

  return res.send(postOrCommentToSave);
});

if (require.main === module) {
  app.listen(5000, '0.0.0.0', () => {
    console.log('Running server at http://localhost:5000');
  });
}

export default app;
