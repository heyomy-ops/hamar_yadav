export const capitalizeName = (name) => {
  if (!name) return '';
  return name.replace(/\b\w/g, l => l.toUpperCase());
};
