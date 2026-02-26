import express from "express";
import { z } from "zod";

const app = express()
app.use(express.json())

const schema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  requestId: z.string().min(2) 
})

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => console.log(`API on port: ${port}`))