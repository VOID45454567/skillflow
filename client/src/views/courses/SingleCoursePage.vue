<template>
  <div class="min-h-screen py-8 px-4 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 -z-10">
      <div
        class="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"
      ></div>
      <div
        class="absolute bottom-0 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent-cyan/10 rounded-full blur-[96px] animate-float"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto relative">
      <!-- Header Navigation -->
      <div class="mb-6 animate-fadeInUp">
        <button
          @click="router.back()"
          class="p-3 rounded-xl glass hover:bg-surface-hover transition-all duration-300 group mb-4 backdrop-blur-xl"
        >
          <ArrowLeft
            class="h-5 w-5 text-gray-600 group-hover:text-primary transition-all duration-300 group-hover:-translate-x-1"
          />
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-40">
        <div class="relative">
          <div
            class="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse"
          ></div>
          <Loader class="h-12 w-12 text-primary animate-spin relative" />
        </div>
      </div>

      <!-- Course Content -->
      <template v-else-if="course">
        <!-- Course Hero -->
        <div
          class="glass-strong rounded-[2.5rem] overflow-hidden mb-8 animate-fadeInUp backdrop-blur-2xl shadow-2xl shadow-primary/10"
        >
          <div class="relative">
            <!-- Banner Gradient -->
            <div
              class="h-80 relative overflow-hidden"
              :style="{
                background: `linear-gradient(135deg, ${bannerColors!.from}, ${bannerColors!.to})`,
              }"
            >
              <!-- Animated Pattern -->
              <div class="absolute inset-0 opacity-20">
                <div
                  class="absolute inset-0"
                  :style="{
                    backgroundImage: `url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
                  }"
                ></div>
              </div>

              <div class="absolute inset-0 shimmer"></div>
              <div
                class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
              ></div>

              <!-- Floating Elements -->
              <div
                class="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-float"
              ></div>
              <div
                class="absolute -bottom-40 -left-40 w-120 h-120 bg-white/10 rounded-full blur-3xl"
                style="animation-delay: 2s"
              ></div>
              <div
                class="absolute top-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"
                style="animation-delay: 1s"
              ></div>
            </div>

            <!-- Course Info Overlay -->
            <div class="relative px-8 lg:px-12 pb-10 -mt-24">
              <div class="flex flex-col lg:flex-row lg:items-end gap-8">
                <div class="flex-1">
                  <!-- Badges -->
                  <div class="flex flex-wrap items-center gap-3 mb-5">
                    <!-- Level Badge -->
                    <span
                      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-xl bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <component :is="levelIcon" class="h-4 w-4" />
                      {{ levelLabel }}
                    </span>

                    <!-- Price Badge -->
                    <span
                      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      :class="{
                        'bg-linear-to-r from-emerald-500 to-teal-500 text-white':
                          course.isFree,
                        'bg-linear-to-r from-primary to-accent text-white': !course.isFree,
                      }"
                    >
                      <Gem v-if="!course.isFree" class="h-4 w-4" />
                      <Gift v-else class="h-4 w-4" />
                      {{ course.isFree ? "Бесплатно" : `${course.price} 💎` }}
                    </span>

                    <!-- Visibility Badge -->
                    <span
                      v-if="course.visibility && !isOwner"
                      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      :class="visibilityConfig.class"
                    >
                      <component :is="visibilityConfig.icon" class="h-4 w-4" />
                      {{ visibilityConfig.label }}
                    </span>

                    <!-- Categories/Tags -->
                    <span
                      v-for="term in course.courseTerms"
                      :key="term.name"
                      class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-xl bg-white/70 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Tag class="h-3 w-3" />
                      {{ term.name }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h1
                    class="text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight"
                  >
                    {{ course.title }}
                  </h1>

                  <!-- Description -->
                  <p
                    class="text-xl text-white/95 max-w-4xl drop-shadow-lg leading-relaxed"
                  >
                    {{ course.description }}
                  </p>

                  <!-- Meta Info -->
                  <div class="flex flex-wrap items-center gap-8 mt-8">
                    <div
                      class="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/40 shadow-sm"
                    >
                      <Users class="h-5 w-5 text-primary" />
                      <span class="font-medium text-gray-700">
                        {{ statistics?.totalStudents || 0 }}
                        {{
                          pluralize(
                            statistics?.totalStudents || 0,
                            "студент",
                            "студента",
                            "студентов"
                          )
                        }}
                      </span>
                    </div>
                    <div
                      class="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/40 shadow-sm"
                    >
                      <BookOpen class="h-5 w-5 text-accent" />
                      <span class="font-medium text-gray-700">
                        {{ course.lessons?.length || 0 }}
                        {{
                          pluralize(
                            course.lessons?.length || 0,
                            "урок",
                            "урока",
                            "уроков"
                          )
                        }}
                      </span>
                    </div>
                    <div
                      v-if="totalDuration"
                      class="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/40 shadow-sm"
                    >
                      <Clock class="h-5 w-5 text-accent-cyan" />
                      <span class="font-medium text-gray-700"
                        >{{ totalDuration }} мин</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 min-w-fit">
                  <!-- Owner Actions -->
                  <template v-if="isOwner">
                    <AppButton
                      v-if="course.isFree"
                      @click="openSetPriceModal"
                      variant="filled"
                      size="lg"
                    >
                      <Gem class="h-5 w-5" />
                      Сделать платным
                    </AppButton>

                    <!-- Кнопка публикации/черновика - показывается только если курс НЕ опубликован -->
                    <AppButton
                      v-if="course.visibility !== CourseVisibilityTypes.PUBLISHED"
                      @click="handleToggleVisibility"
                      variant="filled"
                      size="lg"
                      :loading="isTogglingVisibility"
                    >
                      <Eye class="h-5 w-5" />
                      Опубликовать
                    </AppButton>

                    <!-- Плашка "Опубликован" - показывается если курс опубликован -->
                    <div
                      v-else
                      class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 shadow-lg"
                    >
                      <CheckCircle class="h-5 w-5 text-emerald-500" />
                      <span class="font-semibold text-emerald-700">Курс опубликован</span>
                    </div>

                    <AppButton @click="editCourse" variant="outlined" size="lg">
                      <Edit class="h-5 w-5" />
                      Редактировать
                    </AppButton>
                  </template>

                  <!-- User Actions -->
                  <template v-else>
                    <!-- Has Access -->
                    <template v-if="hasAccess">
                      <!-- Курс завершен - показываем плашку -->
                      <div
                        v-if="isCourseCompleted"
                        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 shadow-lg"
                      >
                        <Trophy class="h-5 w-5 text-emerald-500" />
                        <span class="font-semibold text-emerald-700"
                          >Обучение завершено</span
                        >
                      </div>

                      <!-- Курс в процессе или не начат - показываем кнопку -->
                      <AppButton v-else @click="startLearning" variant="filled" size="lg">
                        <PlayCircle class="h-5 w-5" />
                        {{ hasProgress ? "Продолжить обучение" : "Начать обучение" }}
                      </AppButton>

                      <AppButton
                        v-if="isPurchased"
                        @click="openRefundModal"
                        variant="outlined"
                        size="lg"
                        class="text-rose-500! border-rose-200! hover:bg-rose-50!"
                      >
                        <RotateCcw class="h-5 w-5" />
                        Возврат
                      </AppButton>
                    </template>

                    <!-- No Access - Buy -->
                    <template v-else-if="!course.isFree">
                      <AppButton @click="openPurchaseModal" variant="filled" size="lg">
                        <ShoppingCart class="h-5 w-5" />
                        Купить за {{ course.price }} 💎
                      </AppButton>

                      <AppButton @click="openGiftModal" variant="tonal" size="lg">
                        <Gift class="h-5 w-5" />
                        Подарить
                      </AppButton>
                    </template>

                    <!-- Free Course -->
                    <AppButton v-else @click="startLearning" variant="filled" size="lg">
                      <PlayCircle class="h-5 w-5" />
                      Начать бесплатно
                    </AppButton>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Lessons Section -->
            <div
              class="glass-strong rounded-3xl p-8 animate-slideInLeft backdrop-blur-xl shadow-xl"
            >
              <div class="flex items-center gap-4 mb-8">
                <div
                  class="h-14 w-14 rounded-2xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center shadow-lg"
                >
                  <BookOpen class="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800">Программа курса</h2>
                  <p class="text-sm text-gray-500 mt-0.5">
                    {{ sortedLessons.length }} уроков
                  </p>
                </div>
              </div>

              <div v-if="sortedLessons.length" class="space-y-3">
                <div
                  v-for="(lesson, index) in sortedLessons"
                  :key="lesson.id"
                  class="glass rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/50"
                  :class="{
                    'border-l-4 border-l-primary shadow-primary/20': isCurrentLesson(
                      lesson
                    ),
                    'opacity-60': isLessonLocked(lesson, index),
                    'cursor-not-allowed': isLessonLocked(lesson, index),
                    'hover:scale-[1.02]': !isLessonLocked(lesson, index),
                  }"
                  @click="selectLesson(lesson)"
                >
                  <div class="flex items-start gap-4">
                    <div
                      class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                      :class="{
                        'bg-linear-to-br from-emerald-500/30 to-teal-500/30 shadow-md': isLessonCompleted(
                          lesson
                        ),
                        'bg-linear-to-br from-primary/30 to-accent/30 shadow-md':
                          isCurrentLesson(lesson) && !isLessonCompleted(lesson),
                        'bg-primary/10':
                          !isCurrentLesson(lesson) && !isLessonCompleted(lesson),
                        'group-hover:bg-primary/20': !isLessonLocked(lesson, index),
                      }"
                    >
                      <CheckCircle
                        v-if="isLessonCompleted(lesson)"
                        class="h-5 w-5 text-emerald-500"
                      />
                      <PlayCircle
                        v-else-if="isCurrentLesson(lesson)"
                        class="h-5 w-5 text-primary"
                      />
                      <Lock
                        v-else-if="isLessonLocked(lesson, index)"
                        class="h-5 w-5 text-gray-400"
                      />
                      <span v-else class="text-base font-bold text-primary">{{
                        index + 1
                      }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-gray-800 mb-2 text-lg">
                        {{ lesson.title }}
                      </h4>
                      <div class="flex items-center gap-5 text-sm text-gray-500">
                        <span
                          v-if="lesson.goals?.length"
                          class="flex items-center gap-1.5"
                        >
                          <Target class="h-4 w-4" />
                          {{ lesson.goals.length }}
                          {{ pluralize(lesson.goals.length, "цель", "цели", "целей") }}
                        </span>
                        <span
                          v-if="lesson.requredTime || lesson.requredTime"
                          class="flex items-center gap-1.5"
                        >
                          <Clock class="h-4 w-4" />
                          {{ lesson.requredTime || lesson.requredTime }}
                          мин
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      class="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-16">
                <div
                  class="h-20 w-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center"
                >
                  <BookOpen class="h-10 w-10 text-gray-300" />
                </div>
                <p class="text-gray-500 text-lg">В курсе пока нет уроков</p>
              </div>
            </div>

            <!-- Reviews Section -->
            <div
              v-if="canReview || course.reviews?.length"
              class="glass-strong rounded-3xl p-8 animate-slideInLeft backdrop-blur-xl shadow-xl"
              style="animation-delay: 0.1s"
            >
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                  <div
                    class="h-14 w-14 rounded-2xl bg-linear-to-br from-accent/30 to-accent-pink/30 flex items-center justify-center shadow-lg"
                  >
                    <Star class="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-800">Отзывы</h2>
                    <p class="text-sm text-gray-500 mt-0.5">
                      {{ course.reviews?.length || 0 }} отзывов
                    </p>
                  </div>
                </div>

                <AppButton
                  v-if="canReview"
                  size="md"
                  variant="tonal"
                  @click="openReviewForm"
                  class="shadow-md hover:shadow-lg transition-all"
                >
                  <Edit class="h-4 w-4" />
                  Написать отзыв
                </AppButton>
              </div>

              <!-- Review Form -->
              <Transition name="slide-fade">
                <div
                  v-if="isReviewFormOpen"
                  class="mb-8 p-6 glass rounded-2xl border border-white/50"
                >
                  <textarea
                    v-model="reviewText"
                    placeholder="Поделитесь вашим мнением о курсе..."
                    rows="4"
                    class="w-full px-5 py-4 rounded-xl bg-white/70 border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 resize-none transition-all text-base"
                  ></textarea>
                  <div class="flex justify-end gap-3 mt-4">
                    <AppButton variant="ghost" size="md" @click="cancelReview">
                      Отмена
                    </AppButton>
                    <AppButton
                      size="md"
                      @click="submitReview"
                      :disabled="!reviewText.trim()"
                      :loading="isSubmittingReview"
                    >
                      <Send class="h-4 w-4" />
                      Отправить
                    </AppButton>
                  </div>
                </div>
              </Transition>

              <!-- Reviews List -->
              <div v-if="course.reviews?.length" class="space-y-4">
                <div
                  v-for="review in course.reviews"
                  :key="review.id"
                  class="glass rounded-2xl p-5 border border-white/50 hover:shadow-md transition-all duration-300"
                >
                  <div class="flex items-start gap-4">
                    <div v-if="!review.user?.avatarUrl">
                      <User></User>
                    </div>
                    <div v-else>
                      <img
                        :src="review.user?.avatarUrl || '/placeholder-avatar.png'"
                        class="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
                        alt="avatar"
                      />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span class="font-semibold text-gray-800">{{
                          review.user?.login
                        }}</span>
                        <span class="text-xs text-gray-400">•</span>
                        <span class="text-xs text-gray-400">{{
                          formatDate(review.createdAt)
                        }}</span>
                      </div>
                      <p class="text-gray-600 leading-relaxed">{{ review.text }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <div
                  class="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center"
                >
                  <MessageCircle class="h-8 w-8 text-gray-300" />
                </div>
                <p class="text-gray-500">Пока нет отзывов</p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Progress Card -->
            <Transition name="scale-fade">
              <div
                v-if="hasProgress && courseProgress"
                class="glass-strong rounded-3xl p-6 backdrop-blur-xl shadow-xl bg-linear-to-br from-primary/5 to-accent/5"
              >
                <h3 class="font-bold text-gray-800 mb-5 flex items-center gap-3 text-lg">
                  <div
                    class="h-10 w-10 rounded-xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center"
                  >
                    <TrendingUp class="h-5 w-5 text-primary" />
                  </div>
                  Ваш прогресс
                </h3>

                <div class="space-y-5">
                  <div>
                    <div class="flex justify-between text-sm mb-3">
                      <span class="text-gray-500 font-medium">Завершено</span>
                      <span class="font-bold text-gray-800 text-lg"
                        >{{ Math.round(courseProgress.progress) }}%</span
                      >
                    </div>
                    <div class="relative h-3 bg-gray-200/50 rounded-full overflow-hidden">
                      <div
                        class="absolute inset-y-0 left-0 bg-linear-to-r from-primary via-accent to-accent-cyan rounded-full transition-all duration-700 ease-out shadow-lg"
                        :style="{ width: `${courseProgress.progress}%` }"
                      >
                        <div class="absolute inset-0 shimmer"></div>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div
                      class="text-center p-4 bg-white/50 rounded-2xl border border-white/60"
                    >
                      <p class="text-2xl font-bold text-primary">
                        {{ courseProgress.completedLessonsCount }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1 font-medium">
                        уроков пройдено
                      </p>
                    </div>
                    <div
                      class="text-center p-4 bg-white/50 rounded-2xl border border-white/60"
                    >
                      <p class="text-2xl font-bold text-accent">
                        {{ courseProgress.totalLessons }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1 font-medium">всего уроков</p>
                    </div>
                  </div>

                  <AppButton
                    v-if="!isCourseCompleted"
                    block
                    size="lg"
                    @click="startLearning"
                    class="shadow-lg hover:shadow-xl"
                  >
                    <PlayCircle class="h-5 w-5" />
                    {{
                      courseProgress.progress > 0
                        ? "Продолжить обучение"
                        : "Начать обучение"
                    }}
                  </AppButton>

                  <!-- Плашка о завершении курса -->
                  <div
                    v-else
                    class="flex items-center justify-center gap-2 p-3 rounded-xl bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
                  >
                    <Trophy class="h-5 w-5 text-emerald-500" />
                    <span class="font-semibold text-emerald-700"
                      >Курс полностью пройден!</span
                    >
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Statistics Card -->
            <div class="glass rounded-3xl p-6 backdrop-blur-xl shadow-lg">
              <h3 class="font-bold text-gray-800 mb-5 flex items-center gap-3 text-lg">
                <div
                  class="h-10 w-10 rounded-xl bg-linear-to-br from-accent-cyan/30 to-primary/30 flex items-center justify-center"
                >
                  <BarChart class="h-5 w-5 text-accent-cyan" />
                </div>
                Статистика курса
              </h3>

              <div v-if="statisticsLoading" class="flex justify-center py-6">
                <Loader class="h-6 w-6 text-primary animate-spin" />
              </div>

              <div v-else-if="statistics" class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                  <span class="text-sm text-gray-600 font-medium">Студентов</span>
                  <span class="font-bold text-gray-800 text-lg">{{
                    statistics.totalStudents
                  }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                  <span class="text-sm text-gray-600 font-medium">Завершили</span>
                  <span class="font-bold text-gray-800 text-lg">{{
                    statistics.completedStudents
                  }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/40 rounded-xl">
                  <span class="text-sm text-gray-600 font-medium">Средний прогресс</span>
                  <span class="font-bold text-primary text-lg"
                    >{{ Math.round(statistics.averageProgress) }}%</span
                  >
                </div>
              </div>
            </div>

            <!-- Author Card -->
            <div class="glass rounded-3xl p-6 backdrop-blur-xl shadow-lg">
              <h3 class="font-bold text-gray-800 mb-5 flex items-center gap-3 text-lg">
                <div
                  class="h-10 w-10 rounded-xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center"
                >
                  <User class="h-5 w-5 text-primary" />
                </div>
                Автор курса
              </h3>

              <div class="flex items-center gap-4">
                <img
                  :src="course.user?.avatarUrl || '/placeholder-avatar.png'"
                  class="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
                  alt="author"
                />
                <div>
                  <p class="font-bold text-gray-800 text-lg">{{ course.user?.login }}</p>
                  <p class="text-sm text-gray-500">{{ course.user?.email }}</p>
                </div>
              </div>

              <router-link
                v-if="!isOwner"
                :to="{ name: 'profile', params: { id: course.userId } }"
                class="mt-5 block"
              >
                <AppButton
                  variant="outlined"
                  block
                  size="md"
                  class="shadow-sm hover:shadow-md"
                >
                  <User class="h-4 w-4" />
                  Профиль автора
                </AppButton>
              </router-link>
            </div>

            <!-- Organization Card -->
            <div
              v-if="course.organization"
              class="glass rounded-3xl p-6 backdrop-blur-xl shadow-lg bg-linear-to-br from-accent-pink/5 to-accent/5"
            >
              <h3 class="font-bold text-gray-800 mb-5 flex items-center gap-3 text-lg">
                <div
                  class="h-10 w-10 rounded-xl bg-linear-to-br from-accent-pink/30 to-accent/30 flex items-center justify-center"
                >
                  <Building class="h-5 w-5 text-accent-pink" />
                </div>
                Организация
              </h3>

              <div class="flex items-center gap-4">
                <img
                  :src="course.organization.logo || '/placeholder-org.png'"
                  class="h-14 w-14 rounded-xl object-cover ring-2 ring-white shadow-md"
                  alt="organization"
                />
                <div>
                  <p class="font-bold text-gray-800">{{ course.organization.name }}</p>
                  <p class="text-sm text-gray-500 line-clamp-2">
                    {{ course.organization.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <div v-else class="text-center py-32">
        <div
          class="h-24 w-24 mx-auto mb-6 rounded-3xl bg-rose-50 flex items-center justify-center"
        >
          <AlertCircle class="h-12 w-12 text-rose-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Курс не найден</h2>
        <p class="text-gray-500 mb-8 text-lg">
          Возможно, курс был удален или у вас нет к нему доступа
        </p>
        <AppButton
          size="lg"
          @click="router.push({ name: 'public-courses' })"
          class="shadow-lg hover:shadow-xl"
        >
          <BookOpen class="h-5 w-5" />
          Перейти к каталогу
        </AppButton>
      </div>
    </div>

    <!-- Modals -->
    <GiftModal
      v-model="isGiftModalOpen"
      :course-id="course?.id"
      :course-title="course?.title"
      :price="course?.price"
      @gift="handleGift"
    />

    <PurchaseModal
      v-model="isPurchaseModalOpen"
      :course="course"
      :current-balance="currentUserBalance"
      @confirm="handlePurchase"
    />

    <RefundModal
      v-model="isRefundModalOpen"
      :course-title="course?.title"
      :price="course?.price"
      :has-progress="hasProgress"
      :progress-percent="courseProgress?.progress"
      @confirm="handleRefund"
    />

    <SetPriceModal
      v-model="isSetPriceModalOpen"
      :is-free="course?.isFree"
      :current-price="course?.price"
      @confirm="handleSetPrice"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Clock,
  Gem,
  Gift,
  Eye,
  EyeOff,
  Edit,
  PlayCircle,
  ShoppingCart,
  RotateCcw,
  Target,
  ChevronRight,
  Star,
  Send,
  MessageCircle,
  TrendingUp,
  BarChart,
  User,
  Building,
  Tag,
  Lock,
  CheckCircle,
  Loader,
  AlertCircle,
  Trophy,
} from "@lucide/vue";
import AppButton from "@/components/ui/AppButton.vue";
import GiftModal from "@/components/course/GiftModal.vue";
import PurchaseModal from "@/components/course/PurchaseModal.vue";
import RefundModal from "@/components/course/RefundModal.vue";
import SetPriceModal from "@/components/modals/SetPriceModal.vue";
import { CourseVisibilityTypes } from "@/types/enums/course-visibility-types";
import { useCoursesStore } from "@/stores/courses";
import { useAuthStore } from "@/stores/auth";
import { useUserCourseProgressStore } from "@/stores/userCourseProgress";
import type { Lesson } from "@/types/course/Lesson";
import type { CourseStatistics } from "@/types/userCourseProgress";
import {
  getLevelColors,
  getLevelIcon,
  mapCourseLevel,
} from "@/utils/mappers/mapCourseLevel";
import { formatDate } from "@/utils/formatters/formatDate";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const router = useRouter();
const courseId = Number(route.params.id);

const coursesStore = useCoursesStore();
const userProgressStore = useUserCourseProgressStore();
const authStore = useAuthStore();

const isLoading = ref(true);
const statistics = ref<CourseStatistics | null>(null);
const statisticsLoading = ref(false);
const isTogglingVisibility = ref(false);
const isSubmittingReview = ref(false);

const isGiftModalOpen = ref(false);
const isPurchaseModalOpen = ref(false);
const isRefundModalOpen = ref(false);
const isReviewFormOpen = ref(false);
const isSetPriceModalOpen = ref(false);

const reviewText = ref("");

const toast = useToast();

const currentUser = computed(() => authStore.currentUser);
const currentUserBalance = computed(() => currentUser.value?.balance || 0);
const course = computed(() => coursesStore.currentCourse);

const courseProgress = computed(() => userProgressStore.getCourseProgress(courseId));

const isOwner = computed(() => course.value?.userId === currentUser.value?.id);
const isPurchased = computed(() => {
  return currentUser.value?.purchasedCourses?.some((c) => c.id === courseId) || false;
});
const hasAccess = computed(() => {
  return isOwner.value || course.value?.isFree || isPurchased.value;
});
const hasProgress = computed(() => !!courseProgress.value);
const canReview = computed(() => {
  return hasProgress.value && courseProgress.value?.progress === 100;
});

const isCourseCompleted = computed(() => {
  if (!courseProgress.value) return false;
  return courseProgress.value.progress === 100 && !!courseProgress.value.completedAt;
});

const sortedLessons = computed(() => {
  return [...(course.value?.lessons || [])].sort((a, b) => a.order - b.order);
});

const totalDuration = computed(() => {
  console.log(sortedLessons.value);
  return sortedLessons.value.reduce(
    (acc, lesson) => acc + (lesson.requredTime || lesson.requredTime || 0),
    0
  );
});

const levelLabel = computed(() =>
  mapCourseLevel(course.value?.level?.toString() || "BEGINNER")
);
const levelIcon = computed(() =>
  getLevelIcon(course.value?.level?.toString() || "BEGINNER")
);
const bannerColors = computed(() =>
  getLevelColors(course.value?.level?.toString() || "BEGINNER")
);

const visibilityConfig = computed(() => {
  const configs = {
    [CourseVisibilityTypes.PUBLISHED]: {
      icon: Eye,
      label: "Опубликован",
      class: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    },
    [CourseVisibilityTypes.DRAFT]: {
      icon: EyeOff,
      label: "Черновик",
      class: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
    },
    [CourseVisibilityTypes.ORGANIZATION]: {
      icon: Building,
      label: "Для организации",
      class: "bg-gradient-to-r from-accent to-accent-pink text-white",
    },
  };
  return (
    configs[course.value?.visibility as CourseVisibilityTypes] ||
    configs[CourseVisibilityTypes.DRAFT]
  );
});

function pluralize(count: number, one: string, two: string, five: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
  return five;
}

function isLessonCompleted(lesson: Lesson): boolean {
  if (!courseProgress.value?.completedLessonsList) return false;
  return courseProgress.value.completedLessonsList.includes(lesson.id);
}

function isCurrentLesson(lesson: Lesson): boolean {
  return courseProgress.value?.currentLessonId === lesson.id;
}

function isLessonLocked(lesson: Lesson, index: number): boolean {
  if (!hasProgress.value) return index !== 0;
  if (index === 0) return false;
  const prevLesson = sortedLessons.value[index - 1];
  return !isLessonCompleted(prevLesson!);
}

function selectLesson(lesson: Lesson) {
  const index = sortedLessons.value.findIndex((l) => l.id === lesson.id);
  if (isLessonLocked(lesson, index)) {
    return;
  }
  if (hasAccess.value) {
    startLearning();
  }
}

async function loadCourseData() {
  isLoading.value = true;
  try {
    await coursesStore.getCourseById(courseId);
    console.log(course.value?.reviews);

    if (currentUser.value) {
      await userProgressStore.fetchMyProgress();
    }

    await loadStatistics();
  } catch (error) {
    console.error("Error loading course:", error);
  } finally {
    isLoading.value = false;
  }
}

async function loadStatistics() {
  statisticsLoading.value = true;
  try {
    const data = await userProgressStore.fetchCourseStatistics(courseId);
    console.log("Statistics data:", data);

    if (data) {
      statistics.value = data;
    } else {
      statistics.value = {
        totalStudents: 0,
        completedStudents: 0,
        averageProgress: 0,
        students: [],
      };
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
    // При ошибке тоже показываем нули
    statistics.value = {
      totalStudents: 0,
      completedStudents: 0,
      averageProgress: 0,
      students: [],
    };
  } finally {
    statisticsLoading.value = false;
  }
}

function openSetPriceModal() {
  isSetPriceModalOpen.value = true;
}

async function handleSetPrice(price: number) {
  if (!course.value) return;
  try {
    await coursesStore.makeCoursePaid(courseId, price);
    course.value.isFree = false;
    course.value.price = price;
    isSetPriceModalOpen.value = false;

    toast.success(`Курс стал платным! Цена: ${price} 💎`);
  } catch (error) {
    console.error("Error setting course price:", error);
    toast.error("Не удалось установить цену. Попробуйте позже.");
  }
}

async function handleToggleVisibility() {
  if (!course.value) return;
  isTogglingVisibility.value = true;
  try {
    const newVisibility = CourseVisibilityTypes.PUBLISHED;
    await coursesStore.updateCourseVisibility(courseId);
    course.value.visibility = newVisibility;

    toast.success("Курс успешно опубликован!");
  } catch (error) {
    console.error("Error publishing course:", error);
    toast.error("Не удалось опубликовать курс. Попробуйте позже.");
  } finally {
    isTogglingVisibility.value = false;
  }
}

function editCourse() {
  router.push({ name: "edit-course", params: { id: courseId } });
}

async function startLearning() {
  if (!hasProgress.value && !isOwner.value) {
    await userProgressStore.startCourse(courseId);
  }
  router.push({ name: "course-learning", params: { id: course.value!.id } });
}

function openPurchaseModal() {
  isPurchaseModalOpen.value = true;
}

function openGiftModal() {
  isGiftModalOpen.value = true;
}

function openRefundModal() {
  isRefundModalOpen.value = true;
}

function openReviewForm() {
  isReviewFormOpen.value = true;
}

function cancelReview() {
  isReviewFormOpen.value = false;
  reviewText.value = "";
}

async function handlePurchase(data: { courseId: number; topUpAmount?: number }) {
  try {
    await coursesStore.makeTransactionWithCourse(courseId, "PURCHACE");
    await loadCourseData();
    isPurchaseModalOpen.value = false;
    toast.success("Курс успешно приобретен! Приятного обучения!");
  } catch (error) {
    console.error("Error purchasing course:", error);
    toast.error("Не удалось приобрести курс. Проверьте баланс.");
  }
}

async function handleGift(data: { userId: number; courseId: number }) {
  try {
    await coursesStore.makeTransactionWithCourse(data.courseId, "GIFT", data.userId);
    isGiftModalOpen.value = false;
    toast.success("Курс успешно подарен!");
  } catch (error) {
    console.error("Error gifting course:", error);
    toast.error("Не удалось подарить курс. Попробуйте позже.");
  }
}

async function handleRefund(data: { reason?: string }) {
  try {
    await coursesStore.makeTransactionWithCourse(courseId, "REFUND");
    await userProgressStore.resetCourseProgress(courseId);
    await loadCourseData();
    isRefundModalOpen.value = false;
    toast.success("Курс возвращен. Средства зачислены на баланс.");
  } catch (error) {
    console.error("Error refunding course:", error);
    toast.error("Не удалось вернуть курс. Попробуйте позже.");
  }
}

async function submitReview() {
  if (!reviewText.value.trim()) return;
  isSubmittingReview.value = true;
  try {
    await coursesStore.addReview(courseId, reviewText.value);

    reviewText.value = "";
    isReviewFormOpen.value = false;
    course.value?.reviews.push({
      courseId: course.value.id,
      user: currentUser.value!,
      text: reviewText.value,
      course: course.value,
      id: Date.now(),
      createdAt: String(Date.now()),
      userId: currentUser.value!.id,
    });
    toast.success("Отзыв успешно опубликован!");
  } catch (error) {
    console.error("Error submitting review:", error);
    toast.error("Не удалось опубликовать отзыв.");
  } finally {
    isSubmittingReview.value = false;
  }
}

onMounted(() => {
  loadCourseData();
});
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.scale-fade-enter-active {
  transition: all 0.4s ease-out;
}

.scale-fade-leave-active {
  transition: all 0.2s ease-in;
}

.scale-fade-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.scale-fade-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
