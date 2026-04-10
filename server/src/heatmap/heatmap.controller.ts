import { Controller } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';

@Controller('heatmap')
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}
}
