export function resolveFluentTokenValue(tokenName: string): string {
  const cssVar = `--${tokenName}`;
  const fluentProvider = document.querySelector('[class*="fui-FluentProvider"]');
  if (!fluentProvider) return "#ffffff";

  const value = getComputedStyle(fluentProvider).getPropertyValue(cssVar).trim();
  return value || "#ffffff";
}