import {z} from 'zod'
import {sql} from "../../utils/database.utils";
/**
 * The shape of a follow object in the database and the API
 * @property followProfileId {string} foreign key of the profile that is doing the following
 * @property followFollowingId {string} foreign key of the profile that is being followed
 */
export const FollowSchema = z.object({
    followProfileId: z.string({required_error: 'please provide a valid followProfileId'}).uuid({message: 'please provide a valid uuid for followProfileId'}),
    followFollowingProfileId: z.string({required_error: 'please provide a valid followFollowingId'}).uuid({message: 'please provide a valid uuid for followFollowingId'})
})

// The shape of a follow object
export type Follow = z.infer<typeof FollowSchema>

/**
 * inserts a follow into the follow table and returns a message to the user indicating success
 * @param follow to be inserted into the follow table
 * @returns 'Follow successfully posted'
 */
export async function insertFollow(follow: Follow): Promise<string> {

    // deconstruct the follow object
    const {followProfileId, followFollowingProfileId} = follow

    // insert the follow into the follow table
    await sql`INSERT INTO follow (follow_profile_id, follow_following_profile_id)
              VALUES (${followProfileId}, ${followFollowingProfileId})`

    // return a message to the user indicating success
    return 'Follow successfully posted'
}

/**
 * selects a follow from the follow table by followId and returns the follow
 * @param follow to be selected by followId
 * @returns the follow that was selected
 */
export async function selectFollowByFollowId(follow: Follow): Promise<Follow | null> {

    // deconstruct the follow object
    const {followProfileId, followFollowingProfileId} = follow

    // select the follow from the follow table by followId
    const rowList = <Follow[]>await sql`SELECT follow_profile_id, follow_following_profile_id
                                        FROM follow
                                        WHERE follow_profile_id = ${followProfileId}
                                          AND follow_following_profile_id = ${followFollowingProfileId}`

    // parse the result into an array of follows
    const result = FollowSchema.array().max(1).parse(rowList)

    // return the follow that was selected
    return result.length === 0 ? null : result[0]
}

/**
 * deletes a follow from the follow table and returns a message to the user indicating success
 * @param follow to be deleted from the follow table
 * @returns 'Follow successfully deleted'
 */
export async function deleteFollow(follow: Follow): Promise<string> {

    // deconstruct the follow object
    const {followProfileId, followFollowingProfileId} = follow

    // delete the follow from the follow table
    await sql`DELETE
              FROM follow
              WHERE follow_profile_id = ${followProfileId}
                AND follow_following_profile_id = ${followFollowingProfileId}`

    // return a message to the user indicating success
    return 'Follow successfully deleted'
}

/**
 * selects a list of follows for the profiles that the profile is following
 * @param followProfileId the profile id of the profile that is doing the following
 * @returns an array of follows (containing profileIds that the profile is following)
 */
export async function selectFollowsByFollowProfileId(followProfileId: string): Promise<Follow[]> {

    // selects a list of follows for the profiles that the profile is following
    const rowList = <Follow[]>await sql`SELECT follow_profile_id, follow_following_profile_id
                                        FROM follow
                                        WHERE follow_profile_id = ${followProfileId}`

    // parse the result into an array of follows and return it
    return FollowSchema.array().parse(rowList)
}

/**
 * selects a list of follows for the profiles that are following this profile (followFollowingProfileId)
 * @param followFollowingProfileId the profile id of the profile that is being followed
 * @returns an array of follows (containing profileIds that are following this profile - followFollowingProfileId)
 */
export async function selectFollowsByFollowFollowingProfileId(followFollowingProfileId: string): Promise<Follow[]> {

        // selects a list of follows for the profiles that are following this profile (followFollowingProfileId)
        const rowList = <Follow[]>await sql`SELECT follow_profile_id, follow_following_profile_id
                                            FROM follow
                                            WHERE follow_following_profile_id = ${followFollowingProfileId}`

        // parse the result into an array of follows and return it
        return FollowSchema.array().parse(rowList)
}
