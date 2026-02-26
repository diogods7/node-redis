import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";

export function setupBullBoard() {
  const serverAdapter = new ExpressAdapter()

  serverAdapter.setBasePath("/admin/queues");

  createBullBoard 
}