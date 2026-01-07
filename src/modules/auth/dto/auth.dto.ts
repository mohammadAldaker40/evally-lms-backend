import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({ example: 'student@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'STUDENT', enum: Role, required: false, description: 'User role (default: STUDENT)' })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}

export class LoginDto {
    @ApiProperty({ example: 'student@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh token used to obtain a new access token',
    })
    @IsString()
    refreshToken: string;
}