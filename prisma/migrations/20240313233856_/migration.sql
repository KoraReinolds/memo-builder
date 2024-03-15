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
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "_id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "_id" SERIAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "ItemChain" (
    "itemId" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "ItemChain_pkey" PRIMARY KEY ("itemId","chainId")
);

-- CreateTable
CREATE TABLE "ChainRelation" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL,
    "relatedId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChainRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Item_data_key" ON "Item"("data");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chain" ADD CONSTRAINT "Chain_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemChain" ADD CONSTRAINT "ItemChain_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemChain" ADD CONSTRAINT "ItemChain_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainRelation" ADD CONSTRAINT "ChainRelation_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainRelation" ADD CONSTRAINT "ChainRelation_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "Chain"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
