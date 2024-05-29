import { z } from 'zod'
import {PrivateProfileSchema} from '../profile/profile.validator'

/**
 * The shape of the data that comes from the client when signing up
 * @property profilePasswordConfirm {string} the password confirmation
 * @property profilePassword {string} the password
 */
export const SignUpProfileSchema = PrivateProfileSchema
  .omit({ profileId: true, profileHash: true, profileActivationToken: true, profileImageUrl: true, profileAbout: true })
  .extend({
    profilePasswordConfirm: z.string({required_error: "Profile password confirmation is required", invalid_type_error: "Profile password confirmation must be a string"})
      .min(8, { message: 'please provide a valid password (min 8 characters)' })
      .max(32, { message: 'please provide a valid password (max 32 characters)' }),
    profilePassword: z.string({required_error: "Profile password is required", invalid_type_error: "Profile password must be a string"})
      .min(8, { message: 'please provide a valid password (min 8 characters)' })
      .max(32, { message: 'please provide a valid password (max 32 characters)' })
  })
  .refine(data => data.profilePassword === data.profilePasswordConfirm, {
    message: 'passwords do not match'
  })
