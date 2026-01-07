import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user,
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        // Auto login after register
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _password, ...userWithoutPassword } = user;
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user: userWithoutPassword,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Access denied');
        }

        const refreshMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!refreshMatches) {
            throw new ForbiddenException('Access denied');
        }

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
        };
    }

    async refreshWithToken(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
            });
            return this.refreshTokens(payload.sub, refreshToken);
        } catch {
            throw new ForbiddenException('Invalid refresh token');
        }
    }

    private async getTokens(userId: string, email: string, role: string) {
        const payload = { email, sub: userId, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
}
