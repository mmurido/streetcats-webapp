import { z } from 'zod'

// Title: required, 5–300 chars
export const titleSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Title is required',
    })
    return
  }

  if (value.length < 5) {
    ctx.addIssue({
      code: 'custom',
      message: 'Title must be at least 5 characters',
    })
    return
  }

  if (value.length > 300) {
    ctx.addIssue({
      code: 'custom',
      message: 'Title must be at most 300 characters',
    })
  }
})

// Images: array of File objects, at least 1 and at most 10
export const imagesSchema = z
  .array(z.instanceof(File))
  .superRefine((files, ctx) => {
    if (!files || files.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one image is required',
      })
      return
    }

    if (files.length > 10) {
      ctx.addIssue({
        code: 'custom',
        message: 'You can upload up to 10 images only',
      })
    }
  })

// Location: must contain coordinates AND display name
export const locationSchema = z
  .object({
    lat: z.number(),
    lng: z.number(),
    display_name: z.string(),
  })
  .superRefine((loc, ctx) => {
    if (
      loc.lat === undefined ||
      loc.lng === undefined ||
      Number.isNaN(loc.lat) ||
      Number.isNaN(loc.lng)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Valid coordinates are required',
      })
    }
    if (!loc.display_name) {
      ctx.addIssue({
        code: 'custom',
        message: 'Location name is required',
      })
    }
  })

// Description: required, 10–2000 chars
export const descriptionSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Description is required',
    })
    return
  }

  if (value.length < 10) {
    ctx.addIssue({
      code: 'custom',
      message: 'Description must be at least 10 characters',
    })
    return
  }

  if (value.length > 2000) {
    ctx.addIssue({
      code: 'custom',
      message: 'Description must be at most 2000 characters',
    })
  }
})

// Final form schema
export const createPostSchema = z.object({
  title: titleSchema,
  images: imagesSchema,
  location: locationSchema,
  description: descriptionSchema,
})

export type CreatePostData = z.infer<typeof createPostSchema>
