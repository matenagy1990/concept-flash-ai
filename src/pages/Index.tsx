import { useState, useMemo } from "react";
import { FlashCard } from "@/components/FlashCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProgressTracker } from "@/components/ProgressTracker";
import { flashcardData } from "@/data/flashcards";
import { Brain, Sparkles } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  const filteredCards = useMemo(() => {
    if (selectedCategory === "All") {
      return flashcardData;
    }
    return flashcardData.filter(card => card.category === selectedCategory);
  }, [selectedCategory]);

  const cardCounts = useMemo(() => {
    const counts: Record<string, number> = { "All": flashcardData.length };
    flashcardData.forEach(card => {
      counts[card.category] = (counts[card.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCardView = (cardId: string) => {
    setViewedCards(prev => new Set([...prev, cardId]));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary" />
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI Concepts Flashcards
            </h1>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            cardCounts={cardCounts}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Progress Tracker */}
        <div className="mb-8">
          <ProgressTracker 
            totalCards={filteredCards.length}
            viewedCards={filteredCards.filter(card => viewedCards.has(card.id)).length}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FlashCard 
                card={card}
                isViewed={viewedCards.has(card.id)}
                onView={handleCardView}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold mb-2">No cards found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
