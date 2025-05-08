import { Controller, Get, Post, Body, Delete, Patch, Query, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  private validateIdFilter(id?: string) {
    if (!id) {
      throw new BadRequestException('Você deve fornecer o id da tarefa.'); //conferir se o id foi passado
    }

    const parsedId = parseInt(id, 10); // Converte para número

    if (isNaN(parsedId)) {
      throw new BadRequestException('O id fornecido não é um número válido.'); //conferir se o id está com o tipo correto
    }

    return parsedId; // Retorna o id validado e convertido
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('find')
  findOne(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
  ) {
    const filters = {
      id: id ? parseInt(id, 10) : undefined,
      name,
      description,
    };

    const definedFilters = Object.values(filters).filter((val) => val !== undefined);

    if (definedFilters.length === 0) {
      throw new BadRequestException('Você deve fornecer um filtro: id, name ou description.');
    }

    if (definedFilters.length > 1) {
      throw new BadRequestException('Apenas um filtro pode ser usado por vez.');
    }

    return this.tasksService.findOne(filters);
  }

  @Patch('update')
  async update(
    @Body() updateTaskDto: UpdateTaskDto,
    @Query('id') id?: string,
  ) {
    const parsedId = this.validateIdFilter(id); // Valida e converte o id
    return this.tasksService.update(parsedId, updateTaskDto); // Passa o id convertido
  }

  @Delete('remove')
  async remove(@Query('id') id?: string) {
    const parsedId = this.validateIdFilter(id); // Valida e converte o id
    return this.tasksService.remove(parsedId); // Passa o id convertido
  }

}