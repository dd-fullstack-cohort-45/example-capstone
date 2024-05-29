import { z } from 'zod'
import { sql } from '../../utils/database.utils'

/**
 * The shape of the private profile that is only used by express. it must never be returned to the controller.
 * @property profileId {string} the primary key
 * @property profileAbout {string} the profile's about
 * @property profileActivationToken {string|null} the profile's activation token
 * @property profileEmail {string|null} the profile's email
 * @property profileHash {string} the profile's hash
 * @property profileImageUrl {string|null} the profile's image url
 * @property profileName {string} the profile's name
 **/
export const PrivateProfileSchema = z.object({
  profileId: z.string({
    required_error: 'profileId is required',
    invalid_type_error: 'Please provide a valid profileId'
  })
    .uuid({ message: 'please provide a valid profileId' }),
  profileAbout: z.string({
    required_error: 'profile about is a required field.',
    invalid_type_error: 'please provide a valid profile about'
  })
    .max(512, { message: 'profile about length is to long' })
    .nullable(),
  profileActivationToken: z.string({
    required_error: 'profileActivationToken is required',
    invalid_type_error: 'please provide a valid profileActivationToken'
  })
    .length(32, { message: 'profile activation token is to long' })
    .nullable(),
  profileEmail: z.string({
    required_error: 'profileEmail is required',
    invalid_type_error: ' please provide a valid profileEmail'
  })
    .email({ message: 'please provide a valid email' })
    .max(128, { message: 'profileEmail is to long' }),
  profileHash: z.string({
    required_error: 'profileHash is required',
    invalid_type_error: 'please provide a valid profileHash'
  })
    .length(97, { message: 'profile hash must be 97 characters' }),
  profileImageUrl: z.string({
    required_error: 'profileImage is required',
    invalid_type_error: 'please provide a valid profileImageUrl'
  })
    .trim()
    .url({ message: 'please provide a valid profile image url' })
    .max(255, { message: 'profile image url is to long' })
    .nullable(),
  profileName: z.string()
    .trim()
    .min(1, { message: 'please provide a valid profile name (min 1 characters)' })
    .max(32, { message: 'please provide a valid profile name (max 32 characters)' })
})
export type PrivateProfile = z.infer<typeof PrivateProfileSchema>


/**
 * The shape of the public profile that can shared with Next.js
 * @property profileId {string} the primary key
 * @property profileAbout {string} the profile's about
 * @property profileEmail {string|null} the profile's email
 * @property profileImageUrl {string|null} the profile's image url
 * @property profileName {string} the profile's name
 **/

export const PublicProfileSchema = PrivateProfileSchema.omit({profileHash: true, profileActivationToken: true, profileEmail: true})
export type PublicProfile = z.infer<typeof PublicProfileSchema>






/**
 * updates a profile in the profile table
 * @param profile
 * @returns {Promise<string>} 'Profile successfully updated'
 */
export async function updateProfile (profile: PrivateProfile): Promise<string> {
  const { profileId, profileAbout, profileActivationToken, profileEmail, profileHash, profileImageUrl, profileName } = profile
  await sql`UPDATE profile SET profile_about = ${profileAbout}, profile_activation_token = ${profileActivationToken}, profile_email = ${profileEmail}, profile_hash = ${profileHash}, profile_image_url = ${profileImageUrl}, profile_name = ${profileName} WHERE profile_id = ${profileId}`
  return 'Profile successfully updated'
}

/**
 * Selects the privateProfile from the profile table by profileEmail
 * @param profileEmail  the profile's email to search for in the profile table
 * @returns Profile or null if no profile was found
 */
export async function selectPrivateProfileByProfileEmail (profileEmail: string): Promise<PrivateProfile | null> {

  // create a prepared statement that selects the profile by profileEmail and execute the statement
  const rowList =  await sql`SELECT profile_id, profile_about, profile_activation_token, profile_email, profile_hash, profile_image_url, profile_name FROM profile WHERE profile_email = ${profileEmail}`

  //enforce that the result is an array of one profile, or null
  const result = PrivateProfileSchema.array().max(1).parse(rowList)

  // return the profile or null if no profile was found
  return result?.length === 1 ? result[0] : null
}

