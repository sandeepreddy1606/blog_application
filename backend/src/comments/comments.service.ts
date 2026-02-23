import { Injectable, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, blogId: string, dto: CreateCommentDto) {
        try {
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            if (!blog) throw new NotFoundException('Blog not found');

            const comment = await this.prisma.comment.create({
                data: {
                    content: dto.content,
                    userId,
                    blogId,
                    parentId: dto.parentId || null,
                },
                include: {
                    user: { select: { id: true, email: true } },
                },
            });

            return comment;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to add comment');
        }
    }

    async findAllForBlog(blogId: string) {
        try {
            return await this.prisma.comment.findMany({
                where: { blogId, parentId: null },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true } },
                    replies: {
                        include: { user: { select: { id: true, email: true } } },
                        orderBy: { createdAt: 'desc' },
                    }
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve comments');
        }
    }

    async remove(userId: string, blogId: string, commentId: string) {
        try {
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            if (!blog) throw new NotFoundException('Blog not found');

            // Only the blog creator can delete comments
            if (blog.authorId !== userId) {
                throw new ForbiddenException('Only the blog creator can delete comments');
            }

            const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
            if (!comment || comment.blogId !== blogId) {
                throw new NotFoundException('Comment not found');
            }

            await this.prisma.comment.delete({ where: { id: commentId } });

            return { success: true, message: 'Comment deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
            throw new InternalServerErrorException('Failed to delete comment');
        }
    }
}
