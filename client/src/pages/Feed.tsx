import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Heart, MessageCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import CreatePostModal from "@/components/CreatePostModal";
import CommentsSection from "@/components/CommentsSection";

export default function Feed() {
  const [offset, setOffset] = useState(0);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data: posts, isLoading, refetch } = trpc.posts.list.useQuery(
    { limit: 20, offset },
    { 
      refetchOnWindowFocus: false,
      enabled: hasMore,
    }
  );

  const likeMutation = trpc.likes.toggle.useMutation({
    onSuccess: (data, variables) => {
      // Optimistically update the UI
      setAllPosts(prev => prev.map(post => 
        post.id === variables.postId 
          ? { ...post, likeCount: data.likeCount, hasLiked: !post.hasLiked }
          : post
      ));
    },
  });

  useEffect(() => {
    if (posts && posts.length > 0) {
      setAllPosts(prev => {
        const newPosts = posts.filter(
          newPost => !prev.some(existingPost => existingPost.id === newPost.id)
        );
        return [...prev, ...newPosts];
      });
      
      if (posts.length < 20) {
        setHasMore(false);
      }
    } else if (posts && posts.length === 0) {
      setHasMore(false);
    }
  }, [posts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          setOffset(prev => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  const handleLike = (postId: number) => {
    likeMutation.mutate({ postId });
  };

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handlePostCreated = () => {
    setAllPosts([]);
    setOffset(0);
    setHasMore(true);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Лента</h1>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать пост
          </Button>
        </div>
      </header>

      {/* Feed */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="space-y-6">
          {allPosts.map(post => (
            <Card key={post.id} className="bg-card border-border p-6">
              {/* Post Header */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">А</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Аноним</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), { 
                      addSuffix: true, 
                      locale: ru 
                    })}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <h2 className="text-xl font-bold text-foreground mb-2">{post.title}</h2>
              <p className="text-foreground/90 mb-4 whitespace-pre-wrap">{post.description}</p>

              {/* Media */}
              {post.mediaUrl && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  {post.mediaType === 'image' && (
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      className="w-full max-h-96 object-cover"
                    />
                  )}
                  {post.mediaType === 'video' && (
                    <video 
                      src={post.mediaUrl} 
                      controls 
                      className="w-full max-h-96"
                    />
                  )}
                  {post.mediaType === 'audio' && (
                    <audio 
                      src={post.mediaUrl} 
                      controls 
                      className="w-full"
                    />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.hasLiked ? "text-primary" : "text-muted-foreground"}
                >
                  <Heart 
                    className={`w-5 h-5 mr-2 ${post.hasLiked ? "fill-current" : ""}`} 
                  />
                  {post.likeCount}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="text-muted-foreground"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {post.commentCount}
                </Button>
              </div>

              {/* Comments Section */}
              {expandedComments.has(post.id) && (
                <CommentsSection postId={post.id} />
              )}
            </Card>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="h-10" />

        {/* End of feed message */}
        {!hasMore && allPosts.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Вы достигли конца ленты
          </div>
        )}

        {/* Empty state */}
        {!isLoading && allPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              Пока нет постов
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Создать первый пост
            </Button>
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handlePostCreated}
      />
    </div>
  );
}
