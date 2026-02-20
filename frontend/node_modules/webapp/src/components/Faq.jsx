import React, { useState } from "react";

const faqData = [
  {
    question: "What is a scholarship?",
    answer:
      "A scholarship is financial aid awarded to students to help pay for their education. It does not need to be repaid and is usually based on academic merit, financial need, or other specific criteria."
  },
  {
    question: "Who can apply for these scholarships?",
    answer:
      "Eligibility varies by scholarship. Some are open to students from specific countries, for certain degree levels (Undergraduate, Master's, PhD), or for specific fields of study. Always check the eligibility section in the scholarship details."
  },
  {
    question: "How can I apply for a scholarship?",
    answer:
      "Each scholarship has its own application process. Generally, you will need to submit an online application form, academic documents, and sometimes a personal statement or letters of recommendation."
  },
  {
    question: "Do I need to take IELTS or TOEFL for international scholarships?",
    answer:
      "Most international scholarships require proof of English proficiency, such as IELTS or TOEFL. However, if your previous education was in English, you may be exempt from this requirement."
  },
  {
    question: "Are there any application fees?",
    answer:
      "Most fully funded scholarships do not charge an application fee. However, always verify this information on the official scholarship website."
  },
  {
    question: "What does a fully funded scholarship cover?",
    answer:
      "A fully funded scholarship usually covers university tuition fees, living expenses, accommodation, health insurance, and sometimes travel costs such as airfare."
  },
  {
    question: "Can I apply for more than one scholarship at a time?",
    answer:
      "Yes, you can apply for multiple scholarships. However, if you are awarded more than one, you may only accept one, depending on the rules of each program."
  },
  {
    question: "How will I know if I am selected for the scholarship?",
    answer:
      "Selected candidates are typically notified via email. The notification timeline varies by scholarship, so regularly check your email and spam folder."
  },
  {
    question: "Where can I find the latest scholarships?",
    answer:
      "You can find the latest scholarship updates on our homepage or by subscribing to our newsletter for regular notifications."
  },
  {
    question: "What documents are usually required?",
    answer:
      "Common required documents include academic transcripts, passport, English test results (IELTS/TOEFL), letters of recommendation, a personal statement, and a resume/CV."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-xl shadow-md bg-white overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center hover:bg-blue-50"
              >
                <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                <span className="text-xl text-blue-600">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700 whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
