import { Link } from "react-router";
import type { SourceRatingPreviewDTO } from "@shared/dtos/source";
import { biasClasses } from "../../../utils/bias-classes";

interface SourceTableProps {
  ps: SourceRatingPreviewDTO[];
}

const SourceTable = ({ ps }: SourceTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b-1 border-fg-dark-tertiary">
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Media Type
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Bias
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Factual Reporting
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Credibility
            </th>
          </tr>
        </thead>
        <tbody>
          {ps.map((p) => (
            <tr key={p.slug} className="border-b-1 border-fg-dark-tertiary">
              <td className="py-3 px-4">
                <Link
                  to={`/media-ratings/${p.slug}`}
                  className="text-fg-dark-secondary hover:text-fg-dark underline decoration-dotted underline-offset-4"
                >
                  {p.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-fg-dark-tertiary">{p.mediaType}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-sm ${
                    biasClasses[p.bias] || "bg-stone-600"
                  }`}
                >
                  {p.bias}
                </span>
              </td>
              <td className="py-3 px-4 text-fg-dark-tertiary">
                {p.factualReporting}
              </td>
              <td className="py-3 px-4 text-fg-dark-tertiary">
                {p.credibility}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourceTable;
