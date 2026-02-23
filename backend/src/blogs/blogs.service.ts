import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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
        const slug = this.slugify(dto.title);
        return this.prisma.blog.create({
            data: {
                ...dto,
                slug,
                authorId: userId,
                summary: dto.content.substring(0, 150) + '...', // Simple summary generator
            },
        });
    }

    async findAllForUser(userId: string) {
        return this.prisma.blog.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(userId: string, blogId: string, dto: UpdateBlogDto) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Blog not found');
        if (blog.authorId !== userId) throw new ForbiddenException('Not authorized');

        let slug = blog.slug;
        if (dto.title && dto.title !== blog.title) {
            slug = this.slugify(dto.title);
        }

        const summary = dto.content ? dto.content.substring(0, 150) + '...' : blog.summary;

        return this.prisma.blog.update({
            where: { id: blogId },
            data: { ...dto, slug, summary },
        });
    }

    async remove(userId: string, blogId: string) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) throw new NotFoundException('Blog not found');
        if (blog.authorId !== userId) throw new ForbiddenException('Not authorized');

        return this.prisma.blog.delete({ where: { id: blogId } });
    }

    // Public Routes
    async getBySlug(slug: string) {
        const blog = await this.prisma.blog.findFirst({
            where: { slug, isPublished: true },
            include: {
                author: { select: { id: true, email: true } },
                _count: { select: { likes: true, comments: true } },
            },
        });

        if (!blog) throw new NotFoundException('Blog not found');
        return blog;
    }

    async getFeed(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [blogs, total] = await Promise.all([
            this.prisma.blog.findMany({
                where: { isPublished: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: { select: { id: true, email: true } },
                    _count: { select: { likes: true, comments: true } },
                },
            }),
            this.prisma.blog.count({ where: { isPublished: true } }),
        ]);

        return {
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
