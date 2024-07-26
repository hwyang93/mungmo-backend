import { PartialType } from '@nestjs/swagger';
import { CreateWalkDto } from './create-walk.dto';

export class UpdateWalkDto extends PartialType(CreateWalkDto) {}
