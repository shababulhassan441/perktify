"use client";
import { useState } from "react";
import Empty from "../ui/Empty";
import PopupForm from "./PopupForm";
import { updateQueryReply } from "@/lib/actions";

const TicketView = ({ tickets }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Unread");
  const [replies, setReplies] = useState({});
  const [selectedQueryId, setSelectedQueryId] = useState("");
  const [oldReply, setOldReply] = useState("");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleReplyChange = (ticketId, value) => {
    setReplies({
      ...replies,
      [ticketId]: value,
    });
  };

  const handleSendReply = (ticketId) => {
    const reply = replies[ticketId];
    if (reply) {
      // Handle sending the reply (e.g., update backend, etc.)
      console.log("Reply sent for ticket:", ticketId, reply);
      // Reset the reply after sending
      setReplies({
        ...replies,
        [ticketId]: "",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg  border">
      <h3 className="text-2xl font-semibold text-gray-800 ">
        Customer Support
      </h3>
      {/* Tab Header */}
      <div className="flex justify-center gap-6 mb-6 border-b">
        {["Unread", "Read"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabSwitch(tab)}
            className={`px-4 py-2 text-lg font-medium ${
              activeTab === tab
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets
          .filter((ticket) => ticket.status === activeTab)
          .map((ticket) => (
            <div
              key={ticket.$id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-500">
                    By: {ticket.user.firstName} {ticket.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Email: {ticket.user.email}
                  </p>
                </div>
           {ticket.status ==="Unread" &&    <button
                  onClick={() => {setSelectedQueryId(ticket.$id);setIsPopupOpen(true)}}
                  className="text-sm text-purple-600 border border-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white"
                >
                  Reply
                </button>}
              </div>
              <p className="text-gray-700">{ticket.description}</p>
             { ticket.status ==="Read" &&   <> <p className="text-gray-700 p-8 border rounded-lg mt-3 bg-white">Replied: <span className="italic">&ldquo;{ticket.reply}&rdquo;</span> </p> <button
                  onClick={() => {setSelectedQueryId(ticket.$id);setOldReply(ticket.reply);setIsPopupOpen(true)}}
                  className="text-sm bg-gray-50 border  px-4 py-2 rounded hover:bg-gray-100 text-gray-500 mt-4 "
                >
                  Edit Reply
                </button></>}
            </div>
          ))}
      </div>

      {/* Empty State for No Tickets */}
      {tickets.filter((ticket) => ticket.status === activeTab).length === 0 && (
        <div className="text-center text-gray-500 mt-6 flex items-center justify-center">
          <Empty msg={` No ${activeTab.toLowerCase()} tickets to display.`} />
        </div>
      )}

      {isPopupOpen && (
        <PopupForm
          title="Query Reply"
          textareas={[
            {
              fieldname: "reply",
              placeholder: "Write Reply Here...",
              default:oldReply 
            },
          ]}
          secrets={[
            { fieldname: "queryId", value:selectedQueryId},
          ]}
          onSubmit={updateQueryReply}
          onClose={() => {setIsPopupOpen(false);setSelectedQueryId("");setOldReply("");}}
        />
      )}
    </div>
  );
};

export default TicketView;
