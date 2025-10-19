const SourceTableSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto" aria-hidden>
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
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b-1 border-fg-dark-tertiary">
              <td className="py-3 px-4">
                <div className="h-5 w-44 rounded bg-stone-400 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-36 rounded bg-stone-400 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="h-7 w-20 rounded bg-stone-400 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-28 rounded bg-stone-400 animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="h-5 w-20 rounded bg-stone-400 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourceTableSkeleton;
