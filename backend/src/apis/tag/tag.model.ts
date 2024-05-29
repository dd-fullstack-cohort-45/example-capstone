import {z} from 'zod'
import {sql} from "../../utils/database.utils";


/**
 * the shape of a tag object in the database and the API
 * @property tagkeywordId {string} foreign key of the keyword that is being tagged
 * @property tagThreadId {string} foreign key of the thread that is being tagged
 **/

export const TagSchema = z.object({
  tagKeywordId: z.string({
    required_error: 'please provide a valid tagKeywordId',
    invalid_type_error: 'tagKeywordId is not the correct type'
  })
    .uuid({message: 'please provide a valid uuid for tagKeywordId'}),
  tagThreadId: z.string({
    required_error: "please provide a valid tagThreadId",
    invalid_type_error: "tagThreadId is not the correct type"
  })
    .uuid({message: 'please provide a valid uuid for tagThreadId'})
})
// the shape of a tag object in the database and the API
export type Tag = z.infer<typeof TagSchema>

/**
 * inserts a tag into the tag table
 * @param tag object containing the tag information that is being inserted into the tag table
 * @returns {Promise<string>} a message indicating success
 **/
export async function insertTag(tag: Tag): Promise<string> {

       // deconstruct the tag object
        const {tagKeywordId, tagThreadId} = tag

        // prepare the tag to be inserted into the tag table and execute the statement
        await sql`INSERT INTO tag (tag_keyword_id, tag_thread_id)
                VALUES (${tagKeywordId}, ${tagThreadId})`

    // return a message to the user indicating success
        return 'Tag successfully posted'
}

/**
 * selects tags by tagThreadId from the tag table
 * @param tagThreadId the thread id to search for in the tag table
 * @returns {Promise<Tag[]>} an array of tags or an empty array
 **/

export async function selectTagsByTagThreadId(tagThreadId: string): Promise<Tag[]> {
    //prepare a statement to select the tags by tagThreadId and execute the statement
    const rowList = await sql`SELECT tag_keyword_id, tag_thread_id FROM tag WHERE tag_thread_id = ${tagThreadId}`

    // enforce that the result is an array of tags and return the array
    return TagSchema.array().parse(rowList)
}

/**
 * selects tags by tagKeywordId from the tag table
 * @param tagKeywordId the keyword id to search for in the tag table
 * @returns {Promise<Tag[]>} an array of tags or an empty array
 **/

export async function selectTagsByTagKeywordId(tagKeywordId: string): Promise<Tag[]> {

    //prepare a statement to select the tags by tagKeywordId and execute the statement
    const rowList = await sql`SELECT tag_keyword_id, tag_thread_id FROM tag WHERE tag_keyword_id = ${tagKeywordId}`

    // enforce that the result is an array of tags and return the array
    return TagSchema.array().parse(rowList)
}


/**
 * selects a  tag by tagKeywordId and tagThreadId from the tag table
 * @param tagKeywordId the keyword id to search for in the tag table
 * @param tagThreadId the thread id to search for in the tag table
 * @returns {Promise<Tag | null>} a tag or null
 **/
export async function selectTagByTagKeywordIdAndTagThreadId(tagKeywordId: string, tagThreadId: string): Promise<Tag | null> {
    // prepare a statement to select the tag by tagKeywordId and tagThreadId and execute the statement

    const rowList = await sql`SELECT tag_keyword_id, tag_thread_id FROM tag WHERE tag_keyword_id = ${tagKeywordId} AND tag_thread_id = ${tagThreadId}`

    // enforce that the result is an array of one tag, or null
    const result = TagSchema.array().max(1).parse(rowList)

    // return the tag or null if no tag was found
    return result?.length === 1 ? result[0] : null
}


/**
 * deletes a tag by tagKeywordId and tagThreadId from the tag table
 * @param tagKeywordId the keyword id to search for in the tag table
 * @param tagThreadId the thread id to search for in the tag table
 * @returns {Promise<string>} a message indicating success
 *
 */

export async function deleteTagByTagKeywordIdAndTagThreadId(tagKeywordId: string, tagThreadId: string): Promise<string> {

    // prepare a statement to delete the tag by tagKeywordId and tagThreadId and execute the statement
    await sql`DELETE FROM tag WHERE tag_keyword_id = ${tagKeywordId} AND tag_thread_id = ${tagThreadId}`

    // return a message to the user indicating success
    return 'Tag successfully deleted'
}