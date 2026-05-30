export interface College {
  id: string; name: string; shortName?: string | null; slug: string; location: string;
  city: string; state: string; type: string; category: string; established?: number | null;
  totalFee: number; minFee: number; maxFee: number; rating: number; totalRatings: number;
  accreditation?: string | null; nirfRank?: number | null; ranking?: number | null;
  website?: string | null; image?: string | null; logo?: string | null; featured: boolean;
  placementRate?: number | null; avgPackage?: number | null; maxPackage?: number | null;
  description: string;
}

export interface CollegeWithRelations extends College {
  courses: Course[]; placements: Placement[]; reviews: Review[];
  facilities: Facility[]; admissions: Admission[];
}

export interface Course { id: string; name: string; duration: number; degree: string; totalSeats: number; fee: number; eligibility?: string | null; }
export interface Placement { id: string; year: number; avgPackage: number; maxPackage: number; minPackage: number; placementRate: number; topRecruiters: string[]; }
export interface Review { id: string; rating: number; title: string; content: string; infrastructure: number; faculty: number; placements: number; campus: number; valueForMoney: number; helpful: number; createdAt: string; user: { name?: string | null; image?: string | null }; }
export interface Facility { id: string; name: string; available: boolean; }
export interface Admission { id: string; exam: string; minRank?: number | null; maxRank?: number | null; cutoff?: number | null; year: number; }

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  skills: string[];
  collegeName: string | null;
  graduationYear: number | null;
  role: string;
  createdAt: string;
}
