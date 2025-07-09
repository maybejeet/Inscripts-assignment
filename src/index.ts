export type JobRequest = {
    id: number;
    title: string;
    submittedDate: string;
    status: 'In-process' | 'Need to start' | 'Complete' | 'Blocked';
    statusColor: string;
    submitter: string;
    url: string;
    assigned: string;
    priority: 'High' | 'Medium' | 'Low';
    priorityColor: string;
    dueDate: string;
    estValue: string;
    [key: string]: string | number;
  };
  
export interface SpreadsheetState {
    data: JobRequest[];
    filteredData: JobRequest[];
    hiddenFields: string[];
    filters: {
      status?: string;
      priority?: string;
      submitter?: string;
    };
    sortConfig: {
      key: keyof JobRequest | null;
      direction: 'asc' | 'desc';
    };
    selectedRows: number[];
  }
  
  export type FilterObject = {
    status?: string;
    priority?: string;
    submitter?: string;
  };