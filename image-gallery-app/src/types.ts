export interface Image {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  media_type: string;
  center: string;
}

export interface AddImageFormData {
  title: string;
  description: string;
  url: string;
  date: string;
}

export interface NasaImageResponse {
  collection: {
    items: Array<{
      data: Array<{
        nasa_id: string;
        title: string;
        description: string;
        date_created: string;
        media_type: string;
        center: string;
      }>;
      links: Array<{
        href: string;
      }>;
    }>;
    metadata: {
      total_hits: number;
    };
  };
} 