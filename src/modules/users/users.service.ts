import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export type UserWithRefresh = User & { hashedRefreshToken?: string | null };

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<UserWithRefresh | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<UserWithRefresh | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<UserWithRefresh> {
        return this.prisma.user.create({
            data,
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken } as any,
        });
    }

    async clearRefreshToken(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: null } as any,
        });
    }
}
