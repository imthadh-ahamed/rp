import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '../../../types/data/blog';

type Props = {
  blog: Blog;
};

const BlogCard: React.FC<Props> = ({ blog }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-semidark">
      {blog.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={blog.coverImage}
            alt={blog.title || 'Blog post'}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        {blog.date && (
          <p className="text-xs text-gray-400 mb-2">{blog.date}</p>
        )}
        {blog.title && (
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
            {blog.title}
          </h3>
        )}
        {blog.excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
            {blog.excerpt}
          </p>
        )}
        {blog.slug && (
          <Link
            href={`/blog/${blog.slug}`}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            Read more →
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
