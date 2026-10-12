export function getLocationName(result) {
  return result.display_name_en || result.name || result.display_name || "Selected location";
}

export function getLocationContext(result) {
  const address = result.address || {};
  const name = getLocationName(result).trim().toLowerCase();
  const parts = [address.state || address.region || address.county, address.country];
  return [...new Set(parts.filter((part) => part && part.trim().toLowerCase() !== name))].join(", ");
}

export function getLocationLabel(result) {
  const name = getLocationName(result);
  const context = getLocationContext(result);
  return context ? `${name}, ${context}` : name;
}
