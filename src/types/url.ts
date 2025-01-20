export interface UrlDto {
  id?: string;
  url: string;
  ttlInSeconds: number | null;
  createdDate?: string;
  modifiedDate?: string;
}

export interface ErrorRFC7807 {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  invalidParams?: {
    name: string;
    reason: string;
  }[];
} 