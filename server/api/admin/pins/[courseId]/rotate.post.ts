import { requireAdmin } from '../../../../utils/guards'
import { rotatePin } from '../../../../utils/pin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const courseId = Number(getRouterParam(event, 'courseId'))
  const row = await rotatePin(courseId)
  return { courseId, period: row.period, pin: row.pin }
})