/**
 * selects the publicProfile from the profile table by profileId
 * @param profileId the profile's id to search for in the profile table
 * @returns Profile or null if no profile was found
 **/
export async function selectPublicProfileByProfileId (profileId: string): Promise<PublicProfile | null> {

  // create a prepared statement that selects the profile by profileId and execute the statement
  const rowList = await sql`SELECT profile_id, profile_about, profile_image_url, profile_name FROM profile WHERE profile_id = ${profileId}`

  // enforce that the result is an array of one profile, or null
    const result = PublicProfileSchema.array().max(1).parse(rowList)

  // return the profile or null if no profile was found
  return  result?.length === 1 ? result[0] : null
}


/**
 * selects the privateProfile from the profile table by profileId
 * @param profileId the profile's id to search for in the profile table
 * @returns PrivateProfile or null if no profile was found
 */
export async function selectPrivateProfileByProfileId(profileId: string): Promise<PrivateProfile | null> {

  // create a prepared statement that selects the profile by profileId and execute the statement
  const rowList = await sql`SELECT profile_id, profile_about, profile_activation_token, profile_email, profile_hash, profile_image_url, profile_name FROM profile WHERE profile_id = ${profileId}`

// enforce that the result is an array of one profile, or null
  const result = PrivateProfileSchema.array().max(1).parse(rowList)

  // return the profile or null if no profile was found
  return result?.length === 1 ? result[0] : null
}

/**
 * selects the publicProfile from the profile table by profileName
 * @param profileName the profile's name to search for in the profile table
 * @returns {PublicProfile | null} if no profile was found
 */
export async function selectPublicProfileByProfileName(profileName: string): Promise<PublicProfile | null> {

      // create a prepared statement that selects the profile by profileName and execute the statement
      const rowList = await sql`SELECT profile_id, profile_about, profile_image_url, profile_name FROM profile WHERE profile_name = ${profileName}`

      // enforce that the result is an array of one profile, or null
      const result = PublicProfileSchema.array().max(1).parse(rowList)

      // return the profile or null if no profile was found
      return result?.length === 1 ? result[0] : null
}

/**
 * selects a list of profiles from the profile table by profileName
 * @param profileName the profile's name to search for in the profile table
 * @returns an array of profiles
 **/

export async function selectPublicProfilesByProfileName(profileName: string): Promise<PublicProfile[]> {

  // format profileName to include wildcards
  const profileNameWithWildcards = `%${profileName}%`

  // create a prepared statement that selects profiles by profileName and execute the statement
  const rowList = await sql`SELECT profile_id, profile_about, profile_image_url, profile_name FROM profile WHERE profile_name LIKE ${profileNameWithWildcards}`

  return PublicProfileSchema.array().parse(rowList)
}


/**
 * Inserts a new profile into the profile table
 * @param profile the profile to insert
 * @returns "profile successfully created"
 */
export async function insertProfile (profile: PrivateProfile): Promise<string> {

  //
  const { profileAbout, profileActivationToken, profileEmail, profileHash, profileImageUrl, profileName } = profile
  await sql`INSERT INTO profile(profile_id, profile_about, profile_activation_token, profile_email, profile_hash, profile_image_url, profile_name) VALUES (gen_random_uuid() , ${profileAbout}, ${profileActivationToken}, ${profileEmail}, ${profileHash}, ${profileImageUrl}, ${profileName})`
  return 'Profile Successfully Created'
}

/**
 * Selects a profile from the profile table by profileActivationToken
 * @param profileActivationToken the profile's activation token to search for in the profile table
 * @returns Profile or null if no profile was found
 */
export async function selectPrivateProfileByProfileActivationToken (profileActivationToken: string): Promise<PrivateProfile|null> {

  const rowList = await sql`SELECT profile_id, profile_about, profile_activation_token, profile_email, profile_hash, profile_image_url, profile_name FROM profile WHERE profile_activation_token = ${profileActivationToken}`
  const result = PrivateProfileSchema.array().max(1).parse(rowList)
  return result?.length === 1 ? result[0] : null
}