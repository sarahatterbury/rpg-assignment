<template>
  <div class="blog-container">
    <!-- Create Blog Form -->
    <div v-if="isAuthenticated" class="create-blog">
      <h3>Create New Blog Post</h3>
      <form @submit.prevent="handleCreateBlogSubmit">
        <div class="form-group">
          <label for="title">Title:</label>
          <input
            id="title"
            v-model="newBlog.title"
            type="text"
            required
            placeholder="Enter blog title"
          />
        </div>
        <div class="form-group">
          <label for="content">Content:</label>
          <textarea
            id="content"
            v-model="newBlog.content"
            required
            placeholder="Enter blog content"
            rows="4"
          ></textarea>
        </div>
        <button type="submit" :disabled="createLoading">
          {{ createLoading ? 'Creating...' : 'Create Blog Post' }}
        </button>
        <p v-if="createError" class="error">{{ createError }}</p>
      </form>
    </div>

    <!-- Blog Posts List -->
    <div class="blog-posts">
      <h2>Older Posts</h2>
      <div v-if="loading" class="loading">
        Loading posts...
      </div>
      <div v-else-if="blogs?.length === 0" class="no-posts">
        No posts yet. {{ isAuthenticated ? 'Be the first to write one!' : 'Login to write a blog post.' }}
      </div>
      <div v-else v-for="blog in blogs" :key="blog.id" class="blog-post">
        <h3>{{ blog.title }}</h3>
        <p class="author">By {{ blog.author.name }} on {{ formatDate(blog.createdAt) }}</p>
        <p class="content">{{ blog.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useBlog } from '@/composables/useBlog';

defineOptions({
  name: 'BlogListContainer'
});

const { isAuthenticated } = useAuth();
const { blogs, loading, fetchBlogs, createBlog } = useBlog();

const newBlog = ref({
  title: '',
  content: ''
});

const createLoading = ref(false);
const createError = ref<string | null>(null);

const handleCreateBlogSubmit = async () => {
  if (!newBlog.value.title.trim() || !newBlog.value.content.trim()) {
    return;
  }

  createLoading.value = true;
  createError.value = null;

  try {
    await createBlog(newBlog.value.title, newBlog.value.content);
    newBlog.value = { title: '', content: '' };
  } catch (err: unknown) {
    createError.value = err instanceof Error ? err.message : 'Failed to create blog post';
  } finally {
    createLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  if (isAuthenticated.value) {
    fetchBlogs();
  }
});
</script>

<style scoped>
.blog-container {
  width: 100%;
  margin: 0;
  padding: 2rem;
}

@media (max-width: 768px) {
  .blog-container {
    width: 100%;
  }
  
  .create-blog {
    padding: 1rem;
  }
  
  .blog-post {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .blog-container {
    width: 100%;
  }
  
  .create-blog {
    padding: 0.75rem;
  }
  
  .blog-post {
    padding: 0.75rem;
  }
  
  .blog-post h3 {
    font-size: 1rem;
  }
  
  .content {
    font-size: 0.9rem;
  }
  
  input, textarea {
    padding: 0.6rem;
  }
  
  button {
    padding: 0.6rem 1rem;
  }
}

.create-blog {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #2a2a2a;
}

.create-blog h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #b0b0b0;
  font-size: 0.9rem;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  background: #0a0a0a;
  color: #ffffff;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #2563eb;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

input::placeholder, textarea::placeholder {
  color: #6a6a6a;
}

button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background: #1d4ed8;
}

button:disabled {
  background: #374151;
  cursor: not-allowed;
}

.error {
  color: #ef4444;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.blog-posts {
  margin-top: 1rem;
}

.blog-post {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #2a2a2a;
}

.blog-post h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
}

.author {
  color: #6a6a6a;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.content {
  line-height: 1.5;
  color: #b0b0b0;
  font-size: 0.95rem;
}

.no-posts {
  text-align: center;
  color: #6a6a6a;
  font-style: italic;
  padding: 3rem 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6a6a6a;
  font-style: italic;
}

.blog-posts h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

@media (max-width: 480px) {
  .blog-container {
    width: 100%;
  }
  
  .create-blog {
    padding: 1rem;
  }
  
  .blog-posts {
    padding: 1rem;
  }
  
  .blog-post {
    padding: 1rem;
  }
  
  .blog-post h3 {
    font-size: 1.1rem;
  }
  
  .blog-post .content {
    font-size: 0.9rem;
  }
}
</style>
