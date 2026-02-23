import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, blogId: string, dto: CreateCommentDto) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Blog not found');

        const comment = await this.prisma.comment.create({
            data: {
                content: dto.content,
                userId,
                blogId,
            },
            include: {
                user: { select: { id: true, email: true } },
            },
        });

        return comment;
    }

    async findAllForBlog(blogId: string) {
        return this.prisma.comment.findMany({
            where: { blogId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, email: true } },
            },
        });
    }
}
