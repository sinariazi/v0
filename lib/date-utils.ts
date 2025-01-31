export function getDateRangeFilter(range: string): { gte: Date } {
  const now = new Date();
  switch (range) {
    case "30":
      return { gte: new Date(now.setDate(now.getDate() - 30)) };
    case "90":
      return { gte: new Date(now.setDate(now.getDate() - 90)) };
    case "180":
      return { gte: new Date(now.setDate(now.getDate() - 180)) };
    case "all":
    default:
      return { gte: new Date(0) }; // Beginning of time
  }
}
