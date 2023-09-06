import { updateTable } from './utils/dom.js';
import { shuffled, randint } from './utils/array.js';
import { sleep } from './utils/sleep.js';
import * as cards from './utils/cards.js';

export const WIN = 0;
export const LOSE = 1;
export const TIE = 2;

const DEALER = 0;
const PLAYER = 1;

const blackjack = {

  dealer: undefined,
  player: undefined,
  cardDeck: undefined,

  reset() {
    this.dealer = {
      hand: [],
      score: 0,
      hasAce: false
    };
    this.player = {
      hand: [],
      score: 0,
      hasAce: false
    };
    this.cardDeck = shuffled(cards.cardDeck);
  },

  hit(person) {
    if (!this.cardDeck.length) {
      return;
    }
    const card = this.cardDeck.pop();
    const player = person === DEALER ? this.dealer : this.player;
    player.hand.push(card);
    player.score += cards.valueOf(card);
    if (cards.isAce(card)) {
      player.hasAce = true;
    }
    return card;
  },

  initialize() {
    this.reset();
    for (const person of [DEALER, PLAYER, DEALER, PLAYER]) {
      this.hit(person);
    }
  }
};

let dealerHandHTML;
let playerHandHTML;

function getHandScoreHTML(person, coverTail, getHigher) {
  const player = person === DEALER ? blackjack.dealer : blackjack.player;
  if (player.score > 21) {
    return 'Bust.';
  }
  if (coverTail) {
    const value = cards.valueOf(player.hand[0]);
    return value === 1 ? '1 / 11' : value;
  }
  if (player.hasAce && player.score + 10 <= 21) {
    if (person === DEALER && player.score + 10 >= 17 || getHigher) {
      return player.score + 10;
    }
    return `${player.score} / ${player.score + 10}`;
  }
  return player.score;
}

export function hit() {
  const card = blackjack.hit(PLAYER);
  playerHandHTML += `
    <img class="card-image" src="images/${card}.svg" alt="${card}">
  `;
  updateTable(undefined, undefined, getHandScoreHTML(PLAYER, false, false), playerHandHTML);
  if (blackjack.player.score > 21) {
    return LOSE;
  }
  return undefined;
}

export async function stand() {
  updateTable(undefined, undefined, getHandScoreHTML(PLAYER, false, true), undefined);
  await sleep(800);
  dealerHandHTML = `
    <img class="card-image"
    src="images/${blackjack.dealer.hand[0]}.svg"
    alt="${blackjack.dealer.hand[0]}">
    <img class="card-image"
    src="images/${blackjack.dealer.hand[1]}.svg"
    alt="${blackjack.dealer.hand[1]}">
  `;
  updateTable(getHandScoreHTML(DEALER, false, false), dealerHandHTML, undefined, undefined);
  const dealer = blackjack.dealer;
  while (dealer.score < 17 && (!dealer.hasAce || (dealer.score < 7 || dealer.score > 11))) {
    await sleep(1500);
    const card = blackjack.hit(DEALER);
    dealerHandHTML += `
      <img class="card-image" src="images/${card}.svg" alt="${card}">
    `;
    updateTable(getHandScoreHTML(DEALER, false, false), dealerHandHTML, undefined, undefined);
  }
  if (dealer.score > 21) {
    return WIN;
  }
  if (dealer.hasAce && dealer.score + 10 <= 21) {
    dealer.score += 10;
  }
  const player = blackjack.player;
  if (player.hasAce && player.score + 10 <= 21) {
    player.score += 10;
  }
  if (dealer.score < player.score) {
    return WIN;
  }
  if (dealer.score > player.score) {
    return LOSE;
  }
  return TIE;
}

export function play() {
  blackjack.initialize();
  dealerHandHTML = `
    <img class="card-image"
    src="images/${blackjack.dealer.hand[0]}.svg"
    alt="${blackjack.dealer.hand[0]}">
    <img class="card-image"
    src="images/${randint(1, 2)}B.svg"
    alt="BACK">
  `;
  playerHandHTML = `
    <img class="card-image"
    src="images/${blackjack.player.hand[0]}.svg"
    alt="${blackjack.player.hand[0]}">
    <img class="card-image"
    src="images/${blackjack.player.hand[1]}.svg"
    alt="${blackjack.player.hand[1]}">
  `;
  updateTable(
    getHandScoreHTML(DEALER, true, false), dealerHandHTML,
    getHandScoreHTML(PLAYER, false, false), playerHandHTML
  );
}
