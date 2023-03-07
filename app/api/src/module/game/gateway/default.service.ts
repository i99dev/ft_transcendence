import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultService {
  private players = [];

  public player1 = {
    login: 'bnaji',
    playerNum: 0,
    username: 'baller',
    score: 0,
    position: {
      x: 0,
      y: 0
    },
    bar: {
      width: 1/120,
      height: 1/4,
    },
    speed: 1/60,
  }

  public player2 = {
    login: 'mal-guna',
    username: 'kaidu',
    score: 0,
    position: {
      x: 0,
      y: 0
    },
    bar: {
      width: 1/120,
      height: 1/4
    },
    speed: 10,
  }

}
