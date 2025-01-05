// import React, { useEffect, useState } from 'react';
import { CalendarIcon } from "@heroicons/react/24/outline";
import { fetchLeadsAnalytics } from "@/lib/data";
import { generateYAxis } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function RevenueChart() {
  cookies();
  const revenue = await fetchLeadsAnalytics();
  const { yAxisLabels, topLabel } = generateYAxis(revenue);
  const chartHeight = 350;

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={` mb-4 text-xl md:text-2xl`}>Leads Analytics</h2>

      <div className="rounded-xl bg-white border p-4">
        <div className="grid grid-cols-12">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>
          <div className=" col-span-11 mt-0 grid grid-cols-12 items-end gap-2  bg-gray-50 border rounded-lg p-4 md:gap-6">
            {revenue.map((month) => (
              <div
                key={month.month}
                className="flex flex-col items-center gap-2 group"
              >
                 <p className="text-primary opacity-0 group-hover:opacity-100">
                  {month.userRegistrations}
                </p>
                <div
                  className="w-full rounded-md bg-primary/[0.3] hover:border border-primary"
                  style={{
                    height: `${
                      (chartHeight / topLabel) * month.userRegistrations
                    }px`,
                  }}
                ></div>
                <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                  {month.month}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <h3 className="ml-2 text-sm text-gray-400">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
