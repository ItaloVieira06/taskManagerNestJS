import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Prisma } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private validateTaskAttributes(data: Prisma.TaskUpdateInput) {
    if (data.name && typeof data.name !== 'string') {
      throw new BadRequestException('O campo "name" deve ser uma string.');
    }
    if (data.description && typeof data.description !== 'string') {
      throw new BadRequestException('O campo "description" deve ser uma string.');
    }
    if (data.isClosed !== undefined && typeof data.isClosed !== 'boolean') {
      throw new BadRequestException('O campo "isClosed" deve ser um valor booleano.');
    }
    if (data.createdAt && !(data.createdAt instanceof Date)) {
      throw new BadRequestException('O campo "createdAt" deve ser uma data válida.');
    }
    if (data.updatedAt && !(data.updatedAt instanceof Date)) {
      throw new BadRequestException('O campo "updatedAt" deve ser uma data válida.');
    }
  }

  create(data: CreateTaskDto) {
    this.validateTaskAttributes(data); //validar o atributo dos campos enviados

    return this.prisma.task.create({ data }); //criar tarefa
  }

  findAll() {
    return this.prisma.task.findMany(); //search geral
  }

  async findOne(filters: { id?: number; name?: string; description?: string }) {
    const { id, name, description } = filters; //capturar filtros
  
    const conditions: Prisma.TaskWhereInput[] = [];
  
    //pelo id
    if (id !== undefined) {
      conditions.push({ id });
    }
  
    //pelo nome
    if (name) {
      conditions.push({
        name: {
          contains: name,
        },
      });
    }
  
    //pela descrição
    if (description) {
      conditions.push({
        description: {
          contains: description,
        },
      });
    }
  
    //caso não haja filtro
    if (conditions.length === 0) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  
    //retorno da pesquisa
    return this.prisma.task.findFirst({
      where: {
        OR: conditions,
      },
    });
  }

  async update(id: number, data: UpdateTaskDto) {
    this.validateTaskAttributes(data); //validar o atributo dos campos enviados

    const task = await this.prisma.task.findUnique({ where: { id } }); //verifica se a tarefa existe
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined) //filtrar e retirar campos vazios
    );

    await this.prisma.task.update({
      where: { id },
      data: cleanData,
    });

    //atualizar
    return { message: 'Tarefa atualizada com sucesso.' };
  }

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } }); //verificar se a tarefa existe
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }
  
    await this.prisma.task.delete({ where: { id } }); //deletar

      return { message: 'Tarefa removida com sucesso.' }; //retorno para o user
    } catch (error: Error) {
      throw new InternalServerErrorException(`Erro: ${error.message}`);
  }
}