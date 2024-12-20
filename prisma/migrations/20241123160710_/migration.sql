-- CreateTable
CREATE TABLE "_UserContacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserContacts_AB_unique" ON "_UserContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_UserContacts_B_index" ON "_UserContacts"("B");
