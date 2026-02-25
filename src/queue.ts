import { Queue } from "bullmq";
import IoRedis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379"
export const queueName = process.env.QUEUE_NAME ?? "emails"

const configs = {
  maxRetriesPerRequest: null
}

export const connection = new IoRedis(redisUrl, configs)

export const emailQueue = new Queue(queueName, {
  connection, 
  defaultJobOptions: {
    attempts: 5,
    backoff: {type: "exponential", delay: 1000},
    removeOnComplete: {count: 1000},
    removeOnFail: {count: 5000},
  }
})



