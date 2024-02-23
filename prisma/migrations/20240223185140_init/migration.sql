-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "_id" SERIAL NOT NULL,
    "chainId" INTEGER,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ChainRelation" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "relatedId" INTEGER NOT NULL,

    CONSTRAINT "ChainRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chain" ADD CONSTRAINT "Chain_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainRelation" ADD CONSTRAINT "ChainRelation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Chain"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainRelation" ADD CONSTRAINT "ChainRelation_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "Chain"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
