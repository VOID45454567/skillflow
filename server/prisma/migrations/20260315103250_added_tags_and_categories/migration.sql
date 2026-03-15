-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_category" (
    "id" SERIAL NOT NULL,
    "categoriesId" INTEGER NOT NULL,
    "goalsId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_tag" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tagsId" INTEGER NOT NULL,
    "goalsId" INTEGER NOT NULL,

    CONSTRAINT "goal_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "goal_category_categoriesId_goalsId_key" ON "goal_category"("categoriesId", "goalsId");

-- CreateIndex
CREATE UNIQUE INDEX "goal_tag_tagsId_goalsId_key" ON "goal_tag"("tagsId", "goalsId");

-- AddForeignKey
ALTER TABLE "goal_category" ADD CONSTRAINT "goal_category_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_category" ADD CONSTRAINT "goal_category_goalsId_fkey" FOREIGN KEY ("goalsId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_tag" ADD CONSTRAINT "goal_tag_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_tag" ADD CONSTRAINT "goal_tag_goalsId_fkey" FOREIGN KEY ("goalsId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
