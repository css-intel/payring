import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Sparkles, ChevronRight, FileText, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AGREEMENT_TYPE_LIST } from '@payring/shared';

export function NewAgreementScreen() {
  const navigate = useNavigate();
  const [inputMethod, setInputMethod] = useState<'voice' | 'text' | 'template' | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceStart = () => {
    setInputMethod('voice');
    setIsRecording(true);
    // TODO: Implement voice recording
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      navigate('/agreements/preview', {
        state: { input: textInput, method: 'text' },
      });
    }
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold mb-2">Create Agreement</h1>
        <p className="text-muted-foreground">
          Describe your deal and let AI generate the contract
        </p>
      </div>

      {/* AI Input Section */}
      <div className="px-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your agreement naturally
                </p>
              </div>
            </div>

            {/* Voice Recording Button */}
            <button
              onClick={handleVoiceStart}
              className={cn(
                'w-full p-4 rounded-xl border-2 border-dashed transition-all mb-4',
                isRecording
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                    isRecording
                      ? 'bg-primary text-white animate-pulse-ring'
                      : 'bg-muted'
                  )}
                >
                  <Mic className="w-8 h-8" />
                </div>
                <span className="font-medium">
                  {isRecording ? 'Recording... Tap to stop' : 'Tap to speak'}
                </span>
                <span className="text-sm text-muted-foreground">
                  "I'm hiring Sarah to build a website for $3,000..."
                </span>
              </div>
            </button>

            {/* Text Input */}
            <div className="relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type your agreement description here..."
                className="w-full p-4 rounded-xl border border-input bg-background resize-none h-32 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {textInput && (
                <Button
                  onClick={handleTextSubmit}
                  size="sm"
                  className="absolute bottom-3 right-3"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Or Divider */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or choose a template</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      {/* Template Categories */}
      <div className="px-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          AGREEMENT TEMPLATES
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {AGREEMENT_TYPE_LIST.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-payring-lg transition-all hover:scale-[1.02]"
              onClick={() =>
                navigate('/agreements/template', {
                  state: { templateId: template.id },
                })
              }
            >
              <CardContent className="p-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  {template.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{template.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="px-4 mt-8">
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Tips for AI Generation
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include the total amount and payment structure</li>
              <li>• Mention key milestones or deliverables</li>
              <li>• Specify the timeline or deadline</li>
              <li>• Name all parties involved</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
