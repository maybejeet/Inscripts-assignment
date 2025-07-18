
import { Row } from './components/Row/Row'
import Spreadsheet from './components/Spreadsheet/Spreadsheet';
import { TitleRow } from './components/Title Row/TitleRow';
import Topbar from './components/Topbar/Topbar'
import { useData } from './hooks/useData'
import { Toaster } from 'sonner';


function App() {
  const {
    state,
    sortData,
    filterData,
    searchData,
    toggleFieldVisibility,
    exportData,
  } = useData();


  const handleSort = (key: string) => {
    sortData(key as any);
  };

  const handleFilter = (filters: any) => {
    filterData(filters);
  };

  const handleToggleField = (field: string) => {
    toggleFieldVisibility(field);
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportData(format);
  };

  const handleSearch = (query: string) => {
    searchData(query);
  };

  const handleStatusFilter = (filters: { status?: string }) => {
    filterData(filters);
  };

  const handleAddNew = () => {
    // TODO: Implement add new row dialog
    console.log('Add new row - implement dialog');
    // For now, you could add a sample row:
    // addNewRow({
    //   title: "New Job Request",
    //   submittedDate: new Date().toLocaleDateString('en-GB'),
    //   status: "Need to start",
    //   statusColor: "bg-slate-200 text-slate-600",
    //   submitter: "Current User",
    //   url: "www.example.com",
    //   assigned: "Unassigned",
    //   priority: "Medium",
    //   priorityColor: "text-[#c1920f]",
    //   dueDate: "",
    //   estValue: "0",
    // });
  };


  return (
    <>
      <Topbar 
        onSearch={handleSearch}
        searchQuery={state.searchQuery}
      />
      <Row 
          onSort={handleSort}
          onFilter={handleFilter}
          onToggleField={handleToggleField}
          onExport={handleExport}
          onAddNew={handleAddNew}
          hiddenFields={state.hiddenFields}
          state={state}
      />
      <Spreadsheet state={state} hiddenFields={state.hiddenFields} />
      <TitleRow onFilter={handleStatusFilter} currentFilter={state.filters.status} />
      <Toaster/>
    </>
  )
}

export default App

