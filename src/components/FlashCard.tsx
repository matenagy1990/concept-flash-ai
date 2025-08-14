import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlashCard as FlashCardType, getCategoryColor } from "@/hooks/useFlashcards";
import { Eye, RotateCcw, CheckCircle } from "lucide-react";

interface FlashCardProps {
  card: FlashCardType;
  isViewed: boolean;
  onView: (id: string) => void;
}

export const FlashCard = ({ card, isViewed, onView }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const categoryColor = getCategoryColor(card.category);

  const handleCardClick = () => {
    if (!isFlipped) {
      onView(card.id);
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <Card 
      className={`
        relative h-72 sm:h-80 cursor-pointer transition-all duration-500 ease-out
        ${isViewed 
          ? 'bg-gradient-to-br from-success/20 to-success/10 border-success/50 shadow-[var(--shadow-viewed)]' 
          : 'bg-gradient-to-br from-card to-card/80 border-border/50 shadow-[var(--shadow-card)]'
        }
        hover:shadow-[var(--shadow-hover)] hover:scale-105 active:scale-95
        animate-fadeIn group
      `}
      onClick={handleCardClick}
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`
          relative w-full h-full transition-transform duration-600 ease-in-out preserve-3d
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start mb-4">
            <Badge 
              variant="secondary" 
              className={`bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/30 text-xs`}
            >
              {card.category}
            </Badge>
            {isViewed && (
              <div className="flex items-center gap-1 text-success text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Read</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2">
            <h3 className="text-lg sm:text-xl font-bold text-center text-foreground leading-tight">
              {card.phrase}
            </h3>
          </div>
          
          <div className="flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
            <span>Tap to reveal</span>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg p-6 flex flex-col justify-between rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex justify-between items-start mb-4">
            <Badge 
              variant="secondary" 
              className={`bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/30`}
            >
              {card.category}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Tap to flip back</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center px-2">
            <h4 className="text-base sm:text-lg font-semibold text-primary mb-3">
              {card.phrase}
            </h4>
            <p className="text-foreground text-sm sm:text-base leading-relaxed">
              {card.definition}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};