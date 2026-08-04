export interface BuiltWithTech {
  name: string;
  category: string;
}

export interface BuiltWithHosting {
  ip: string | null;
  hostingProvider: string | null;
  country: string | null;
  city: string | null;
}

export interface BuiltWithResult {
  url: string;
  finalUrl: string;
  httpStatus: number | null;
  technologies: BuiltWithTech[];
  hosting: BuiltWithHosting;
  serverHeader: string | null;
  poweredByHeader: string | null;
}
