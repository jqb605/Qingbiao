export interface Project {
  id: string;
  title: string;
  category: string; // e.g., "Drama", "Musical", "Experimental"
  year: string;
  description: string;
  coverImage: string; // Base64 or URL
  galleryImages: string[]; // Array of Base64 or URLs
  videoUrls: string[]; // Changed from videoUrl to support multiple videos
  castAndCrew?: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}