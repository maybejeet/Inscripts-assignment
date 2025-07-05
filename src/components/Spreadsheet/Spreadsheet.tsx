
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import './styles.css';
import './Spreadsheet.css'
import { useRef, useCallback, useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { BriefcaseBusiness } from 'lucide-react';

registerAllModules();
interface JobRequest {
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
interface SpreadsheetProps {
  onDataChange?: (data: JobRequest[]) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ onDataChange }) => {
  const hotTableRef = useRef<HotTable>(null);
  const { state } = useData();
  const [hotData, setHotData] = useState<(string | number)[][]>([]);
  const [extraColumns, setExtraColumns] = useState<string[]>([]);

  const handleAddColumn = useCallback(() => {
    const newColumnName = `Custom ${extraColumns.length + 1}`;
    setExtraColumns(prev => [...prev, newColumnName]);
    
    setHotData(prevData => 
      prevData.map(row => [...row, ''])
    );
  }, [extraColumns.length]);

  const convertToHotData = useCallback((data: JobRequest[]) => {
    const totalColumns = 13 + extraColumns.length + 1; 
    
    const convertedData = data.map(item => {
      const baseRow = [
        item.title,           // Job Request
        item.submittedDate,   // Submitted
        item.status,          // Status
        item.submitter,       // Submitter
        item.url,            // URL
        item.assigned,       // Assigned
        item.priority,       // Priority
        item.dueDate,        // Due Date
        item.estValue        // Est. Value
      ];
      const extraCells = new Array(extraColumns.length).fill('');
      return [...baseRow, ...extraCells];
    });
    
    const emptyRowsNeeded = Math.max(0, 100 - convertedData.length);
    for (let i = 0; i < emptyRowsNeeded; i++) {
      convertedData.push(new Array(totalColumns).fill(''));
    }
    
    return convertedData;
  }, [extraColumns.length]);

  useEffect(() => {
    const newHotData = convertToHotData(state.filteredData);
    setHotData(newHotData);
  }, [state.filteredData, convertToHotData]);


  const statusRenderer = useCallback((instance: any, td: HTMLElement, row: number, col: number, prop: any, value: any, cellProperties: any) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (value) {
      const statusClass = value.toLowerCase().replace(/\s+/g, '-');
      td.innerHTML = `<span class="status-badge status-${statusClass}">${value}</span>`;
    }
    
    return td;
  }, []);

  const priorityRenderer = useCallback((instance: any, td: HTMLElement, row: number, col: number, prop: any, value: any, cellProperties: any) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (value) {
      const priorityClass = value.toLowerCase();
      td.innerHTML = `<span class="priority-${priorityClass}">${value}</span>`;
    }
    
    return td;
  }, []);

   const urlRenderer = useCallback((instance: any, td: HTMLElement, row: number, col: number, prop: any, value: any, cellProperties: any) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (value) {
      td.innerHTML = `<a href="${value}" class="url-cell" target="_blank" rel="noopener noreferrer">${value}</a>`;
    }
    
    return td;
  }, []);

  //TODO: fix add btn
  const addColumnRenderer = useCallback((instance: any, td: HTMLElement, row: number, col: number, prop: any, value: any, cellProperties: any) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (row === 0) { // Only show (+) in header row
      td.innerHTML = `<button class="add-column-btn" style="
        background: #f1f5f9;
        border: 1px dashed #94a3b8;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 16px;
        color: #64748b;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">+</button>`;
      
      // Add click event listener
      const button = td.querySelector('.add-column-btn');
      if (button) {
        button.addEventListener('click', handleAddColumn);
      }
    } else {
      td.innerHTML = '';
      td.style.backgroundColor = '#f8fafc';
    }
    
    return td;
  }, [handleAddColumn]);


  const handleAfterChange = useCallback((changes: any, source: string) => {
    if (source === 'loadData') return;
    
    if (changes) {
      changes.forEach(([row, col, oldValue, newValue]: [number, number, any, any]) => {
        if (oldValue !== newValue) {
          console.log(`Cell at row ${row}, col ${col} changed from ${oldValue} to ${newValue}`);
        }
      });
    }
  }, []);



  //TODO: fix add btn
  const getColumnSettings = useCallback(() => {

    const baseSettings = [
      { BriefcaseBusiness ,data: 0, type: 'text', width: 300 }, // Job Request (Title)
      { data: 1, type: 'text', width: 120 }, // Submitted Date
      { 
        data: 2, 
        type: 'dropdown', 
        source: ['In-process', 'Need to start', 'Complete', 'Blocked'],
        renderer: statusRenderer,
        width: 125 
      }, // Status
      { data: 3, type: 'text', width: 150 }, // Submitter
      { 
        data: 4, 
        type: 'text', 
        renderer: urlRenderer,
        width: 150 
      }, // URL
      { data: 5, type: 'text', width: 150 }, // Assigned
      { 
        data: 6, 
        type: 'dropdown', 
        source: ['High', 'Medium', 'Low'],
        renderer: priorityRenderer,
        width: 100 
      }, // Priority
      { data: 7, type: 'text', width: 120 }, // Due Date
      { data: 8, type: 'text', width: 100,  }, // Extract
      { data: 9, type: 'text', width: 120 }, // Est. Value
    ];

    //Add settings for extra columns
    const extraSettings = extraColumns.map((_, index) => ({
      data: baseSettings.length + index,
      type: 'text',
      width: 120
    }));

  //   // Add (+) button column
    
  const addButtonSetting = {
      data: baseSettings.length + extraColumns.length,
      type: 'text',
      renderer: addColumnRenderer,
      readOnly: true,
      width: 50
    };

    return [
      ...baseSettings,
        ...extraSettings,
      addButtonSetting];
  }, [extraColumns, statusRenderer, urlRenderer, priorityRenderer,addColumnRenderer]);

  return (
    <div className='h-[872px] min-w-full overflow-auto relative z-[1]'>
      <HotTable
        ref={hotTableRef}
        data={hotData}
        // colHeaders={columnHeaders}
        colHeaders={true}
        nestedHeaders={[
          [{label: 'Q3 Financial Overview', colspan: 4, headerClassName: "Q3"},{label:"",headerClassName:"blank",colspan:1},{label:'ABC', headerClassName:'ABC', colspan:1},{label: "Answer a question", colspan:2, headerClassName:'AAQ'}, {label:'Extract',colspan:1,headerClassName:"Extract"},'+' ],
          ['Job Request', 'Submitted', 'Status', 'Submitter', 'URL', 'Assigned', 'Priority', 'Due Date',      'Est. Value']
        ]}
        columns={getColumnSettings()}
        height={850}
        width="100%"
        licenseKey="non-commercial-and-evaluation"
        stretchH="all"
        contextMenu={true}
        manualRowResize={true}
        manualColumnResize={true}
        manualRowMove={true}
        manualColumnMove={true}
        columnSorting={true}
        filters={true}
        dropdownMenu={true}
        afterChange={handleAfterChange}
        rowHeaders={true}
        fillHandle={true}
        outsideClickDeselects={false}
        selectionMode="multiple"
        copyPaste={true}
        undo={true}
        search={true}
        className="handsontable-container"
      />
    </div>
  );
};

export default Spreadsheet;
