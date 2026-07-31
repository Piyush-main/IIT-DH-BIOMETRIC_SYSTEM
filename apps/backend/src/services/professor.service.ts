import { professorRepository } from '../repositories/professor.repository.js';
import { AppError } from '../utils/AppError.js';
import type { CreateProfessorInput, UpdateProfessorInput } from '@attendance/validation';

export const professorService = {
  async list(params: { page: number; pageSize: number; search?: string }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await professorRepository.findMany({
      skip,
      take: params.pageSize,
      search: params.search,
    });
    return { items, total, page: params.page, pageSize: params.pageSize };
  },

  async getById(profId: string) {
    const prof = await professorRepository.findById(profId);
    if (!prof) {
      throw AppError.notFound(`Professor '${profId}' does not exist`);
    }
    return prof;
  },

  async create(input: CreateProfessorInput) {
    const existing = await professorRepository.findById(input.profId);
    if (existing) {
      throw AppError.conflict(`Professor '${input.profId}' already exists`);
    }
    return professorRepository.create({
      profId: input.profId,
      name: input.name,
      email: input.email ?? null,
      department: { connect: { deptCode: input.dept } },
    });
  },

  async update(profId: string, input: UpdateProfessorInput) {
    await this.getById(profId);
    return professorRepository.update(profId, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.dept !== undefined && { department: { connect: { deptCode: input.dept } } }),
    });
  },

  async remove(profId: string) {
    await this.getById(profId);
    await professorRepository.remove(profId);
  },
};
