import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FlashCard {
  id: string;
  phrase: string;
  category: string;
  definition: string;
  youtubeLink?: string;
}

export const useFlashcards = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data, error } = await supabase
          .from('AI_Glossar')
          .select('*');

        if (error) throw error;

        if (data) {
          const formattedCards: FlashCard[] = data.map((item: any) => ({
            id: item.ID?.toString() || Math.random().toString(),
            phrase: item['Phrase/ Concept'] || '',
            category: item.Category || 'Other',
            definition: item['Definition (ENG)'] || '',
            youtubeLink: item['Youtube Link'] || undefined
          }));
          setCards(formattedCards);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return { cards, loading, error };
};

export const getUniqueCategories = (cards: FlashCard[]): string[] => {
  const categories = cards.map(card => card.category).filter(Boolean);
  return ["All", ...Array.from(new Set(categories))];
};

export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    "Core AI Concepts & Types": "category-ai",
    "Technical Architecture": "category-ml", 
    "AI Applications": "category-data",
    "Machine Learning": "category-tech",
    "Data Science": "category-data",
    "Neural Networks": "category-ml",
  };
  return colorMap[category] || "category-default";
};