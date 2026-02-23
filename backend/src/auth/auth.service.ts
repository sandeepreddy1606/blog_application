import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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
                passwordHash,
            },
            select: { id: true, email: true, createdAt: true },
        });

        const payload = { email: user.email, sub: user.id };
        return {
            user,
            accessToken: this.jwtService.sign(payload),
        };
    }

    async login(dto: LoginDto) {
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

        const payload = { email: user.email, sub: user.id };
        return {
            user: { id: user.id, email: user.email, createdAt: user.createdAt },
            accessToken: this.jwtService.sign(payload),
        };
    }
}
