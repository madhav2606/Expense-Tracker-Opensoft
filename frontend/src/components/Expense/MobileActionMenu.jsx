import { Eye, Menu, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

const MobileActionMenu = ({ expense }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Menu size={18} />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                onClick={() => {
                  handleViewExpense(expense);
                  setShowActions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Eye size={16} className="mr-2" /> View
              </button>
              <button
                onClick={() => {
                  handleEditExpense(expense);
                  setShowActions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Pencil size={16} className="mr-2" /> Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteExpense(expense._id);
                  setShowActions(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default MobileActionMenu;