import { Button } from "@/components/ui/button";
import { getCategoryColor } from "@/hooks/useFlashcards";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  cardCounts: Record<string, number>;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, cardCounts }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        const count = cardCounts[category] || 0;
        const categoryColor = getCategoryColor(category);
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            size="sm"
            className={`
              transition-all duration-300 ease-out text-xs sm:text-sm
              ${isSelected 
                ? `bg-${categoryColor} hover:bg-${categoryColor}/90 text-background shadow-lg scale-105` 
                : `border-${categoryColor}/30 hover:bg-${categoryColor}/10 hover:border-${categoryColor}/50 hover:scale-105`
              }
            `}
          >
            {category}
            <span className="ml-1 sm:ml-2 text-xs opacity-70">
              ({count})
            </span>
          </Button>
        );
      })}
    </div>
  );
};