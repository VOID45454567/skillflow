import { Controller } from '@nestjs/common';
import { AdminActionsService } from './admin-actions.service';

@Controller('admin-actions')
export class AdminActionsController {
  constructor(private readonly adminActionsService: AdminActionsService) {}
}
