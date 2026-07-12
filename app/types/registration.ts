export type Role =
  | "Developer"
  | "Designer"
  | "Founder"
  | "Creative"
  | "Product Person"
  | "Industry Professional";

export type Track = "Build" | "Create" | "Scale";

export type Goal =
  | "New skills"
  | "Industry connections"
  | "Business ideas"
  | "Clarity on my path"
  | "All of the above";

export type ProjectStatus =
  | "Yes, a project"
  | "Yes, a startup"
  | "No, but I have ideas"
  | "No, just exploring";

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  role: Role;
  track: Track;
  goal: Goal;
  projectStatus: ProjectStatus;
  source: string;
}

export interface Registration extends RegistrationInput {
  _id?: string;
  accessCode: string;
  createdAt: string; // ISO string once serialized to the client
  emailSentAt: string | null | Date;
  emailSentCount: number;
  reminderSentAt: string | null | Date;
  reminderSentCount: number;
}

export const ROLES: Role[] = [
  "Developer",
  "Designer",
  "Founder",
  "Creative",
  "Product Person",
  "Industry Professional",
];

export const TRACKS: Track[] = ["Build", "Create", "Scale"];

export const GOALS: Goal[] = [
  "New skills",
  "Industry connections",
  "Business ideas",
  "Clarity on my path",
  "All of the above",
];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Yes, a project",
  "Yes, a startup",
  "No, but I have ideas",
  "No, just exploring",
];

export const TRACK_COLORS: Record<Track, { accent: string; bg: string }> = {
  Create: { accent: "#C580FF", bg: "#1a0a2a" },
  Build: { accent: "#6BB5FF", bg: "#0a1020" },
  Scale: { accent: "#F0C550", bg: "#1a1200" },
};