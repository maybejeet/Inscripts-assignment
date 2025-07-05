
import { Row } from './components/Row/Row'
import Spreadsheet from './components/Spreadsheet/Spreadsheet';
import { TitleRow } from './components/Title Row/TitleRow';
import Topbar from './components/Topbar/Topbar'
import { useData } from './hooks/useData'


function App() {
  const {
    state,
    sortData,
    filterData,
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

  const handleAddNew = () => {
    // TODO: Add new row functionality
    console.log('Add new row');
  };


  return (
    <>
      <Topbar/>
      <Row 
          onSort={handleSort}
          onFilter={handleFilter}
          onToggleField={handleToggleField}
          onExport={handleExport}
          onAddNew={handleAddNew}
          hiddenFields={state.hiddenFields}
      />
      <Spreadsheet/>
      <TitleRow/>
    </>
  )
}

export default App

