import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ThumbsUp, Heart, Smile, Frown, Angry } from 'lucide-react';
import { toast } from 'sonner';

const REACTIONS = [
  { key: 'likes', icon: ThumbsUp, label: 'Gosto', color: 'text-blue-600 bg-blue-100' },
  { key: 'loves', icon: Heart, label: 'Adoro', color: 'text-red-500 bg-red-100' },
  { key: 'courage', icon: Smile, label: 'Força', color: 'text-yellow-600 bg-yellow-100' },
  { key: 'sad', icon: Frown, label: 'Triste', color: 'text-purple-600 bg-purple-100' },
  { key: 'angry', icon: Angry, label: 'Irritado', color: 'text-orange-600 bg-orange-100' },
];

export default function NewsReactions({ post, userCredential, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const getCurrentReaction = () => {
    for (const reaction of REACTIONS) {
      if (post[reaction.key]?.includes(userCredential)) {
        return reaction.key;
      }
    }
    return null;
  };

  const currentReaction = getCurrentReaction();

  const handleReaction = async (reactionKey) => {
    if (!userCredential) {
      toast.error('Faça login para reagir');
      return;
    }

    setLoading(true);
    setPopoverOpen(false);
    
    try {
      const updates = {};
      
      // Remove from all reactions first
      for (const reaction of REACTIONS) {
        const currentList = post[reaction.key] || [];
        if (currentList.includes(userCredential)) {
          updates[reaction.key] = currentList.filter(id => id !== userCredential);
        }
      }

      // Add to new reaction if different from current
      if (currentReaction !== reactionKey) {
        const targetList = post[reactionKey] || [];
        if (!targetList.includes(userCredential)) {
          updates[reactionKey] = [...targetList, userCredential];
        }
      }

      if (Object.keys(updates).length > 0) {
        await base44.entities.NewsPost.update(post.id, updates);
        onUpdate();
      }
    } catch (error) {
      toast.error('Erro ao reagir');
    } finally {
      setLoading(false);
    }
  };

  const getTotalReactions = () => {
    return REACTIONS.reduce((sum, r) => sum + (post[r.key]?.length || 0), 0);
  };

  const CurrentIcon = currentReaction 
    ? REACTIONS.find(r => r.key === currentReaction)?.icon || ThumbsUp
    : ThumbsUp;

  return (
    <div className="flex items-center gap-2">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={loading}
            className={currentReaction ? REACTIONS.find(r => r.key === currentReaction)?.color : ''}
          >
            <CurrentIcon className="h-4 w-4 mr-1" />
            {currentReaction ? REACTIONS.find(r => r.key === currentReaction)?.label : 'Reagir'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-1">
            {REACTIONS.map((reaction) => {
              const Icon = reaction.icon;
              const isSelected = currentReaction === reaction.key;
              return (
                <button
                  key={reaction.key}
                  onClick={() => handleReaction(reaction.key)}
                  className={`p-2 rounded-full transition-all hover:scale-125 ${
                    isSelected ? reaction.color : 'hover:bg-slate-100'
                  }`}
                  title={reaction.label}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? '' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Reaction counts */}
      {getTotalReactions() > 0 && (
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <div className="flex -space-x-1">
            {REACTIONS.filter(r => (post[r.key]?.length || 0) > 0).slice(0, 3).map(reaction => {
              const Icon = reaction.icon;
              return (
                <div key={reaction.key} className={`p-1 rounded-full ${reaction.color}`}>
                  <Icon className="h-3 w-3" />
                </div>
              );
            })}
          </div>
          <span>{getTotalReactions()}</span>
        </div>
      )}
    </div>
  );
}