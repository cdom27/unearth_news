export default function SourcesTableSkeleton() {
  return (
    <tbody aria-hidden="true" className="animate-pulse">
      {Array.from({ length: 8 }, (_, index) => (
        <tr key={`source-skeleton-${index}`} className="border-t border-clay-200">
          <th scope="row" className="px-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-40 rounded-sm bg-clay-200" />
              <div className="h-4 w-52 rounded-sm bg-clay-150" />
            </div>
          </th>
          <td className="px-4 py-4">
            <div className="h-8 w-24 rounded-full bg-clay-200" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-20 rounded-sm bg-clay-200" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-20 rounded-sm bg-clay-200" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-16 rounded-sm bg-clay-200" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-24 rounded-sm bg-clay-200" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
