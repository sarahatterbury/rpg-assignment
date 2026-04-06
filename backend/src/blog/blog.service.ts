import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './blog-post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostsRepository: Repository<BlogPost>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createBlog(
    title: string,
    content: string,
    userId: number,
  ): Promise<BlogPost> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const blogPost = this.blogPostsRepository.create({
      title,
      content,
      author: user,
    });
    return this.blogPostsRepository.save(blogPost);
  }

  async getAllBlogs(): Promise<BlogPost[]> {
    return this.blogPostsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBlogById(id: number): Promise<BlogPost | null> {
    return this.blogPostsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async getBlogsByUser(userId: number): Promise<BlogPost[]> {
    return this.blogPostsRepository.find({
      where: { author: { id: userId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBlog(
    id: number,
    title: string,
    content: string,
  ): Promise<BlogPost | null> {
    await this.blogPostsRepository.update(id, { title, content });
    return this.getBlogById(id);
  }

  async deleteBlog(id: number): Promise<void> {
    await this.blogPostsRepository.delete(id);
  }
}
