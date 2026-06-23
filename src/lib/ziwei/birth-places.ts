export interface BirthPlace {
  id: string;
  name: string;
  nameEn: string;
  longitude: number;
  /** 時區標準子午線（東八區 = 120°） */
  timezoneMeridian: number;
}

export const BIRTH_PLACES: BirthPlace[] = [
  { id: "hong-kong", name: "香港", nameEn: "Hong Kong", longitude: 114.17, timezoneMeridian: 120 },
  { id: "macau", name: "澳門", nameEn: "Macau", longitude: 113.54, timezoneMeridian: 120 },
  { id: "taipei", name: "台北", nameEn: "Taipei", longitude: 121.47, timezoneMeridian: 120 },
  { id: "guangzhou", name: "廣州", nameEn: "Guangzhou", longitude: 113.26, timezoneMeridian: 120 },
  { id: "shenzhen", name: "深圳", nameEn: "Shenzhen", longitude: 114.05, timezoneMeridian: 120 },
  { id: "shanghai", name: "上海", nameEn: "Shanghai", longitude: 121.47, timezoneMeridian: 120 },
  { id: "beijing", name: "北京", nameEn: "Beijing", longitude: 116.4, timezoneMeridian: 120 },
  { id: "standard", name: "不校正（鐘錶時間）", nameEn: "No correction", longitude: 120, timezoneMeridian: 120 },
];

export const DEFAULT_BIRTH_PLACE_ID = "hong-kong";

export function getBirthPlace(id?: string): BirthPlace {
  return BIRTH_PLACES.find((p) => p.id === id) ?? BIRTH_PLACES[0];
}
