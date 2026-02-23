import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blogs')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id/comments')
    create(@Request() req, @Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
        return this.commentsService.create(req.user.id, id, createCommentDto);
    }

    @Get(':id/comments')
    findAll(@Param('id') id: string) {
        return this.commentsService.findAllForBlog(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/comments/:commentId')
    remove(@Request() req, @Param('id') id: string, @Param('commentId') commentId: string) {
        return this.commentsService.remove(req.user.id, id, commentId);
    }
}
