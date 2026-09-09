export function salutation() {
  return new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir'
}
