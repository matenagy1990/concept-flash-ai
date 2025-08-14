import { Button } from "@/components/ui/button";
import { categories, getCategoryColor } from "@/data/flashcards";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  cardCounts: Record<string, number>;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange, cardCounts }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        const count = cardCounts[category] || 0;
        const categoryColor = getCategoryColor(category);
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`
              transition-all duration-300 ease-in-out
              ${isSelected 
                ? `bg-${categoryColor} hover:bg-${categoryColor}/90 text-background shadow-lg` 
                : `border-${categoryColor}/30 hover:bg-${categoryColor}/10 hover:border-${categoryColor}/50`
              }
            `}
          >
            {category}
            <span className="ml-2 text-xs opacity-70">
              ({count})
            </span>
          </Button>
        );
      })}
    </div>
  );
};