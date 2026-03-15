import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { CourseModulesModule } from './course.modules/course.modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { TaxomonyModule } from './taxomony/taxomony.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, CoursesModule, CourseModulesModule, LessonsModule, TaxomonyModule, MinioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
