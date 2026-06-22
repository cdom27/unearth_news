export default function StoriesGallery() {
  return (
    <article className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        story cards go here
      </div>

      <div className="grid grid-cols-1 col-span-3 gap-1.5">loading msg</div>
    </article>
  );
}
