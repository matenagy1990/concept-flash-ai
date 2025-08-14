import { useState, useMemo } from "react";
import { FlashCard } from "@/components/FlashCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useFlashcards, getUniqueCategories } from "@/hooks/useFlashcards";
import { Brain, Sparkles, Loader2 } from "lucide-react";

const Index = () => {
  const { cards, loading, error } = useFlashcards();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  const categories = useMemo(() => getUniqueCategories(cards), [cards]);

  const filteredCards = useMemo(() => {
    if (selectedCategory === "All") {
      return cards;
    }
    return cards.filter(card => card.category === selectedCategory);
  }, [selectedCategory, cards]);

  const cardCounts = useMemo(() => {
    const counts: Record<string, number> = { "All": cards.length };
    cards.forEach(card => {
      counts[card.category] = (counts[card.category] || 0) + 1;
    });
    return counts;
  }, [cards]);

  const handleCardView = (cardId: string) => {
    setViewedCards(prev => new Set([...prev, cardId]));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="relative">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              AI Rabit Hole
            </h1>
          </div>
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            cardCounts={cardCounts}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
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
        {filteredCards.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl sm:text-6xl mb-4">🤔</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No cards found</h3>
            <p className="text-muted-foreground text-sm sm:text-base">Try selecting a different category</p>
          </div>
        )}

        {/* Cards read indicator */}
        {viewedCards.size > 0 && (
          <div className="fixed bottom-4 right-4 bg-success/20 border border-success/50 rounded-full px-3 py-2 text-success text-sm font-medium backdrop-blur-sm">
            {viewedCards.size} read
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
