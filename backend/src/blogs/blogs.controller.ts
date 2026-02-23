import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    @Get('public/feed')
    getFeed(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
        return this.blogsService.getFeed(Number(page), Number(limit));
    }

    @Get('public/blogs/:slug')
    getBySlug(@Param('slug') slug: string) {
        return this.blogsService.getBySlug(slug);
    }
}
