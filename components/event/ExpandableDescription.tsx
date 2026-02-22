"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableDescriptionProps {
  text: string;
  className?: string;
}

export default function ExpandableDescription({ text, className = "" }: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setHasOverflow(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <div className={className}>
      <div className="ev-about-wrapper">
        <p
          ref={textRef}
          className={`ev-about-text ${expanded ? "ev-about-expanded" : "ev-about-collapsed"}`}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {text}
        </p>
        {(hasOverflow || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="ev-see-more-btn"
            aria-expanded={expanded}
          >
            {expanded ? "See Less" : "See More"}
          </button>
        )}
      </div>
    </div>
  );
}
