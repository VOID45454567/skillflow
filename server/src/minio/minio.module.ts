import { Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
  imports: [],
  providers: [MinioService],
})
export class MinioModule { }
