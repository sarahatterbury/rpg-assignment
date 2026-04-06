export const GET_BLOGS_QUERY = `
  query GetBlogs {
    blogs {
      id
      title
      content
      author {
        name
      }
      createdAt
    }
  }
`;

export const CREATE_BLOG_MUTATION = `
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
      title
      content
      author {
        name
      }
      createdAt
    }
  }
`;
