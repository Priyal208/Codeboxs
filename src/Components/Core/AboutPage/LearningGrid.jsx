import React from "react";
import HighlightText from "../../../Components/Core/HomePage/HighlightText";
import CTAButton from "../../../Components/Core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "Codeboxs partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Codeboxs curriculum is designed to be user-friendly and aligned with industry requirements.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Codeboxs collaborates with top universities and companies to deliver innovative learning experiences.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Codeboxs provides industry-recognized certifications in partnership with leading universities and companies.",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Codeboxs implements advanced auto-grading systems to ensure consistent and fair assessment.",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Codeboxs equips learners with the skills needed to thrive in their careers, partnering with industry leaders.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "xl:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
