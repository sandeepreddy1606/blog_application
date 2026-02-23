import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller()
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    // --- PRIVATE DASHBOARD ROUTES ---
    @UseGuards(JwtAuthGuard)
    @Post('blogs')
    create(@Request() req, @Body() createBlogDto: CreateBlogDto) {
        return this.blogsService.create(req.user.id, createBlogDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('blogs')
    findAllForUser(@Request() req) {
        return this.blogsService.findAllForUser(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('blogs/:id')
    update(@Request() req, @Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(req.user.id, id, updateBlogDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('blogs/:id')
    remove(@Request() req, @Param('id') id: string) {
        return this.blogsService.remove(req.user.id, id);
    }

    // --- PUBLIC ROUTES ---
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @UseGuards(OptionalJwtAuthGuard)
    @Get('public/feed')
    getFeed(
        @Request() req,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        const viewerId = req.user?.id;
        return this.blogsService.getFeed(page, limit, viewerId);
    }

    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @UseGuards(OptionalJwtAuthGuard)
    @Get('public/blogs/:slug')
    getBySlug(@Request() req, @Param('slug') slug: string) {
        const viewerId = req.user?.id;
        return this.blogsService.getBySlug(slug, viewerId);
    }
}
