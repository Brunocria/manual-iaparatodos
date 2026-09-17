import { useCallback, useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";

const NAMES = [
  "Gabriel", "Miguel", "Arthur", "Lucas", "Davi", "Heitor", "Theo", "Samuel",
  "Bernardo", "Noah", "Gael", "Ravi", "Levi", "Isaac", "Benício", "João",
  "Pedro", "Matheus", "Felipe", "Nicolas", "Henrique", "Lorenzo", "Enzo",
  "Guilherme", "Murilo", "Rafael", "Gustavo", "Daniel", "Leonardo", "Eduardo",
  "Bryan", "Kauan", "Ryan", "Vicente", "Benjamin", "André", "Caio", "Vinícius",
  "Antônio", "Joaquim", "Lorenzo", "Fernando", "Diego", "Victor", "Emanuel",
  "Alex", "Thiago", "Augusto", "Lucca", "Caleb",
];

const INTERVAL_MS = 60_000;
const VISIBLE_MS = 6_000;
const FIRST_APPEARANCE_MS = 8_000;

const pickName = (previous?: string | null) => {
  if (NAMES.length === 1) return NAMES[0];
  let candidate = NAMES[Math.floor(Math.random() * NAMES.length)];
  while (candidate === previous) {
    candidate = NAMES[Math.floor(Math.random() * NAMES.length)];
  }
  return candidate;
};

const PurchaseNotification = () => {
  const [name, setName] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const trigger = useCallback(() => {
    setName((previous) => pickName(previous));
    setVisible(true);
  }, []);

  useEffect(() => {
    const firstTimer = setTimeout(trigger, FIRST_APPEARANCE_MS);
    const interval = setInterval(trigger, INTERVAL_MS);
    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [trigger]);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(hideTimer);
  }, [visible, name]);

  if (!name) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-[70] w-[calc(100vw-2rem)] max-w-sm transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 pr-3 shadow-xl shadow-black/10">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {name} comprou seu produto
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-primary">IA EXPERTS</span> · agora mesmo
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Fechar notificação"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseNotification;
