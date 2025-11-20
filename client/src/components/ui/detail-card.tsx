import { useState } from "react";
import { CaretUpIcon } from "@phosphor-icons/react";
import type { Claim } from "@shared/types/analysis-fields";

interface CardProps {
  c: Claim;
}

const DetailCard = ({ c }: CardProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-5 px-5 py-7 rounded-2xl border-1 border-fg-dark-tertiary">
      <div className="flex gap-4 sm:justify-between">
        <p className="font-medium text-lg">{c.claim}</p>
        <button
          className="mb-auto cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <CaretUpIcon
            className={`size-7 fill-fg-dark-tertiary hover:fill-fg-dark transition-transform duration-300 ${open ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      {open && (
        <ul className="flex flex-col gap-2.5">
          <li>
            <span>Classification:</span>{" "}
            <span className="text-fg-dark-secondary">{c.classification}</span>
          </li>
          <li>
            <span>Status:</span>{" "}
            <span className="text-fg-dark-secondary">
              {c.verification.status}
            </span>
          </li>

          <li>
            <span>Reasoning:</span>{" "}
            <span className="text-fg-dark-secondary">
              {c.verification.justification}
            </span>
          </li>
          <li className="flex flex-wrap">
            <span>Sources:</span>
            {c.verification.sources.map((s) => (
              <a
                href={s.sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center gap-1 px-2 underline underline-offset-4 decoration-dotted"
              >
                {s.sourceName}
              </a>
            ))}
          </li>
        </ul>
      )}
    </div>
  );
};

export default DetailCard;
