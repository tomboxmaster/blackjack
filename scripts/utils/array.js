export function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

export function shuffled(array) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const j = randint(i, array.length - 1);
    result.push(array[j]);
    swap(array, i, j);
  }
  return result;
}
