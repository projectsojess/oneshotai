import ChatSidebar from "@/components/conversations/chat-sidebar";

const ChatPage = ({params} : {params : {chatid: string}}) => {


    return (
        <div className='h-full relative'>
             <div className='hidden h-full md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 z-[30]
        bg-gray-900'>
            <ChatSidebar selectedChatId={params.chatid} />
        </div>
        </div>
    )
}

export default ChatPage;