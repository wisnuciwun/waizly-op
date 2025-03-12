export function capitalizeFirstLetter(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (char: string) {
    return char.toUpperCase();
  });
}

export function specialCapitalizeFirstLetter(str: string): string {
  let words: string[] = str.split(' ');

  for (let i = 0; i < words.length; i++) {
    if (words[i].toUpperCase() === 'DKI') {
      words[i] = 'DKI';
      if (i + 1 < words.length) {
        words[i + 1] =
          words[i + 1].charAt(0).toUpperCase() +
          words[i + 1].slice(1).toLowerCase();
      }
    } else {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
  }

  return words.join(' ');
}
