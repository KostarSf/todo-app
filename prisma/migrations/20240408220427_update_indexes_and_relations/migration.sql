-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_accountId_fkey";

-- CreateIndex
CREATE INDEX "Task_order_accountId_idx" ON "Task"("order", "accountId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
