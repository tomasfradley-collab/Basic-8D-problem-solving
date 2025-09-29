
export interface FileAttachment {
  name: string;
  type: string;
  dataUrl: string; // Base64 encoded file content
}

export interface Discipline {
  id: string; // e.g., 'D0', 'D1'
  title: string;
  description: string;
  content: string;
  completed: boolean;
}

export interface Report {
  id: string; // uuid
  title: string;
  createdAt: string; // ISO string
  okSample?: FileAttachment;
  nokSample?: FileAttachment;
  evidences: FileAttachment[];
  disciplines: Discipline[];
  nextRevisionDate: string | null; // Earliest due date of uncompleted, date-tracked disciplines
}
