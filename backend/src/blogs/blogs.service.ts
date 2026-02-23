import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogsService {
    constructor(private prisma: PrismaService) { }

    private slugify(text: string): string {
        return text.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);
    }

    async create(userId: string, dto: CreateBlogDto) {
        try {
            const slug = this.slugify(dto.title);
            return await this.prisma.blog.create({
                data: {
                    ...dto,
                    slug,
                    authorId: userId,
                    summary: dto.content.substring(0, 150) + '...',
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002') throw new ConflictException('Blog title/slug already exists');
            throw new InternalServerErrorException('Failed to create blog post');
        }
    }

    async findAllForUser(userId: string) {
        try {
            return await this.prisma.blog.findMany({
                where: { authorId: userId },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve blogs');
        }
    }

    async update(userId: string, blogId: string, dto: UpdateBlogDto) {
        try {
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            if (!blog) throw new NotFoundException('Blog not found');
            if (blog.authorId !== userId) throw new ForbiddenException('Not authorized');

            let slug = blog.slug;
            if (dto.title && dto.title !== blog.title) {
                slug = this.slugify(dto.title);
            }

            const summary = dto.content ? dto.content.substring(0, 150) + '...' : blog.summary;

            return await this.prisma.blog.update({
                where: { id: blogId },
                data: { ...dto, slug, summary },
            });
        } catch (error: any) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
            if (error.code === 'P2002') throw new ConflictException('Blog title/slug already exists');
            throw new InternalServerErrorException('Failed to update blog');
        }
    }

    async remove(userId: string, blogId: string) {
        try {
            const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
            if (!blog) throw new NotFoundException('Blog not found');
            if (blog.authorId !== userId) throw new ForbiddenException('Not authorized');

            return await this.prisma.blog.delete({ where: { id: blogId } });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
            throw new InternalServerErrorException('Failed to remove blog');
        }
    }

    // Public Routes
    async getBySlug(slug: string, viewerId?: string) {
        try {
            const includeParams: any = {
                author: { select: { id: true, email: true } },
                _count: { select: { likes: true, comments: true } },
            };

            if (viewerId) {
                includeParams.likes = {
                    where: { userId: viewerId },
                    select: { id: true },
                };
            }

            const blog = await this.prisma.blog.findFirst({
                where: { slug, isPublished: true },
                include: includeParams,
            });

            if (!blog) throw new NotFoundException('Blog not found');

            const isLikedByViewer = viewerId ? (blog as any).likes?.length > 0 : false;
            const response = { ...blog, isLikedByViewer };
            delete (response as any).likes;

            return response;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to retrieve blog');
        }
    }

    async getFeed(page: number, limit: number, viewerId?: string) {
        try {
            const skip = (page - 1) * limit;

            const includeParams: any = {
                author: { select: { id: true, email: true } },
                _count: { select: { likes: true, comments: true } },
            };

            if (viewerId) {
                includeParams.likes = {
                    where: { userId: viewerId },
                    select: { id: true },
                };
            }

            const [blogs, total] = await Promise.all([
                this.prisma.blog.findMany({
                    where: { isPublished: true },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: includeParams,
                }),
                this.prisma.blog.count({ where: { isPublished: true } }),
            ]);

            const mappedBlogs = blogs.map(blog => {
                const isLikedByViewer = viewerId ? (blog as any).likes?.length > 0 : false;
                const mapped = { ...blog, isLikedByViewer };
                delete (mapped as any).likes;
                return mapped;
            });

            return {
                data: mappedBlogs,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve feed');
        }
    }
}
