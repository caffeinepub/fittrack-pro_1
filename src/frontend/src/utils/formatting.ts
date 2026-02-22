/**
 * Capitalizes the first letter of each word in a string.
 * Used for displaying muscle group names consistently throughout the app.
 * @param text - The text to capitalize
 * @returns The capitalized text
 */
export function capitalizeText(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
