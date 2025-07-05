import {
  ArrowDownToLine,
    ArrowUpDownIcon,
    ChevronsLeft,
    EyeOff,
    LayoutIcon,
    ListFilter,
    ShareIcon,
    SplitIcon,
  } from "lucide-react";
  import  { useState } from "react";
  import { Button } from "../ui/button";
  import { Separator } from "../ui/separator";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuItem,
  } from "../ui/dropdown-menu";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog";
  import { useData } from "../../hooks/useData";
  
  interface DataRowSectionProps {
    onSort: (key: string) => void;
    onFilter: (filters: any) => void;
    onToggleField: (field: string) => void;
    onExport: (format: 'csv' | 'json') => void;
    onAddNew: () => void;
    hiddenFields: string[];
  }
  
  export const Row = ({
    onSort,
    onFilter,
    onToggleField,
    onExport,
    onAddNew,
    hiddenFields,
  }: DataRowSectionProps): JSX.Element => {
    const [showToolbar, setShowToolbar] = useState(true);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
    const toolbarActions = [
      { 
        icon: <EyeOff size={28}  strokeWidth={1.8} />, 
        label: "Hide fields",
        action: () => {},
        dropdown: true
      },
      { 
        icon: <ArrowUpDownIcon  size={28}  strokeWidth={1.8}/>, 
        label: "Sort",
        action: () => {},
        dropdown: true
      },
      { 
        icon: <ListFilter  size={28}  strokeWidth={1.8} />, 
        label: "Filter",
        action: () => setFilterDialogOpen(true),
        dropdown: false
      },
      { 
        icon: <LayoutIcon size={28}  strokeWidth={1.8} />, 
        label: "Cell view",
        action: () => {},
        dropdown: true
      },
    ];
  
    const fieldOptions = [
      'Job Request',
      'Submitted',
      'Status',
      'Submitter',
      'URL',
      'Assigned',
      'Priority',
      'Due Date',
      'Est. Value'
    ];
  
    const sortOptions = [
      { label: 'Job Request', key: 'title' },
      { label: 'Submitted Date', key: 'submittedDate' },
      { label: 'Status', key: 'status' },
      { label: 'Priority', key: 'priority' },
      { label: 'Due Date', key: 'dueDate' },
    ];
  
    const handleImport = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log('Importing file:', file.name);
          // Here you would implement the actual import logic
        }
      };
      input.click();
    };
  
    const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setShareDialogOpen(false);
      // You could add a toast notification here
    };



    return (
      <header className="flex items-center justify-between gap-2 px-2 py-1.5 w-full bg-white border-b border-[#eeeeee] z-[2]">
        <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-1 p-2 rounded"
          onClick={() => setShowToolbar(!showToolbar)}
        >
          <span className="font-light text-[#121212]">
            Tool bar
          </span>
          <ChevronsLeft size={28}  strokeWidth={1.8}  className={` transition-transform ${showToolbar ? 'rotate-180' : ''}`} />
        </Button>
        {showToolbar && <Separator orientation="vertical" className=" bg-[#eeeeee] h-7 " />}
        {showToolbar && (
          <div className="flex items-center gap-1 flex-1">
            {toolbarActions.map((action, index) => (
              <div key={index}>
                {action.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 pl-2 pr-3 py-2 rounded-md"
                      >
                        {action.icon}
                        <span className="font-light text-[#121212]">
                          {action.label}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {action.label === "Hide fields" && fieldOptions.map((field) => (
                        <DropdownMenuCheckboxItem
                          key={field}
                          checked={!hiddenFields.includes(field)}
                          onCheckedChange={() => onToggleField(field)}
                        >
                          {field}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {action.label === "Sort" && sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.key}
                          onClick={() => onSort(option.key)}
                          className="bg-amber-700 z-[20000] "
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                      {action.label === "Cell view" && (
                        <>
                          <DropdownMenuItem>Grid view</DropdownMenuItem>
                          <DropdownMenuItem>List view</DropdownMenuItem>
                          <DropdownMenuItem>Card view</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 pl-2 pr-3 py-2 rounded-md"
                    onClick={action.action}
                  >
                    {action.icon}
                    <span className="font-light text-[#121212]">
                      {action.label}
                    </span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-start gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-1 pl-2 pr-3 py-2 rounded-md border-[#eeeeee]"
              onClick={handleImport}
            >
              <ArrowDownToLine size={28}  strokeWidth={1.8} />
              <span className="font-light text-[#545454]">
                Import
              </span>
            </Button>
  
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 pl-2 pr-3 py-2 rounded-md border-[#eeeeee]"
                >
                  <ArrowDownToLine className=" rotate-[180deg]"  size={28}  strokeWidth={1.8} />
                  <span className="font-light text-[#545454]">
                    Export
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
  
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 pl-2 pr-3 py-2 rounded-md border-[#eeeeee]"
                >
                  <ShareIcon size={28}  strokeWidth={1.8} />
                  <span className="font-light text-[#545454]">
                    Share
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Spreadsheet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Share this spreadsheet with others by copying the link below:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                    />
                    <Button onClick={handleShare}>Copy Link</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
  
          {/* New Action button */}
          <Button 
            className="flex items-center justify-center gap-1 px-6 py-2 bg-[#4b6a4f] text-white rounded-md hover:bg-[#3e5741]"
            onClick={onAddNew}
          >
            <SplitIcon size={28}  strokeWidth={1.8} />
            <span className="font-paragraph-14-s-medium-14-20">New Action</span>
          </Button>
        </div> 
        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={(e) => onFilter({ status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="In-process">In-process</option>
                  <option value="Need to start">Need to start</option>
                  <option value="Complete">Complete</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  onChange={(e) => onFilter({ priority: e.target.value })}
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>
    );
  };