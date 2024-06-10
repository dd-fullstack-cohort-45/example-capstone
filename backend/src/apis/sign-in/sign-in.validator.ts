import { z } from 'zod'

/**
 * The shape of the data that comes from the client when signing in
 * @property profilePassword {string} the password
 * @property profileEmail {string} the email
 */
export const signInProfileSchema = z.object({
  profilePassword: z.string().min(8, { message: 'please provide a valid password (min 8 characters)' }).max(32, { message: 'please provide a valid password (max 32 characters)' }),
  profileEmail: z.string().email({ message: 'please provide a valid email' }).max(128, { message: 'please provide a valid email (max 128 characters)' })
})
