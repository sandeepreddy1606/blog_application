import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private prisma: PrismaService) { }

    async like(userId: string, blogId: string) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Blog not found');

        try {
            await this.prisma.like.create({
                data: { userId, blogId },
            });

            const likeCount = await this.prisma.like.count({ where: { blogId } });
            return { likeCount };
        } catch (error: any) {
            if (error.code === 'P2002') { // Unique constraint violation in Prisma
                throw new ConflictException('User already liked this blog');
            }
            throw new InternalServerErrorException('Failed to like blog');
        }
    }

    async unlike(userId: string, blogId: string) {
        try {
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            if (!blog) throw new NotFoundException('Blog not found');

            const like = await this.prisma.like.findUnique({
                where: { userId_blogId: { userId, blogId } },
            });

            if (!like) {
                throw new NotFoundException('Like not found');
            }

            await this.prisma.like.delete({
                where: { id: like.id },
            });

            const likeCount = await this.prisma.like.count({ where: { blogId } });
            return { likeCount };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to unlike blog');
        }
    }
}
