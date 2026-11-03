CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

CREATE INDEX "Notification_recipientId_createdAt_idx" ON "Notification"("recipientId", "createdAt");

CREATE INDEX "Notification_read_idx" ON "Notification"("read");
