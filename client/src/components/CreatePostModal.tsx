import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({ open, onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const createPostMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      toast.success("Пост успешно создан!");
      resetForm();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error("Ошибка при создании поста: " + error.message);
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("Файл слишком большой. Максимальный размер: 16MB");
      return;
    }

    // Validate file type
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Неподдерживаемый формат файла");
      return;
    }

    setMediaFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    let mediaData;
    if (mediaFile) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(mediaFile);
      });

      const base64 = await base64Promise;
      const extension = mediaFile.name.split('.').pop() || 'bin';

      mediaData = {
        data: base64,
        type: mediaFile.type,
        extension,
      };
    }

    createPostMutation.mutate({
      title,
      description,
      mediaFile: mediaData,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Создать пост</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-foreground">
              Название поста *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название..."
              maxLength={255}
              className="mt-1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-foreground">
              Описание *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите подробнее..."
              rows={6}
              className="mt-1"
              required
            />
          </div>

          {/* Media Upload */}
          <div>
            <Label className="text-foreground">
              Медиа (необязательно)
            </Label>
            {!mediaFile ? (
              <div className="mt-1">
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Нажмите для загрузки фото, видео или аудио
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Максимальный размер: 16MB
                    </p>
                  </div>
                </label>
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mt-1 relative">
                <div className="border border-border rounded-lg p-4">
                  {mediaFile.type.startsWith('image/') && mediaPreview && (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="w-full max-h-64 object-contain rounded"
                    />
                  )}
                  {mediaFile.type.startsWith('video/') && mediaPreview && (
                    <video 
                      src={mediaPreview} 
                      controls 
                      className="w-full max-h-64 rounded"
                    />
                  )}
                  {mediaFile.type.startsWith('audio/') && (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">
                        🎵 {mediaFile.name}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeMedia}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createPostMutation.isPending}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                "Опубликовать"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
