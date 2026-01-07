"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user,
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create(Object.assign(Object.assign({}, registerDto), { password: hashedPassword }));
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _password } = user, userWithoutPassword = __rest(user, ["password"]);
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            user: userWithoutPassword,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const refreshMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!refreshMatches) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
        };
    }
    async refreshWithToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET') || this.configService.get('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
            });
            return this.refreshTokens(payload.sub, refreshToken);
        }
        catch (_a) {
            throw new common_1.ForbiddenException('Invalid refresh token');
        }
    }
    async getTokens(userId, email, role) {
        const payload = { email, sub: userId, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET') || this.configService.get('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map