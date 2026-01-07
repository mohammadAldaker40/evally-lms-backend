import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export type UserWithRefresh = User & {
    hashedRefreshToken?: string | null;
};
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(email: string): Promise<UserWithRefresh | null>;
    findById(id: string): Promise<UserWithRefresh | null>;
    create(data: Prisma.UserCreateInput): Promise<UserWithRefresh>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    clearRefreshToken(userId: string): Promise<void>;
}
