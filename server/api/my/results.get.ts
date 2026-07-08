import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { testResults } from '../../db/schema'
import { requireParticipant } from '../../utils/guards'

export default defineEventHandler(async (event) => {
  const { participantId } = await requireParticipant(event)
  return db.select().from(testResults).where(eq(testResults.participantId, participantId))
})
