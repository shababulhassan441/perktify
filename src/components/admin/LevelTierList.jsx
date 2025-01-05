"use client";
import { updateTiers } from "@/lib/actions";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import Button from "../common/Button";
const initialState = {
  message: "",
  type: "",
};

const LevelTier = ({id, label, threshold,tierIndex }) => {
  const [state, formAction] = useFormState(updateTiers, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ label, threshold });

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      setIsEditing(false); // Exit editing mode
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true); // Set editing mode to true
  };

  const handleCancel = () => {
    setFormData({ label, threshold });  // Reset form data
    setIsEditing(false); // Exit editing mode
  };

  return (
    <form action={formAction} className="border p-4 rounded-lg mt-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Tier {tierIndex+1}</h3>
      <div className="mb-4">
        <input type="hidden" name="tierId" value={id} />
        <label className="block text-sm font-medium text-gray-700">
          Tier Label
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          className="mt-1 block w-full border px-3 py-2 rounded-md outline-none"
          readOnly={!isEditing} // Read-only if not in editing mode
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Threshold
        </label>
        <input
          type="number"
          name="threshold"
          value={formData.threshold}
          onChange={handleChange}
          className="mt-1 block w-full border px-3 py-2 rounded-md outline-none"
          readOnly={!isEditing} // Read-only if not in editing mode
          required
        />
      </div>
      <div className="flex gap-1 justify-end">
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEdit} // Edit button to enable editing mode
            className="bg-gray-50  hover:bg-gray-100 text-gray-600 border w-full max-w-[150px] py-2 rounded-md"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancel} // Cancel button to reset form
              className="!text-gray-700 w-full max-w-[150px]"
            >
              Cancel
            </button>
            <Button
            type="submit"
              className="bg-gray-50  hover:bg-gray-100 !text-gray-600 border w-full max-w-[150px] py-2 rounded-md flex items-center justify-center"
            >
              Save
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

// Main Component that maps LevelTier
const LevelTierList = ({ tiersData }) => {


  return (
    <div className="p-6 bg-white rounded-lg  border">
    <h3 className="text-2xl font-semibold text-gray-800 ">
      Level/Tiers Management
    </h3>
      {tiersData.map((tier,index) => (
        <LevelTier
          key={tier.$id}
          id={tier.$id}
          tierIndex={index}
          label={tier.label}
          threshold={tier.threshold}
        />
      ))}
    </div>
  );
};

export default LevelTierList;
