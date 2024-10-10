export interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  html: string;
  scss: string;
  javascript: string;
  versions: Version[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Version {
  id: string;
  createdAt: string;
  html: string;
  scss: string;
  javascript: string;
}