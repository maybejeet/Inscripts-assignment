import React, { useRef, useCallback, useEffect, useState } from 'react';
import { HotTable, HotTableClass } from '@handsontable/react';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import './Spreadsheet.css'
import { useData } from '../../hooks/useData';
import { BriefcaseBusiness, Calendar, CalendarDays, CircleArrowDown, DollarSign, Globe, User, Users } from 'lucide-react';
import { createRoot } from 'react-dom/client';

registerAllModules();

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
} as const;

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

const Spreadsheet: React.FC<SpreadsheetProps> = ({ state: externalState, hiddenFields = [] }) => {
  const hotTableRef = useRef<HotTableClass>(null);
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
      const visibleFields = allFields.filter((_field, index) => {
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

  const statusRenderer = useCallback((instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (value) {
      const statusClass = value.toLowerCase().replace(/\s+/g, '-');
      td.innerHTML = `<span class="status-badge status-${statusClass}">${value}</span>`;
    }
    
    return td;
  }, []);

  const priorityRenderer = useCallback((instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (value) {
      const priorityClass = value.toLowerCase();
      td.innerHTML = `<span class="priority-${priorityClass}">${value}</span>`;
    }
    
    return td;
  }, []);

  const urlRenderer = useCallback((instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    if (value) {
      td.innerHTML = `<a href="${value}" class="url-cell" target="_blank" rel="noopener noreferrer">${value}</a>`;
    }
    
    return td;
  }, []);

  const addColumnRenderer = useCallback((instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties) => {
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

  const handleAfterChange = useCallback((changes: Handsontable.CellChange[] | null, source: Handsontable.ChangeSource) => {
    if (source === 'loadData') return;
    
    if (changes) {
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (oldValue !== newValue) {
          console.log(`Cell at row ${row}, col ${col} changed from ${oldValue} to ${newValue}`);
        }
      });
    }
  }, []);

  const getColumnSettings = useCallback(() => {
    const baseSettings = [
      { data: 0, type: 'text', width: 250, title: 'Job Request' }, // Job Request (Title)
      { data: 1, type: 'text', width: 150, title: 'Submitted' }, // Submitted Date
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
        width: 100,
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
    const visibleSettings = baseSettings.filter((_setting, index) => {
      const fieldName = Object.keys(fieldMapping).find(key => fieldMapping[key as keyof typeof fieldMapping] === index);
      return !hiddenFields.includes(fieldName || '');
    });

    // Add settings for extra columns
    const extraSettings = extraColumns.map((_column, index) => ({
      data: visibleSettings.length + index,
      type: 'text' as const,
      width: 120
    }));

    // Add (+) button column
    const addButtonSetting = {
      data: visibleSettings.length + extraColumns.length,
      type: 'text' as const,
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
  
  const renderIconHeader = useCallback((text: string, container: HTMLElement) => {
    // Clear container first
    container.innerHTML = '';
    
    // Clean the text first
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    
    // Debug: log the header text to see what we're working with
    console.log('Header text:', `"${cleanText}"`);
    
    const getIcon = (headerText: string) => {
      const lowerText = headerText.toLowerCase().trim();
      if (lowerText.includes('job request') || lowerText.includes('job')) return <BriefcaseBusiness size={16} />;
      if (lowerText === 'submitted' || lowerText.includes('submit')) return <CalendarDays size={16} />;
      if (lowerText.includes('status')) return <CircleArrowDown size={16} />;
      if (lowerText.includes('submitter')) return <User size={16} />;
      if (lowerText.includes('url')) return <Globe size={16} />;
      if (lowerText.includes('assigned')) return <Users size={16} />;
      if (lowerText.includes('due date') || lowerText.includes('due')) return <Calendar size={16} />;
      if (lowerText.includes('est. value') || lowerText.includes('value')) return <DollarSign size={16} />;
      if (lowerText.includes('priority')) return <CircleArrowDown size={16} />;
      return null;
    };

    const icon = getIcon(cleanText);
    
    const root = createRoot(container);
    root.render(
      <div className="flex items-center gap-2">
        {icon}
        <span>{cleanText}</span>
      </div>
    );
  }, []);

  useEffect(() => {
    // Apply custom icons to headers after render
    const timeout = setTimeout(() => {
      const headers = document.querySelectorAll('.handsontable-container .colHeader');
      headers.forEach((header) => {
        if (header.textContent && !header.textContent.includes('Q3') && !header.textContent.includes('ABC')) {
          renderIconHeader(header.textContent, header as HTMLElement);
        }
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [state.filteredData, hiddenFields, renderIconHeader]);

  return (
    <div className='h-[872px] min-w-full overflow-auto relative z-[1]'>
      <HotTable
        ref={hotTableRef}
        data={hotData}
        colHeaders={true}
        nestedHeaders={(() => {
          const allHeaders = ['Job Request', 'Submitted', 'Status', 'Submitter', 'URL', 'Assigned', 'Priority', 'Due Date', 'Est. Value'];
          const visibleHeaders = allHeaders.filter(header => !hiddenFields.includes(header));
          const extraHeaders = extraColumns.map((_column, index) => `Custom ${index + 1}`);
          
          const topRowHeaders: any[] = [];
          const bottomRowHeaders: string[] = [];
          
          // Build headers based on visible columns
          visibleHeaders.forEach((header, index) => {
            if (header === 'Job Request' || header === 'Submitted' || header === 'Status' || header === 'Submitter') {
              if (index === 0) {
                const q3Count = ['Job Request', 'Submitted', 'Status', 'Submitter'].filter(h => visibleHeaders.includes(h)).length;
                topRowHeaders.push({label: '🔗 Q3 Financial Overview 🔄', colspan: q3Count, headerClassName: "Q3"});
              }
              if (header === 'Job Request') {
                bottomRowHeaders.push('Job Request');
              } else if (header === 'Submitted') {
                bottomRowHeaders.push('Submitted');
              } else if (header === 'Status') {
                bottomRowHeaders.push('Status');
              } else if (header === 'Submitter') {
                bottomRowHeaders.push('Submitter');
              }
            } else if (header === 'URL') {
              topRowHeaders.push({label: '', headerClassName: 'blank', colspan: 1});
              bottomRowHeaders.push('URL');
            } else if (header === 'Assigned') {
              topRowHeaders.push({label: 'ABC ⋯', headerClassName: 'ABC', colspan: 1});
              bottomRowHeaders.push('Assigned');
            } else if (header === 'Priority' || header === 'Due Date') {
              if (header === 'Priority') {
                const questionCount = ['Priority', 'Due Date'].filter(h => visibleHeaders.includes(h)).length;
                topRowHeaders.push({label: 'Answer a question ⋯', colspan: questionCount, headerClassName: 'AAQ'});
              }
              if (header === 'Priority') {
                bottomRowHeaders.push('Priority');
              } else {
                bottomRowHeaders.push('Due Date');
              }
            } else if (header === 'Est. Value') {
              topRowHeaders.push({label: 'Extract ⋯', colspan: 1, headerClassName: 'Extract'});
              bottomRowHeaders.push('Est. Value');
            }
          });
          
          // Add extra columns
          if (extraHeaders.length > 0) {
            extraHeaders.forEach(() => {
              topRowHeaders.push({label: '', headerClassName: 'blank', colspan: 1});
            });
            bottomRowHeaders.push(...extraHeaders);
          }
          
          // Add the + button
          topRowHeaders.push({label: '+', colspan: 1, headerClassName: 'add-column'});
          bottomRowHeaders.push('+');
          
          return [
            topRowHeaders,
            bottomRowHeaders
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