"use client";

import React, { useState } from "react";

const LevelMetrics = ({tiers}) => {
    const levels = [
        {
          title: tiers[0].label,
          criteria: [
            "Referred at least 1 member",
            `"Earned at least ${tiers[0].threshold} points"`,
          ],
          benefits: [
            "Receive a 5% off coupon for Storekwil stores",
            "1-month free usage of the Storekwil app",
          ],
        },
        {
          title: tiers[1].label,
          criteria: [
            "Referred at least 5 members",
            `"Earned at least ${tiers[1].threshold} points"`,
          ],
          benefits: [
            "Receive a 10% off coupon for Storekwil stores",
            "2-months free usage of the Storekwil app",
            "Priority customer support",
          ],
        },
        {
          title: tiers[2].label,
          criteria: [
            "Referred at least 20 members",
            `"Earned at least ${tiers[2].threshold} points"`,
          ],
          benefits: [
            "Receive a 20% off coupon for Storekwil stores",
            "3-months free usage of the Storekwil app",
            "Exclusive access to new features",
           
          ],
        },
      ];
      

  const renderLevelCard = (level, index) => (
    <div
      key={index}
      className="p-6 bg-white rounded-xl border shadow-md space-y-4 mb-4"
    >
      <div className="flex items-center justify-start gap-2">
        <div
          className={`w-10 h-10 flex items-center justify-center custom-gradient shadow-lg transform rotate-30`}
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <span className="w-4 h-4 rounded-full bg-white "></span>
        </div>
        <h4 className="text-xl font-semibold text-gray-900">{level.title}</h4>
      </div>
      <h3>Minimum Requirements</h3>
      {
        level.criteria.map(
            (criteria,index)=>(
                <p key={index} className="text-sm text-gray-500">{criteria}</p>
            )
        )
      }

      <h3>Level {index + 1} Benefits</h3>
      {
        level.benefits.map(
            (benefit,index)=>(
                <p key={index} className="text-sm text-gray-500">{benefit}</p>
            )
        )
      }
     
    </div>
  );

  return (
    <section className="mb-4 p-4 border rounded-xl bg-light duration-200 ease-in-out">
      <div className="flex cursor-pointer items-center justify-between mb-4">
        <h3 className={`text-xl font-bold text-gray-500`}>
          Levels Criteria and Benefits
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level, index) => renderLevelCard(level, index))}
      </div>
    </section>
  );
};

export default LevelMetrics;
