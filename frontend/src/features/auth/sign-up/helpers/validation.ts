import { z } from 'zod'

// Username: 3–20 chars, letters, numbers, underscores, no spaces
export const usernameSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Username is required',
    })
    return
  }

  if (value.length < 3) {
    ctx.addIssue({
      code: 'custom',
      message: 'Username must be at least 3 characters',
    })
    return
  }

  if (value.length > 20) {
    ctx.addIssue({
      code: 'custom',
      message: 'Username must be at most 20 characters',
    })
    return
  }

  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Only letters, numbers, and underscores allowed',
    })
  }
})

// Email: basic validation
const emailSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email is required',
    })
    return
  }

  if (!/^\S+@\S+\.\S+$/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid email address',
    })
  }
})

// Password: min 8 chars, at least 1 letter, 1 number, 1 special char
export const passwordSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Password is required',
    })
    return
  }

  if (value.length < 8) {
    ctx.addIssue({
      code: 'custom',
      message: 'Password must be at least 8 characters',
    })
    return
  }

  if (!/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Must contain an uppercase letter',
    })
    return
  }

  if (!/[a-z]/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Must contain a lowercase letter',
    })
    return
  }

  if (!/[0-9]/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Must contain a number',
    })
    return
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Must contain a special character',
    })
  }
})

const confirmPasswordSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Please confirm your password',
    })
  }
})

// Birthday: valid date AND at least 18 years old
export const birthdaySchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Birthday is required',
    })
    return
  }

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid date',
    })
    return
  }

  const [y, m, day] = value.split('-').map(Number)
  if (m < 1 || m > 12) {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid date',
    })
    return
  }

  if (day < 1 || day > 31) {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid date',
    })
    return
  }

  const today = new Date()
  const age = today.getFullYear() - d.getFullYear()
  const hasBirthdayPassed =
    today.getMonth() > d.getMonth() ||
    (today.getMonth() === d.getMonth() && today.getDate() >= d.getDate())

  if (!(age > 13 || (age === 13 && hasBirthdayPassed))) {
    ctx.addIssue({
      code: 'custom',
      message: 'You must be at least 13 years old',
    })
  }
})

// Country: non-empty string
export const countrySchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: 'custom',
      message: 'Country is required',
    })
  }
})

// Final form schema
export const signUpSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    birthday: birthdaySchema,
    country: countrySchema,
    avatar: z.instanceof(File).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpData = z.infer<typeof signUpSchema>
