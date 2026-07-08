import { z } from 'zod'

const schema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const { phone, password } = schema.parse(await readBody(event))

  const adminPhone = process.env.ADMIN_PHONE
  const adminPassword = process.env.ADMIN_PASSWORD

  if (phone === adminPhone && password === adminPassword) {
    await setUserSession(event, {
      user: { role: 'admin', name: 'Администратор' }
    })
    return { ok: true }
  }

  throw createError({ statusCode: 401, statusMessage: 'Неверный телефон или пароль' })
})
