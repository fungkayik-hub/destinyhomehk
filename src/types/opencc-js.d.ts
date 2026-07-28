declare module "opencc-js" {
  export type ConverterLocale =
    | "cn"
    | "tw"
    | "twp"
    | "hk"
    | "jp"
    | "t"
    | string;

  export interface ConverterOptions {
    from: ConverterLocale;
    to: ConverterLocale;
  }

  export function Converter(options: ConverterOptions): (text: string) => string;
}
