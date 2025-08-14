export interface FlashCard {
  id: string;
  phrase: string;
  category: string;
  definition: string;
}

export const flashcardData: FlashCard[] = [
  {
    id: "1",
    phrase: "Artificial Intelligence (AI)",
    category: "Core AI Concepts & Types",
    definition: "Artificial Intelligence (AI) is a broad field of computer science focused on creating systems that can perform tasks normally requiring human intelligence. AI enables machines to simulate human cognitive functions like learning, reasoning, problem-solving, perception, and even creativity."
  },
  {
    id: "2",
    phrase: "Machine Learning (ML)",
    category: "Core AI Concepts & Types",
    definition: "A subset of AI that enables computers to learn and improve from experience without being explicitly programmed. ML algorithms build mathematical models based on training data to make predictions or decisions."
  },
  {
    id: "3",
    phrase: "Deep Learning",
    category: "Core AI Concepts & Types",
    definition: "A specialized subset of machine learning that uses artificial neural networks with multiple layers to model and understand complex patterns in data, inspired by the structure and function of the human brain."
  },
  {
    id: "4",
    phrase: "Neural Network",
    category: "Technical Architecture",
    definition: "A computing system inspired by biological neural networks that consists of interconnected nodes (neurons) that work together to process information and learn patterns from data."
  },
  {
    id: "5",
    phrase: "Natural Language Processing (NLP)",
    category: "AI Applications",
    definition: "A branch of AI that focuses on the interaction between computers and human language, enabling machines to understand, interpret, and generate human language in a valuable way."
  },
  {
    id: "6",
    phrase: "Computer Vision",
    category: "AI Applications",
    definition: "A field of AI that trains computers to interpret and understand visual information from the world, enabling machines to identify and analyze visual content like images and videos."
  }
];

export const categories = [
  "All",
  "Core AI Concepts & Types",
  "Technical Architecture", 
  "AI Applications"
];

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Core AI Concepts & Types":
      return "category-ai";
    case "Technical Architecture":
      return "category-ml";
    case "AI Applications":
      return "category-data";
    default:
      return "category-tech";
  }
};