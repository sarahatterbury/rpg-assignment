import { ref } from 'vue';
import { graphqlService } from '@/services/graphql';
import { GET_BLOGS_QUERY, CREATE_BLOG_MUTATION } from '@/graphql/blog';

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export function useBlog() {
  const blogs = ref<Blog[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBlogs = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await graphqlService.query<{ blogs: Blog[] }>(GET_BLOGS_QUERY);
      blogs.value = result.blogs || [];
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch blogs';
    } finally {
      loading.value = false;
    }
  };

  const createBlog = async (title: string, content: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      await graphqlService.mutate<{ createBlog: Blog }>(CREATE_BLOG_MUTATION, {
        input: { title, content }
      });
      
      // Auto-refetch after creating a blog
      await fetchBlogs();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create blog post';
    } finally {
      loading.value = false;
    }
  };

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    createBlog
  };
}
