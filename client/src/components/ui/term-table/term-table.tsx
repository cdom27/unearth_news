import type { Term } from "@shared/types/analysis-fields";

interface TermTableProps {
  ts: Term[];
}

const TermTable = ({ ts }: TermTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b-1 border-fg-dark-tertiary">
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Term or phrase
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Tone
            </th>
            <th className="text-left py-3 px-4 font-semibold text-fg-dark">
              Analysis
            </th>
          </tr>
        </thead>
        <tbody>
          {ts.map((t) => (
            <tr key={t.term}>
              <td className="py-3 px-4 font-medium">{t.term}</td>
              <td className="py-3 px-4 text-fg-dark-tertiary">{t.tone}</td>
              <td className="py-3 px-4 text-fg-dark-tertiary">{t.analysis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TermTable;
