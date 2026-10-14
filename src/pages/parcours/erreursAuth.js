// Messages d'erreur Supabase Auth en français (repli : message d'origine).
export function messageErreurAuth(error) {
  const message = error?.message ?? ''
  if (/invalid login credentials/i.test(message)) return 'Email ou mot de passe incorrect.'
  if (/already registered|already exists/i.test(message)) return 'Un compte existe déjà avec cet email : connecte-toi.'
  if (/password should be at least/i.test(message)) return 'Mot de passe trop court : 6 caractères minimum.'
  if (/email not confirmed/i.test(message)) return 'Confirme ton adresse email avant de te connecter.'
  if (/invalid email|unable to validate email/i.test(message)) return 'Adresse email invalide.'
  return message
}
