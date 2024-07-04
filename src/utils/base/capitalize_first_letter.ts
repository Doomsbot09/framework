/**
 * Capitalizes the first letter of a given word.
 * @param word The word to capitalize.
 * @returns The word with its first letter capitalized.
 */
export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
