"use client";
import { useState } from "react";

import { createQuery, updateQueryReply } from "@/lib/actions";
import Empty from "@/components/ui/Empty";
import PopupForm from "@/components/admin/PopupForm";

const UserTickets = ({ tickets,userId }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Unread");
  const [replies, setReplies] = useState({});
  const [selectedQueryId, setSelectedQueryId] = useState("");
  const [oldReply, setOldReply] = useState("");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
  <div className="flex items-center justify-between flex-wrap  pb-6 mb-6 border-b">
  <h3 className="text-2xl font-semibold text-gray-800">
        My Tickets
      </h3>
      
      <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100"
        >
          Create New Ticket
        </button>
  </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).map((ticket) => (
            <div
              key={ticket.$id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ticket.subject}
                  </h3>
                  {/* <p className="text-sm text-gray-500">
                    By: {ticket.user.firstName} {ticket.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Email: {ticket.user.email}
                  </p> */}
                </div>
                
                {ticket.status === "Unread" && (
                 <button
                 disabled
                   className="text-sm bg-red-500 border px-4 py-2 rounded  text-white mt-4"
                 >
                   Open
                 </button>
                )}
                {ticket.status === "Read" && (
                 <button
                 disabled
                   className="text-sm bg-green-500  px-4 py-2 rounded  text-white  mt-4"
                 >
                   Closed
                 </button>
                )}
              </div>
              
              <p className="text-gray-700">{ticket.description}</p>
              
              {ticket.status === "Read" && (
                <>
                  <p className="text-gray-700 p-8 border rounded-lg mt-3 bg-white">
                    Replied: <span className="italic">&ldquo;{ticket.reply}&rdquo;</span>
                  </p>
                  
                </>
              )}
            </div>
          ))}
      </div>

      {/* Empty State for No Tickets */}
      {tickets.length === 0 && (
        <div className="text-center text-gray-500 mt-6 flex items-center justify-center">
          <Empty msg={`No ${activeTab.toLowerCase()} tickets to display.`} />
        </div>
      )}

      {/* Reply Popup */}
      {isPopupOpen && (
        <PopupForm
          title="Query Reply"
          fields={[
            { fieldname: "subject", placeholder: "Enter Subject", type: "text" },
            
           
          ]}
          textareas={[
            {
              fieldname: "description",
              placeholder: "Enter Details of your issue",
              default: oldReply,
            },
          ]}
          secrets={[
            { fieldname: "userId", value: userId },
          ]}
          onSubmit={createQuery}
          onClose={() => {
            setIsPopupOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UserTickets;
