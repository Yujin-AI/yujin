import { defineConfig } from 'adonis-resque'

const resqueConfig = defineConfig({
  redisConnection: 'main',
  /**
   * run web & worker in same process, if enabled
   * You need to run command node ace resque:start if it is turned off
   *
   * it's convenient but NOT Recommended in production
   * also, DO NOT enable for math-heavy jobs, even in the dev or staging environment.
   *
   */
  runWorkerInWebEnv: false, // default is true, running it in separate process
  /**
   * when runScheduler enabled, it starts with worker
   * if you'd like to run scheduler in the separated processes
   * please turn runScheduler off, and run command
   * node ace resque:start --scheduler
   */
  runScheduler: false,
  isMultiWorkerEnabled: true,
  multiWorkerOption: {
    minTaskProcessors: 1,
    maxTaskProcessors: 10,
  },
  workerOption: {},
  /**
   * the default queue name for jobs to enqueue
   */
  queueNameForJobs: 'default',
  /**
   * queue name for workers to listen,
   * is a string or an array of string
   * setting a proper queue name could change their priorities
   * e.g. queueNameForWorkers: "high-priority, medium-priority, low-priority"
   * All the jobs in high-priority will be worked before any of the jobs in the other queues.
   */
  queueNameForWorkers: '*',
  /**
   * logger name in config/logger.ts
   * null means the default
   */
  logger: null,
  verbose: true,
})

export default resqueConfig
