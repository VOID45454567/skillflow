import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigModuleParams } from './conf/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TermsModule } from './terms/terms.module';
import { LessonsModule } from './lessons/lessons.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { CoursesModule } from './courses/courses.module';
import { AdminModule } from './admin/admin.module';
import { AdminActionsModule } from './admin-actions/admin-actions.module';
import { BalanceModule } from './balance/balance.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserCourseProgressModule } from './user-course-progress/user-course-progress.module';
import { HeatmapModule } from './heatmap/heatmap.module';
import { OrganizationModule } from './organization/organization.module';
import { AppealModule } from './appeal/appeal.module';
import { ReviewModule } from './review/review.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerConfig } from './conf/mail';
import { NestMinioModule } from 'nestjs-minio';
import { getMinioConfig } from './conf/minio';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigModuleParams),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMailerConfig,
      imports: [ConfigModule]
    }),
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: getMinioConfig,
      imports: [ConfigModule],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    CourseModulesModule,
    LessonsModule,
    TermsModule,
    AdminModule,
    AdminActionsModule,
    BalanceModule,
    PaymentModule,
    TransactionModule,
    UserCourseProgressModule,
    HeatmapModule,
    OrganizationModule,
    AppealModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
