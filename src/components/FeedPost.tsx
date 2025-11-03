import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { Post } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeedPostProps {
  post: Post;
  onLike: (postId: string) => void;
}

export function FeedPost({ post, onLike }: FeedPostProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-gray-900">{post.author}</div>
            <p className="text-gray-500">{post.timestamp}</p>
          </div>
        </div>

        <p className="text-gray-800 mb-3">{post.content}</p>

        {post.image && (
          <ImageWithFallback
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg mb-3"
          />
        )}

        <div className="flex items-center gap-6 pt-3 border-t">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.liked
                ? 'text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={post.liked ? 'currentColor' : 'none'}
            />
            <span>{post.likes}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
