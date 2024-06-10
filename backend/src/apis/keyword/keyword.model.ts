import {z} from 'zod'

import {sql} from "../../utils/database.utils"

/**
 *
 */
export const KeywordSchema = z.object({
    keywordId: z.string({
        required_error: 'please provide a valid keywordId',
        invalid_type_error: "keywordId is not the correct type"
    })
      .trim()
      .uuid({
          message: 'please provide a valid uuid for keywordId'
      })
      .nullable(),
    keywordName: z.string({
        required_error: 'please provide a valid keywordName',
        invalid_type_error: "keywordName is not the correct type"
    })
      .min(1, {
          message: 'keyword must be at least 1 character long'})
      .max(32, {message: 'keyword must be at most 32 characters long'})
      .trim()
})
export type Keyword = z.infer<typeof KeywordSchema>


/**
 * Inserts a keyword into the keyword table and returns a message to the user indicating success
 * @param keyword to be inserted into the keyword table
 * @returns 'Keyword successfully posted' if the keyword was successfully inserted.
 **/

export async function insertKeyword(keyword: Keyword): Promise<string> {
    // deconstruct the keyword object to get the keywordName
    const { keywordName} = keyword
    // prepare the statement to insert the keyword into the keyword table and execute the statement
    await sql`INSERT INTO keyword (keyword_id, keyword_name) VALUES (gen_random_uuid(), ${keywordName})`

    // return a message to the user indicating success
    return 'Keyword successfully posted'
}

/**
 * Selects a keyword from the keyword table by keywordId and returns the keyword or null if the keyword does not exist
 * @param keywordId the keywordId of the keyword to be selected
 * @returns the keyword that was selected or null if the keyword does not exist
 */
export async function selectKeywordByKeywordId(keywordId: string): Promise<Keyword | null> {
    // prepare the statement to select the keyword by keywordId and execute the statement
    const rowList = <Keyword[]>await sql`SELECT keyword_id, keyword_name FROM keyword WHERE keyword_id = ${keywordId}`

    // enforce that the result is an array of one keyword, or null
    const result = KeywordSchema.array().max(1).parse(rowList)


    // return the keyword or null if no keyword was found
    return result.length === 1 ? result[0] : null
}

/**
 * Selects a keyword from the keyword table by keywordName and returns the keyword or null if the keyword does not exist
 * @param keywordName the keywordName of the keyword to be selected
 * @returns the keyword that was selected or null if the keyword does not exist
 */

export async function selectKeywordByKeywordName(keywordName: string): Promise<Keyword | null> {

    // prepare the statement to select the keyword by keywordName and execute the statement
    const rowList = <Keyword[]>await sql`SELECT keyword_id, keyword_name FROM keyword WHERE keyword_name = ${keywordName}`

    // enforce that the result is an array of one keyword, or an empty array`
    const result = KeywordSchema.array().max(1).parse(rowList)

    // return the keyword or null if no keyword was found
    return result.length === 1 ? result[0] : null
}


/**
 * Selects keywords from the keyword table by keywordName and returns the keywords or an empty array if the keywords do not exist
 * @param keywordName the keywordName of the keywords to be selected
 * @returns the keywords that were selected or an empty array if the keywords do not exist
 */
export async function selectKeywordsByKeywordName(keywordName: string): Promise<Keyword[]> {

    // format the keywordName to include wildcards
    const formattedKeywordName = `%${keywordName}%`

    // prepare the statement to select the keywords by keywordName and execute the statement
    const rowList = <Keyword[]>await sql`SELECT keyword_id, keyword_name FROM keyword WHERE keyword_name LIKE ${formattedKeywordName}`

    // return the keywords or an empty array if no keywords were found
    return KeywordSchema.array().parse(rowList)
}


