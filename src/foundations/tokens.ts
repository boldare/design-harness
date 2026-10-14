import tokens from '../../tokens/tokens.json';

/** The CSS variable for a token, named as in figma/library.json: surface.page -> --surface-page. */
export const cssVariable = (tokenName: string) => `--${tokenName.replaceAll('.', '-')}`;

/** A colour alias without its braces: "{neutral.50}" -> "neutral.50". */
export const aliasName = (value: string) => value.replace(/^\{(.*)\}$/, '$1');

export { tokens };
