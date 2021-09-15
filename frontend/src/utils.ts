export const prettyPrintValueList = (value: string[]): string =>
  `${value.slice(0, -1).join(", ")} et ${value.slice(-1)}`;
