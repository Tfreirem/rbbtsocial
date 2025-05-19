import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AspectRatio } from '../ui/aspect-ratio';
import { Badge } from '../ui/badge';
import { MessageCircle, Bookmark, ExternalLink } from 'lucide-react';
import { RiHeartFill } from 'react-icons/ri';

interface TopEngagementPostProps {
  postImage: string;
  postTitle: string;
  postDate: string;
  engagementScore: number;
  likes: number;
  comments: number;
  saved: number;
  postType: 'feed' | 'reel';
  postUrl?: string; // URL do post original
}

const TopEngagementPostCard: React.FC<TopEngagementPostProps> = ({
  postImage,
  postTitle,
  postDate,
  engagementScore,
  likes,
  comments,
  saved,
  postType,
  postUrl
}) => {
  const handlePostClick = () => {
    if (postUrl) {
      window.open(postUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="overflow-hidden bg-[#111111] border-zinc-800 h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg font-semibold text-white">Post com maior engajamento</CardTitle>
          <Badge 
            variant="outline" 
            className={`${postType === 'reel' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}
          >
            {postType === 'reel' ? 'Reels' : 'Feed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="mb-4 cursor-pointer relative group" onClick={handlePostClick}>
          <AspectRatio ratio={16 / 9} className="bg-zinc-950 rounded-md overflow-hidden">
            <img 
              src={postImage} 
              alt={postTitle} 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {postUrl && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <ExternalLink className="text-white w-8 h-8" />
              </div>
            )}
          </AspectRatio>
        </div>
        <div className="flex-grow">
          <h3 
            className="text-white font-medium mb-1 line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors duration-200"
            onClick={handlePostClick}
          >
            {postTitle}
          </h3>
          <p className="text-xs text-zinc-400 mb-3">{postDate}</p>
          
          <div className="bg-zinc-800/50 rounded p-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Engajamento</span>
              <span className="text-sm font-medium text-white">{engagementScore.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-zinc-400">
            <div className="flex flex-col items-center justify-center bg-zinc-900/50 p-2 rounded">
              <RiHeartFill size={18} className="text-red-500 mb-1" />
              <span className="text-xs">{likes.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-zinc-900/50 p-2 rounded">
              <MessageCircle size={16} className="text-blue-500 mb-1" />
              <span className="text-xs">{comments.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-zinc-900/50 p-2 rounded">
              <Bookmark size={16} className="text-green-500 mb-1" />
              <span className="text-xs">{saved.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopEngagementPostCard; 