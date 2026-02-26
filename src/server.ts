import express from "express";
import { z } from "zod";
import { emailQueue } from "./queue";
import { setupBullBoard } from "./dashboard";

const app = express()
app.use(express.json())
const serverAdapter = setupBullBoard()

const schema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  requestId: z.string().min(2) 
})

app.use(
  "/admin/queues",
  serverAdapter.getRouter()
)

app.post("/jobs/email", async (req, res) => {
  const parsed = schema.safeParse(req.body)

  if(!parsed.success){
    return res.status(400).json({error: z.treeifyError(parsed.error)})
  }

  const payload = parsed.data

  const jobId = `email - ${payload.requestId}`

  const job = await emailQueue.add("send-email", payload, {
    jobId
  })

  return res.status(202).json({
    message: "Queued",
    jobId: job.id
  })
})

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => console.log(`API on port: ${port}`))