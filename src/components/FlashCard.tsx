import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlashCard as FlashCardType, getCategoryColor } from "@/data/flashcards";
import { Eye, RotateCcw } from "lucide-react";

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
        relative h-80 cursor-pointer transition-all duration-300 ease-in-out
        bg-gradient-to-br from-card to-card/80 border-border/50
        hover:shadow-[var(--shadow-hover)] hover:scale-105
        animate-fadeIn group
        ${isViewed ? 'ring-2 ring-primary/30' : ''}
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
              className={`bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/30`}
            >
              {card.category}
            </Badge>
            {isViewed && (
              <div className="flex items-center gap-1 text-primary text-sm">
                <Eye className="w-4 h-4" />
                <span>Viewed</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-2xl font-bold text-center text-foreground leading-tight">
              {card.phrase}
            </h3>
          </div>
          
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <span>Click to reveal definition</span>
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
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <RotateCcw className="w-4 h-4" />
              <span>Click to flip back</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-lg font-semibold text-primary mb-3">
              {card.phrase}
            </h4>
            <p className="text-foreground leading-relaxed">
              {card.definition}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};