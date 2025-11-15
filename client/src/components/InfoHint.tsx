interface InfoHintProps {
  text: string;
  label: string;
}

export function InfoHint({ text, label }: InfoHintProps) {
  return (
    <span className="cursor-help text-base text-slate-400" title={text} role="img" aria-label={`${label} info`}>
      ⓘ
    </span>
  );
}

