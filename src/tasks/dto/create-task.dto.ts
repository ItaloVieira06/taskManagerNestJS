import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isClosed: boolean;

}