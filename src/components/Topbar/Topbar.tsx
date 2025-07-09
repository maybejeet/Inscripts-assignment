import {  Bell, PanelRight, SearchIcon } from 'lucide-react'
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from '../ui/badge'
import { toast } from "sonner"
import { useState } from 'react'

interface TopbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Topbar: React.FC<TopbarProps> = ({ onSearch, searchQuery }) => {
  const [notificationCounter, setNotificationCounter] = useState(2);
  
  const messages = [
    {
      title: "message1",
      description: "This is the first notification message",
    },
    {
      title: "message2", 
      description: "This is the second notification message",
    }
  ];
  
  const handleNotificationClick = () => {
    if (notificationCounter > 0) {
      // Show all pending notifications
      for (let i = 0; i < notificationCounter; i++) {
        const message = messages[i] || messages[0]; // Fallback to first message if not enough
        toast(message.title, {
          description: message.description,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo clicked for:", message.title),
          },
        });
      }
      // Reset counter after showing notifications
      setNotificationCounter(0);
    }
  };
  
  // Function to simulate adding new notifications (for testing)
  const addNotification = () => {
    setNotificationCounter(prev => prev + 1);
  };

  return (
    <>
    <header className=' w-full h-[56px]  pr-4 pt-4 pb-2 border border-b-1 border-[#EEEEEE] flex justify-between items-center'>
      <div className='flex justify-center items-center h-6 w-[400px]'>
        <div><PanelRight size={18} color="#4b6a4f" strokeWidth={2.25} /></div>
        <div className='ml-[20px]'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='text-[#AFAFAF] text-[14px]'>
              Workspace 
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='text-[#AFAFAF] text-[14px]'>
              Folder 2 
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='text-[14px]'>
              Spreadsheet 3
            </BreadcrumbItem>
            <BreadcrumbItem>
                  <BreadcrumbEllipsis className="size-4 text-[#AFAFAF] text-[14px]" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
      </div>
      <div className="flex items-center gap-1 justify-center pb-2">     
        <div className="flex items-center gap-2 p-3 bg-[#f6f6f6] rounded-md w-[175px] h-10">
          <SearchIcon className="w-5 h-5 text-[#757575]" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search within sheet"
            className="border-0 p-0 h-auto text-[2px] font-paragraph-12-XS-regular-12-12 text-[#757575] focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
          />
        </div>


        <div className="relative p-2 bg-white rounded-lg">
        <Bell size={24} color="black" strokeWidth={2} onClick={handleNotificationClick}/>
          {notificationCounter > 0 && (
            <Badge className="flex items-center justify-center w-5 h-5 absolute top-0 left-5 bg-[#4b6a4f] text-[#f6f6f6] rounded-full border-2 border-solid border-white p-0">
              <span className="font-paragraph-10-XXS-medium-10-16 text-[10px]">
                {notificationCounter}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white rounded-lg">
          <Avatar className="w-7 h-7">
            <AvatarImage src="/Ellipse1.png" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <div className="flex flex-col max-w-[60px] items-start">
            <span className="font-paragraph-12-XS-regular-12-16 text-[#121212] text-[12px] leading-[16px]">
              John Doe
            </span>
            <span className="font-label-10-XXS-regular text-[#757575] text-[10px] leading-[12px] truncate overflow-hidden whitespace-nowrap w-full">
              john.doe@companyname.com
            </span>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export default Topbar