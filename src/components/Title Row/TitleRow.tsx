import { PlusIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";

interface TitleRowProps {
  onFilter: (filters: { status?: string }) => void;
  currentFilter?: string;
}

export const TitleRow: React.FC<TitleRowProps> = ({ onFilter, currentFilter }) => {
  const [activeTab, setActiveTab] = useState(currentFilter || "all");
  
  // Define tab data with status mapping
  const tabItems = [
    { id: "all", label: "All Orders", status: undefined },
    { id: "pending", label: "Pending", status: "In-process" },
    { id: "reviewed", label: "Reviewed", status: "Complete" },
    { id: "arrived", label: "Arrived", status: "Need to start" },
  ];
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const selectedTab = tabItems.find(tab => tab.id === tabId);
    if (selectedTab) {
      onFilter({ status: selectedTab.status });
    }
  };

  return (
    <footer className="flex items-center gap-6 pl-8 pr-4 pt-1 pb-0 absolute z-[200] bottom-0 left-0 ml-0 min-w-screen bg-white border-t border-[#eeeeee]">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex items-start">
        <TabsList className="bg-transparent p-0 h-auto ">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`gap-2 px-4 py-2.5 rounded-none ${
                activeTab === tab.id
                  ? "bg-[#e8f0e9] border-t-2 border-[#4b6a4f] text-[#3e5741] cursor-pointer font-paragraph-16-m-semi-bold-16-24"
                  : "bg-transparent text-[#757575] font-paragraph-16-m-medium-16-24 cursor-pointer"
              }`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
          <div className="gap-1 px-1 py-2 self-stretch inline-flex items-center justify-center">
            <button className="inline-flex items-center gap-2 p-1 bg-white rounded cursor-pointer">
              <PlusIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </TabsList>
      </Tabs>
    </footer>
  );
};
