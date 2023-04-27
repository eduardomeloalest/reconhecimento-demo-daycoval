import { MembersWorkplace } from "../interfaces/bodyRequestWorkplace";
import { IPostToSave } from "../interfaces/IPostToSave";
import { IScore } from "../interfaces/IScore";
import { getUser } from "./firebase-utils";

export async function defineComment(postToSave: IPostToSave, userSaved: MembersWorkplace, userThanks: MembersWorkplace[] = undefined): Promise<string> {

    let comment: string;
    for (let message of postToSave.message_tag) {
        if (message.name == '#credencial') {
            comment = `Parabéns! Você já tirou ${userSaved.score.credencial} credenciais!`
        } else if (message.name == '#melhoria') {
            comment = `Parabéns! Você já propôs ${userSaved.score.melhoria} melhorias(s) para o seu time!`
        } else if (message.name == '#artista') {
            comment = `Parabéns! Você já foi ${userSaved.score.artista} vezes artista aqui na Alest!`
        } else if (message.name == '#original') {
            comment = `Parabéns! Você já foi ${userSaved.score.original} vezes original aqui na Alest!`
        } else if (message.name == '#thanks' && userThanks.length != 0) {
            const mentionThankedPeople = await mentionAllThankedPeople(userThanks);
            comment = `Uhu! A sua thanks foi recebida. Continue agradecendo ;)\n @[${userSaved.id}] já enviou ${userSaved.score.thanksOffered} thanks!\n ${mentionThankedPeople}`
        } else if (message.name == '#daycoval') {
            console.log("AQUIIIIIIIIIIIIIII " + "- " + typeof userSaved.score.daycoval)
            comment = `Hastag funcionando e contabilizando, score: ${userSaved.score.daycoval}`
        }
    }
    return comment;
}

export async function mentionAllThankedPeople(usersThanks: MembersWorkplace[]) {

    let message: string = '';
    for (let userThanks of usersThanks) {
        // const user = await getUser(userThanks.id);
        message += `@[${userThanks.id}] já recebeu ${userThanks.score.thanksReceived} thanks!\n`
    }

    return message;
}