import {z} from 'zod'

/**
 * The shape of a like object
 * @property likeProfileId {string} the primary key
 * @property likeThreadId {string} the foreign key
 * @property likeDatetime {Date} the date and time the like was posted
 */
export const LikeSchema = z.object({
    likeProfileId: z.string({required_error: 'please provide a valid likeProfileId'}).uuid({message: 'please provide a valid uuid for likeProfileId'}),
    likeThreadId: z.string({required_error: 'please provide a valid likeThreadId'}).uuid({message: 'please provide a valid uuid for likeThreadId'}),
    likeDatetime: z.date({required_error: 'please provide a valid likeDatetime or null'}).nullable(),
})