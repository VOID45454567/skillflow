import { Module } from '@nestjs/common';
import { TaxomonyService } from './taxomony.service';
import { TaxomonyController } from './taxomony.controller';

@Module({
  controllers: [TaxomonyController],
  providers: [TaxomonyService],
})
export class TaxomonyModule {}
