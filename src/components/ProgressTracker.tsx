import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle, BookOpen, Target } from "lucide-react";

interface ProgressTrackerProps {
  totalCards: number;
  viewedCards: number;
}

export const ProgressTracker = ({ totalCards, viewedCards }: ProgressTrackerProps) => {
  const progressPercentage = totalCards > 0 ? (viewedCards / totalCards) * 100 : 0;
  
  return (
    <Card className="p-6 bg-gradient-to-r from-card to-card/80 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Learning Progress</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>{viewedCards} viewed</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{totalCards} total</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Completion</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
        />
        <p className="text-xs text-muted-foreground">
          {totalCards - viewedCards > 0 
            ? `${totalCards - viewedCards} cards remaining`
            : "All cards completed! 🎉"
          }
        </p>
      </div>
    </Card>
  );
};