import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { BlogPost } from './blog-post.entity';
import { CreateBlogInput, UpdateBlogInput } from './blog.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(
    private blogService: BlogService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Query(() => [BlogPost])
  async blogs(): Promise<BlogPost[]> {
    return this.blogService.getAllBlogs();
  }

  @Query(() => BlogPost, { nullable: true })
  async blog(@Args('id') id: number): Promise<BlogPost | null> {
    return this.blogService.getBlogById(id);
  }

  @Mutation(() => BlogPost)
  @UseGuards(GqlAuthGuard)
  async createBlog(
    @Args('input') input: CreateBlogInput,
    @Context() context: any,
  ): Promise<BlogPost> {
    const userId = context.req.user.userId;
    const blogPost = await this.blogService.createBlog(
      input.title,
      input.content,
      userId,
    );

    // Emit real-time notification
    this.notificationsGateway.notifyNewBlog(blogPost);

    return blogPost;
  }

  @Mutation(() => BlogPost, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async updateBlog(
    @Args('input') input: UpdateBlogInput,
  ): Promise<BlogPost | null> {
    return this.blogService.updateBlog(input.id, input.title, input.content);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteBlog(@Args('id') id: number): Promise<boolean> {
    try {
      await this.blogService.deleteBlog(id);
      return true;
    } catch {
      return false;
    }
  }
}
