import { Injectable } from '@nestjs/common';
import { SignUpDTO } from '../auth/dto/auth.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.user.findUnique({
            where: {
                id: Number(id),
            }
        });
    }

    async update(id: number, body: SignUpDTO) {
        return await this.prisma.user.update({
            where: {
                id: id
            },
            data: body,
        });
    }

    async delete(id: number) {
        return await this.prisma.user.delete({
            where: {
                id: id
            }
        });
    }
}
