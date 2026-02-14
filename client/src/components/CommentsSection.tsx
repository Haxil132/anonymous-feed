import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading, refetch } = trpc.comments.list.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
  );

  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("Комментарий добавлен!");
      setNewComment("");
      refetch();
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении комментария: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Введите текст комментария");
      return;
    }

    createCommentMutation.mutate({
      postId,
      content: newComment,
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Написать комментарий..."
            rows={2}
            maxLength={1000}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={createCommentMutation.isPending || !newComment.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {createCommentMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <span className="text-primary text-sm font-bold">А</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Аноним</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { 
                      addSuffix: true, 
                      locale: ru 
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap ml-10">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4">
            Пока нет комментариев. Будьте первым!
          </p>
        )}
      </div>
    </div>
  );
}
