import { Controller, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blogs')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    likeBlog(@Request() req, @Param('id') id: string) {
        return this.likesService.like(req.user.id, id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/like')
    unlikeBlog(@Request() req, @Param('id') id: string) {
        return this.likesService.unlike(req.user.id, id);
    }
}
