import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function NewsComments({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const canComment = user && (user.user_type === 'aluno' || user.user_type === 'encarregado');

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.NewsComment.filter({ 
        post_id: postId,
        is_active: true 
      }, '-created_date');
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasUserCommented = () => {
    if (!user) return false;
    return comments.some(c => c.user_credential === user.credential);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Escreva um comentário');
      return;
    }

    if (hasUserCommented()) {
      toast.error('Você já comentou nesta publicação');
      return;
    }

    setSubmitting(true);
    try {
      await base44.entities.NewsComment.create({
        post_id: postId,
        user_credential: user.credential,
        user_name: user.full_name,
        user_type: user.user_type,
        content: newComment.trim()
      });

      setNewComment('');
      toast.success('Comentário publicado!');
      loadComments();
    } catch (error) {
      toast.error('Erro ao publicar comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
  };

  return (
    <div className="border-t pt-3">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="text-slate-600"
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Comentários {comments.length > 0 && `(${comments.length})`}
      </Button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {/* Comment Form */}
          {canComment && !hasUserCommented() && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                className="flex-1 min-h-0"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={submitting}
                className="bg-[#1a365d] hover:bg-[#2c4a7c]"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          )}

          {canComment && hasUserCommented() && (
            <p className="text-sm text-slate-500 italic">Você já comentou nesta publicação</p>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-2">Ainda não há comentários</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 bg-slate-50 rounded-lg p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#1a365d] text-white text-xs">
                      {getInitials(comment.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.user_name}</span>
                      <span className="text-xs text-slate-400 capitalize">
                        ({comment.user_type})
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {format(new Date(comment.created_date), "d MMM 'às' HH:mm", { locale: pt })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}