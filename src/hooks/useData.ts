import { useState, useCallback } from 'react';
export interface JobRequest {
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
}

export interface SpreadsheetState {
  data: JobRequest[];
  filteredData: JobRequest[];
  sortConfig: {
    key: keyof JobRequest | null;
    direction: 'asc' | 'desc';
  };
  filters: {
    status?: string;
    priority?: string;
    submitter?: string;
  };
  searchQuery: string;
  hiddenFields: string[];
  selectedRows: number[];
}

const initialData: JobRequest[] = [
  {
    id: 1,
    title: "Launch social media campaign for product XYZ",
    submittedDate: "15-11-2024",
    status: "In-process",
    statusColor: "bg-[#fff3d6] text-[#84640a]",
    submitter: "Aisha Patel",
    url: "www.aishapatel.com",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    priorityColor: "text-[#c1920f]",
    dueDate: "20-11-2024",
    estValue: "6,200,000",
  },
  {
    id: 2,
    title: "Update press kit for company redesign",
    submittedDate: "28-10-2024",
    status: "Need to start",
    statusColor: "bg-slate-200 text-slate-600",
    submitter: "Irfan Khan",
    url: "www.irfankhanportfolio.com",
    assigned: "Tejas Pandey",
    priority: "High",
    priorityColor: "text-[#ef4c43]",
    dueDate: "30-10-2024",
    estValue: "3,500,000",
  },
  {
    id: 3,
    title: "Finalize user testing feedback for app update",
    submittedDate: "05-12-2024",
    status: "In-process",
    statusColor: "bg-[#fff3d6] text-[#84640a]",
    submitter: "Mark Johnson",
    url: "www.markjohnsondesigns.com",
    assigned: "Rachel Lee",
    priority: "Medium",
    priorityColor: "text-[#c1920f]",
    dueDate: "10-12-2024",
    estValue: "4,750,000",
  },
  {
    id: 4,
    title: "Design new features for the website",
    submittedDate: "10-01-2025",
    status: "Complete",
    statusColor: "bg-[#d2f2e2] text-[#0a6d3c]",
    submitter: "Emily Green",
    url: "www.emilygreenart.com",
    assigned: "Tom Wright",
    priority: "Low",
    priorityColor: "text-[#1a8cff]",
    dueDate: "15-01-2025",
    estValue: "5,900,000",
  },
  {
    id: 5,
    title: "Prepare financial report for Q4",
    submittedDate: "25-01-2025",
    status: "Blocked",
    statusColor: "bg-[#ffe1dd] text-[#c12119]",
    submitter: "Jessica Brown",
    url: "www.jessicabrowncreative.com",
    assigned: "Kevin Smith",
    priority: "Low",
    priorityColor: "text-[#1a8cff]",
    dueDate: "30-01-2025",
    estValue: "2,800,000",
  },
];

export const useData = () => {
  const [state, setState] = useState<SpreadsheetState>({
    data: initialData,
    filteredData: initialData,
    sortConfig: { key: null, direction: 'asc' },
    filters: {},
    searchQuery: '',
    hiddenFields: [],
    selectedRows: [],
  });

  const sortData = useCallback((key: keyof JobRequest) => {
    setState(prevState => {
      const direction = 
        prevState.sortConfig.key === key && prevState.sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc';

      const sortedData = [...prevState.filteredData].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      return {
        ...prevState,
        filteredData: sortedData,
        sortConfig: { key, direction },
      };
    });
  }, []);

  const applyFilters = useCallback((data: JobRequest[], filters: Partial<SpreadsheetState['filters']>, searchQuery: string) => {
    let filtered = data;
    
    // Apply text search across all fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.submittedDate.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query) ||
          item.submitter.toLowerCase().includes(query) ||
          item.url.toLowerCase().includes(query) ||
          item.assigned.toLowerCase().includes(query) ||
          item.priority.toLowerCase().includes(query) ||
          item.dueDate.toLowerCase().includes(query) ||
          item.estValue.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply column filters
    filtered = filtered.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key as keyof JobRequest].toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    
    return filtered;
  }, []);

  const filterData = useCallback((filters: Partial<SpreadsheetState['filters']>) => {
    setState(prevState => {
      const newFilters = { ...prevState.filters, ...filters };
      const filtered = applyFilters(prevState.data, newFilters, prevState.searchQuery);

      return {
        ...prevState,
        filters: newFilters,
        filteredData: filtered,
      };
    });
  }, [applyFilters]);

  const searchData = useCallback((searchQuery: string) => {
    setState(prevState => {
      const filtered = applyFilters(prevState.data, prevState.filters, searchQuery);

      return {
        ...prevState,
        searchQuery,
        filteredData: filtered,
      };
    });
  }, [applyFilters]);

  const toggleFieldVisibility = useCallback((fieldName: string) => {
    setState(prevState => ({
      ...prevState,
      hiddenFields: prevState.hiddenFields.includes(fieldName)
        ? prevState.hiddenFields.filter(field => field !== fieldName)
        : [...prevState.hiddenFields, fieldName],
    }));
  }, []);

  const selectRow = useCallback((rowId: number) => {
    setState(prevState => ({
      ...prevState,
      selectedRows: prevState.selectedRows.includes(rowId)
        ? prevState.selectedRows.filter(id => id !== rowId)
        : [...prevState.selectedRows, rowId],
    }));
  }, []);

  const addNewRow = useCallback((newRow: Omit<JobRequest, 'id'>) => {
    setState(prevState => {
      const newId = Math.max(...prevState.data.map(item => item.id)) + 1;
      const newJobRequest = { ...newRow, id: newId };
      const newData = [...prevState.data, newJobRequest];
      
      return {
        ...prevState,
        data: newData,
        filteredData: newData,
      };
    });
  }, []);

  const exportData = useCallback((format: 'csv' | 'json') => {
    const dataToExport = state.filteredData;
    
    if (format === 'csv') {
      const headers = Object.keys(dataToExport[0] || {}).join(',');
      const rows = dataToExport.map(row => 
        Object.values(row).map(value => `"${value}"`).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'spreadsheet-data.csv';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'spreadsheet-data.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [state.filteredData]);

  return {
    state,
    sortData,
    filterData,
    searchData,
    toggleFieldVisibility,
    selectRow,
    addNewRow,
    exportData,
  };
};