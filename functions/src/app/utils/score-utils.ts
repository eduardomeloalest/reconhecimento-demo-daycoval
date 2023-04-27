import { IScore } from '../interfaces/IScore';

export function calculateScore(currentScore: IScore, scoresToSave: IScore) {
  let returnScore: IScore = {
    thanks: 0,
    thanksOffered: 0,
    thanksReceived: 0,
    original: 0,
    artista: 0,
    melhoria: 0,
    credencial: 0,
    daycoval: 0,
  };
  for (let score in scoresToSave) {
    returnScore[score] = scoresToSave[score] + currentScore[score];
  }

  return returnScore;
}

export function getTotalScore(scoresToSave: IScore) {
  let totalScore = 0;

  for (let score in scoresToSave) {
    if (score != 'thanksReceived' && score != 'thanksOffered') {
      totalScore += scoresToSave[score];
    }
  }

  return totalScore;
}
