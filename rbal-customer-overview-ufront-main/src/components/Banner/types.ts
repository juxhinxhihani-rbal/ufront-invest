export type BannerType = "danger" | "warning" | "success" | "info";
export interface BannerProps {
  title?: string;
  description?: string;
  type?: BannerType;
}
