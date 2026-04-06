import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './blog-post.entity';
import { User } from '../users/user.entity';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, User]), NotificationsModule],
  providers: [BlogService, BlogResolver],
  exports: [TypeOrmModule, BlogService],
})
export class BlogModule {}
