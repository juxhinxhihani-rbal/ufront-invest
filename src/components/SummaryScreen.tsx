import React from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { QuestionResponse, FormData } from "../types";
import { useLanguage } from "@/context/languageContext";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SummaryScreenProps {
  formData: FormData;
  questions: QuestionResponse[];
  riskResult: string;
  onBack: () => void;
  hideBackButton?: boolean;
  hideHeader?: boolean;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
}

export default function SummaryScreen({
  formData,
  questions,
  riskResult,
  onBack,
  hideBackButton = false,
  hideHeader = false,
  onDownloadPDF,
  onPrint,
}: SummaryScreenProps) {
  const { t } = useLanguage();

  const getQuestionLabel = (question: QuestionResponse): string => {
    return question.question;
  };

  const getOptionLabel = (question: QuestionResponse, optionValue: string): string => {
    const option = question.answers.find(opt => opt.answer === optionValue);
    return option ? option.answer : optionValue;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a temporary element for PDF generation
      const element = document.createElement('div');
      element.style.width = '210mm';
      element.style.minHeight = '297mm';
      element.style.padding = '20mm';
      element.style.backgroundColor = 'white';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontSize = '12px';
      element.style.lineHeight = '1.4';
      element.style.color = '#000';

      // Create PDF content
      let content = `
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333;">
          <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #000;">Invest Summary</h1>
          <h2 style="font-size: 18px; margin: 10px 0; color: #666;">${t("investment.summary")}</h2>
          <div style="font-size: 11px; color: #666; margin-top: 15px;">
            <p style="margin: 2px 0;">${t("generated.on")}: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 2px 0;">${t("time")}: ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div style="margin-bottom: 80px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1; margin-right: 20px;">
              <h3 style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">${t("client.information")}</h3>
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${formData.ssn}</p>
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">${t("risk.assessment")}</h3>
              <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; ${getRiskColorForPDF(riskResult)}">${riskResult}</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #000;">${t("investment.summary.print")}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #000; padding: 10px; text-align: left; font-size: 11px; font-weight: bold; width: 40%;">${t("question")}</th>
                <th style="border: 1px solid #000; padding: 10px; text-align: left; font-size: 11px; font-weight: bold;">${t("response")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">${t("ssn")}</td>
                <td style="border: 1px solid #000; padding: 10px; font-family: monospace;">${formData.ssn}</td>
              </tr>
      `;

      questions.forEach((question, index) => {
        content += `
          <tr>
            <td style="border: 1px solid #000; padding: 10px;">
              <div style="display: flex; align-items: flex-start;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #e3f2fd; color: #1976d2; border-radius: 50%; text-align: center; line-height: 20px; font-size: 10px; font-weight: bold; margin-right: 8px; flex-shrink: 0;">${index + 1}</span>
                <span>${getQuestionLabel(question)}</span>
              </div>
            </td>
            <td style="border: 1px solid #000; padding: 10px;">${getOptionLabel(question, formData[question.question])}</td>
          </tr>
        `;
      });

      content += `
              <tr style="background-color: #fff3cd;">
                <td style="border: 1px solid #000; padding: 10px; font-weight: bold;">
                  <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 8px; height: 8px; background-color: #ffc107; border-radius: 50%; margin-right: 8px;"></span>
                    ${t("result")}
                  </div>
                </td>
                <td style="border: 1px solid #000; padding: 10px;">
                  <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; ${getRiskColorForPDF(riskResult)}">${riskResult}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 50px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="flex: 1;">
              <p style="margin: 0; font-size: 12px; color: #666;">${t("signature")}:</p>
              <div style="border-bottom: 2px solid #000; width: 200px; height: 40px; margin-top: 5px;"></div>
            </div>
          </div>
        </div>

        <div style="text-align: center; font-size: 10px; color: #666; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 15px;">
          <p style="margin: 2px 0;">${t("summary.generated")} ${new Date().toLocaleDateString()} ${t("at")} ${new Date().toLocaleTimeString()}</p>
          <p style="margin: 2px 0;">Invest Summary - ${t("platform.subtitle")}</p>
        </div>
      `;

      element.innerHTML = content;
      document.body.appendChild(element);

      // Generate PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(element);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`investment-summary-${formData.ssn}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download
      handleTextDownload();
    }
  };

  const handleTextDownload = () => {
    let content = `INVESTMENT PLATFORM - ${t("investment.summary")}\n`;
    content += `${t("generated.on")}: ${new Date().toLocaleDateString()}\n`;
    content += `${t("time")}: ${new Date().toLocaleTimeString()}\n\n`;
    content += "=" .repeat(50) + "\n\n";
    
    content += `${t("ssn")}: ${formData.ssn}\n\n`;
    
    questions.forEach((question) => {
      content += `${getQuestionLabel(question)}:\n`;
      content += `${getOptionLabel(question, formData[question.question])}\n\n`;
    });
    
    content += `${t("result")}: ${riskResult}\n\n`;
    content += `${t("signature")}: _________________\n\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investment-summary-${formData.ssn}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'conservative':
        return 'text-green-700 bg-green-100';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100';
      case 'aggressive':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getRiskColorForPDF = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'conservative':
        return 'color: #15803d; background-color: #dcfce7;';
      case 'moderate':
        return 'color: #a16207; background-color: #fef3c7;';
      case 'aggressive':
        return 'color: #b91c1c; background-color: #fee2e2;';
      default:
        return 'color: #374151; background-color: #f3f4f6;';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Header - Only visible when printing */}
      <div className="print-header hidden print:block text-center mb-16 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 m-24">{t("invest.summary")}</h1>
        
      </div>

      {/* Screen Header - Hidden when printing or when hideHeader is true */}
      {!hideHeader && (
        <div className="print:hidden bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">{t("investment.summary")}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onPrint || handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 rounded-lg transition-colors font-medium"
                >
                  <Printer className="w-4 h-4" />
                  {t("print")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 printable-content">
        {/* Summary Cards with Back Button */}
        <div className="flex gap-4 md:gap-6 mb-8 print:hidden">
          {/* Back Button Card - Small width */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors w-20 md:w-24 flex-shrink-0" onClick={onBack}>
            <div className="text-center">
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-600 mx-auto mb-1 md:mb-2" />
              <p className="text-xs md:text-sm font-medium text-gray-600">{t("back")}</p>
            </div>
          </div>
          
          {/* Client Information Card - Takes remaining space */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 flex-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">{t("client.information")}</h3>
            <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1 md:mt-2 truncate">{formData.ssn}</p>
          </div>
          
          {/* Risk Assessment Card - Takes remaining space */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 flex-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">{t("risk.assessment")}</h3>
            <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium mt-1 md:mt-2 ${getRiskColor(riskResult)}`}>
              {riskResult}
            </span>
          </div>
        </div>

        {/* Detailed Summary Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    {t("question")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("response")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* SSN Row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {t("ssn")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                    {formData.ssn}
                  </td>
                </tr>
                
                {/* Question Rows */}
                {questions.map((question, index) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span>{getQuestionLabel(question)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getOptionLabel(question, formData[question.question])}
                    </td>
                  </tr>
                ))}
                
                {/* Result Row */}
                <tr className="bg-yellow-50 hover:bg-yellow-100">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      {t("result")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(riskResult)}`}>
                      {riskResult}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6 print:block hidden">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">{t("signature")}:</p>
              <div className="border-b-2 border-gray-400 w-64 h-12"></div>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-8 text-center text-sm text-gray-500 print:mt-12">
          <p>{t("summary.generated")} {new Date().toLocaleDateString()} {t("at")} {new Date().toLocaleTimeString()}</p>
          <p className="mt-1">Invest Platform - {t("platform.subtitle")}</p>
        </div>
      </div>

      {/* Enhanced Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          
          /* Reset and base styles */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            font-family: Arial, sans-serif;
          }
          
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          
          /* Show print header */
          .print-header {
            margin-bottom: 60px !important;
          }
          
          .print-header,
          .print-header * {
            visibility: visible;
          }
          
          /* Show printable content */
          .printable-content,
          .printable-content * {
            visibility: visible;
          }
          
          /* Position content */
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          /* Table styles for print */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 15px 0 !important;
            page-break-inside: avoid;
          }
          
          table th,
          table td {
            border: 1px solid #000 !important;
            padding: 8px !important;
            text-align: left !important;
            vertical-align: top !important;
            font-size: 10pt !important;
          }
          
          table th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
          }
          
          /* Highlight result row */
          tr:last-child td {
            background-color: #fff3cd !important;
            font-weight: bold !important;
          }
          
          /* Risk assessment styling */
          .text-green-700 { color: #15803d !important; }
          .text-yellow-700 { color: #a16207 !important; }
          .text-red-700 { color: #b91c1c !important; }
          .bg-green-100 { background-color: #dcfce7 !important; }
          .bg-yellow-100 { background-color: #fef3c7 !important; }
          .bg-red-100 { background-color: #fee2e2 !important; }
          
          /* Signature section */
          .signature-section {
            margin-top: 30px !important;
            page-break-inside: avoid;
          }
          
          /* Page breaks */
          .printable-content {
            page-break-inside: avoid;
          }
          
          /* Hide interactive elements */
          button,
          .print\\:hidden {
            display: none !important;
          }
          
          /* Show print-only elements */
          .print\\:block {
            display: block !important;
          }
          
          /* Headers */
          h1, h2, h3 {
            page-break-after: avoid;
          }
          
          /* Ensure proper spacing */
          .mt-12 {
            margin-top: 30px !important;
          }
        }
      `}</style>
    </div>
  );
}