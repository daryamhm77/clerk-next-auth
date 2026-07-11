import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  message?: string;
}

export default function Loader({ size = 24, message }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 size={size} className="animate-spin text-amber-500" />
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}
