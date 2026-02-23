import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }

            const saltOrRounds = 10;
            const passwordHash = await bcrypt.hash(dto.password, saltOrRounds);

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    passwordHash,
                },
                select: { id: true, email: true, createdAt: true, role: true, name: true },
            });

            const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
            return {
                user,
                accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
                refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
            };
        } catch (error: any) {
            if (error instanceof ConflictException) throw error;
            if (error.code === 'P2002') throw new ConflictException('Email already exists');
            throw new InternalServerErrorException('Registration failed. Please try again later.');
        }
    }

    async login(dto: LoginDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
            if (!isMatch) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
            return {
                user: { id: user.id, email: user.email, createdAt: user.createdAt, role: user.role, name: user.name },
                accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
                refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
            };
        } catch (error: any) {
            if (error instanceof UnauthorizedException) throw error;
            throw new InternalServerErrorException('Login failed. Please try again later.');
        }
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }
            const newPayload = { email: user.email, sub: user.id, role: user.role, name: user.name };
            return {
                accessToken: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
                refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
