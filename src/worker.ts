import { Worker } from "bullmq"
import { connection, queueName } from "./queue"
import { EmailJob } from "./types"

function sleep(ms: number) {
  return new Promise((_) => setTimeout(_,ms))
}


const worker = new Worker<EmailJob>(
  queueName,
  async (job) => {
    console.log(`[worker] jobId=${job.id} attempt=${job.attemptsMade + 1}/${job.opts.attempts}`)
  
    await sleep(500)

    const random = Math.random()

    if(random < 0.3){
      throw new Error("System timeout")
    }

    console.log(`[worker] processed email to=${job.data.to}`)
    return {ok: true}
  },
  {
    connection: connection, 
    concurrency: 3
  }
)

worker.on("completed", (job) => {
  console.log(`[worker] completed jobId=${job.id}`)
})
                       
worker.on("failed", (job, err) => {
  console.log(`[worker] failed jobId=${job?.id} attemptMade=${job?.attemptsMade} error=${err.message}`)
})