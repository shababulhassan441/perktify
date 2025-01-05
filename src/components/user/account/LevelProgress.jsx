import React from "react";
import { FaCheck } from "react-icons/fa";

const getCompletionStatus = (stepIndex, currentLevel) => {
  return currentLevel >= stepIndex;
};

const LevelProgress = ({ currentLevel, points, labels }) => {
  const levels = [
    { title: "New User" },
    { title: labels[0] },
    { title: labels[1] },
    { title: labels[2] },
  ];

  const renderStepIcon = (stepIndex, completed) => {
    return completed ? (
      <FaCheck className="w-4 h-4 text-white" />
    ) : (
      <>{stepIndex + 1}</>
    );
  };

  return (
    <div className="bg-white px-1 py-6 pb-12 border rounded-xl border-gray-200 mb-4">
      <div className="flex flex-col items-center justify-center gap-4 mb-6">
        <img src="/point.webp" alt="coins" className=" w-[80px] object-cover" />

        <div className="text-center ">
          <h2>Earned Points</h2>
          <h1 className="font-bold text-2xl">{points}</h1>
        </div>
      </div>
      <ol className="flex items-center justify-center space-x-6 md:space-x-32 relative">
        {levels.map((level, index) => {
          const completed = getCompletionStatus(index, currentLevel);
          return (
            <li
              key={index}
              className="relative flex flex-col items-center "
            >
              {/* Hexagon Shape */}
              <div
                className={`w-12 h-12 flex items-center justify-center ${
                  completed ? "bg-yellow-500" : "bg-gray-200"
                } text-${
                  completed ? "white" : "gray-600"
                } shadow-lg transform rotate-30`}
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                {renderStepIcon(index, completed)}
              </div>
              {/* Level Title */}
              <h3
                className={`absolute  left-0 right-0 mx-auto top-12 whitespace-nowrap font-medium leading-tight mt-2 ${
                  completed ? "text-yellow-500" : "text-gray-600"
                }`}
                style={{
                  transform:
                    level.title.length > 6
                      ? `translateX(-${(level.title.length - 6) * 5}px)` // Negative translate for titles longer than 5 characters
                      : level.title.length < 6
                      ? `translateX(${(6 - level.title.length) * 3}px)` // Positive translate for titles shorter than 5 characters
                      : "none", // No translation if title is exactly 5 characters
                }}
              >
                {level.title}
              </h3>

              {/* Connecting Line between Hexagons */}
              {index !== levels.length - 1 && (
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-6  md:w-32 h-1 bg-${
                    completed ? "yellow-500" : "gray-300"
                  }`}
                  style={{ left: "100%" }}
                ></div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LevelProgress;
