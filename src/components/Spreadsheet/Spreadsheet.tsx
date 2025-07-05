
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

//fieldMapping

registerAllModules();

// Define field mapping outside component to prevent re-creation
const fieldMapping = {
  'Job Request': 0,
  'Submitted': 1,
  'Status': 2,
  'Submitter': 3,
  'URL': 4,
  'Assigned': 5,
  'Priority': 6,
  'Due Date': 7,
  'Est. Value': 8
};

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
  state?: any;
  hiddenFields?: string[];
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ onDataChange, state: externalState, hiddenFields = [] }) => {
  const hotTableRef = useRef<HotTable>(null);
  const internalData = useData();
  const state = externalState || internalData.state;
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
    const convertedData = data.map(item => {
      const allFields = [
        item.title,           // Job Request - 0
        item.submittedDate,   // Submitted - 1
        item.status,          // Status - 2
        item.submitter,       // Submitter - 3
        item.url,            // URL - 4
        item.assigned,       // Assigned - 5
        item.priority,       // Priority - 6
        item.dueDate,        // Due Date - 7
        item.estValue        // Est. Value - 8
      ];
      
      // Filter out hidden fields
      const visibleFields = allFields.filter((field, index) => {
        const fieldName = Object.keys(fieldMapping).find(key => fieldMapping[key as keyof typeof fieldMapping] === index);
        return !hiddenFields.includes(fieldName || '');
      });
      
      const extraCells = new Array(extraColumns.length).fill('');
      return [...visibleFields, ...extraCells];
    });
    
    // Calculate visible columns count
    const visibleColumnsCount = Object.keys(fieldMapping).filter(field => !hiddenFields.includes(field)).length;
    const totalColumns = visibleColumnsCount + extraColumns.length + 1; // +1 for add button
    
    const emptyRowsNeeded = Math.max(0, 100 - convertedData.length);
    for (let i = 0; i < emptyRowsNeeded; i++) {
      convertedData.push(new Array(totalColumns).fill(''));
    }
    
    return convertedData;
  }, [extraColumns.length, hiddenFields]);

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




  const getColumnSettings = useCallback(() => {
    const baseSettings = [
      { data: 0, type: 'text', width: 300, title: 'Job Request' }, // Job Request (Title)
      { data: 1, type: 'text', width: 120, title: 'Submitted' }, // Submitted Date
      { 
        data: 2, 
        type: 'dropdown', 
        source: ['In-process', 'Need to start', 'Complete', 'Blocked'],
        renderer: statusRenderer,
        width: 125,
        title: 'Status'
      }, // Status
      { data: 3, type: 'text', width: 150, title: 'Submitter' }, // Submitter
      { 
        data: 4, 
        type: 'text', 
        renderer: urlRenderer,
        width: 150,
        title: 'URL'
      }, // URL
      { data: 5, type: 'text', width: 150, title: 'Assigned' }, // Assigned
      { 
        data: 6, 
        type: 'dropdown', 
        source: ['High', 'Medium', 'Low'],
        renderer: priorityRenderer,
        width: 100,
        title: 'Priority'
      }, // Priority
      { data: 7, type: 'text', width: 120, title: 'Due Date' }, // Due Date
      { data: 8, type: 'text', width: 120, title: 'Est. Value' }, // Est. Value
    ];

    // Filter out hidden columns
    const visibleSettings = baseSettings.filter((setting, index) => {
      const fieldName = Object.keys(fieldMapping).find(key => fieldMapping[key as keyof typeof fieldMapping] === index);
      return !hiddenFields.includes(fieldName || '');
    });

    //Add settings for extra columns
    const extraSettings = extraColumns.map((_, index) => ({
      data: visibleSettings.length + index,
      type: 'text',
      width: 120
    }));

    // Add (+) button column
    const addButtonSetting = {
      data: visibleSettings.length + extraColumns.length,
      type: 'text',
      renderer: addColumnRenderer,
      readOnly: true,
      width: 50
    };

    return [
      ...visibleSettings,
      ...extraSettings,
      addButtonSetting
    ];
  }, [extraColumns, statusRenderer, urlRenderer, priorityRenderer, addColumnRenderer, hiddenFields]);

  return (
    <div className='h-[872px] min-w-full overflow-auto relative z-[1]'>
      <HotTable
        ref={hotTableRef}
        data={hotData}
        // colHeaders={columnHeaders}
        colHeaders={true}
        nestedHeaders={(() => {
          const allHeaders = ['Job Request', 'Submitted', 'Status', 'Submitter', 'URL', 'Assigned', 'Priority', 'Due Date', 'Est. Value'];
          const visibleHeaders = allHeaders.filter(header => !hiddenFields.includes(header));
          const extraHeaders = extraColumns.map((_, index) => `Custom ${index + 1}`);
          
          const topRowHeaders = [];
          let currentIndex = 0;
          
          // Q3 Financial Overview (covers first 4 visible columns)
          const firstGroupCount = Math.min(4, visibleHeaders.length);
          if (firstGroupCount > 0) {
            topRowHeaders.push({label: 'Q3 Financial Overview', colspan: firstGroupCount, headerClassName: "Q3"});
            currentIndex += firstGroupCount;
          }
          
          // Add remaining headers based on what's visible
          const remainingHeaders = visibleHeaders.slice(firstGroupCount);
          remainingHeaders.forEach((header, index) => {
            if (header === 'URL') {
              topRowHeaders.push({label: 'ABC', headerClassName: 'ABC', colspan: 1});
            } else if (header === 'Priority' || header === 'Due Date') {
              if (index === remainingHeaders.findIndex(h => h === 'Priority')) {
                topRowHeaders.push({label: 'Answer a question', colspan: 2, headerClassName: 'AAQ'});
              }
            } else if (header === 'Est. Value') {
              topRowHeaders.push({label: 'Extract', colspan: 1, headerClassName: 'Extract'});
            } else if (!['Priority', 'Due Date'].includes(header)) {
              topRowHeaders.push({label: '', headerClassName: 'blank', colspan: 1});
            }
          });
          
          // Add extra columns and + button
          if (extraHeaders.length > 0) {
            extraHeaders.forEach(() => {
              topRowHeaders.push({label: '', headerClassName: 'blank', colspan: 1});
            });
          }
          topRowHeaders.push({label: '+', colspan: 1});
          
          return [
            topRowHeaders,
            [...visibleHeaders, ...extraHeaders, '+']
          ];
        })()}
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
