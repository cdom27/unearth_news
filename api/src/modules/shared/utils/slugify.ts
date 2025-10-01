// Mimic nanoId generation
const nanoId = (length: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// Normalize string into a unique slug friendly string
const slugify = (title: string) => {
  const slugifiedTitle = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

  const id = nanoId(6);

  return slugifiedTitle.concat("-", id);
};

export default slugify;
