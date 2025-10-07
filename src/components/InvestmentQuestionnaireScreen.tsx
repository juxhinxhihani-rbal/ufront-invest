"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, FileText } from "lucide-react";
import LoadingSpinner from "@/components/helper/LoadingSpinner";
import SummaryScreen from "./SummaryScreen";
import { useLanguage } from "@/context/languageContext";
import { useSidebar } from "@/context/sidebarContext";
import MainLayout from "./layout/MainLayout";
import LanguageSwitch from "./helper/LanguageSwitch";
import Link from "next/link";
import { QuestionResponse, FormData } from "../types";
import { QuestionnaireService } from "../service/QuestionnaireService";


interface InvestmentQuestionnaireScreenProps {
    standalone?: boolean;
    initialSsn?: string;
}

export default function InvestmentQuestionnaireScreen({
    standalone = true,
    initialSsn = "",
}: InvestmentQuestionnaireScreenProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { t, language } = useLanguage();
    const { sidebarCollapsed, hideSidebar } = useSidebar();
    const hasSsnInRoute = Boolean(initialSsn && initialSsn.trim() !== "");
    const [isAccessDenied, setIsAccessDenied] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        clientName: "",
        ssn: initialSsn,
    });

    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [questionsError, setQuestionsError] = useState<string | null>(null);
    const [isCalculatingRisk, setIsCalculatingRisk] = useState(false);
    const [riskResult, setRiskResult] = useState<string>("");
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [showSummary, setShowSummary] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ssnTouched, setSsnTouched] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Listen for URL changes to handle reset parameter
        const handleUrlChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const resetSummary = urlParams.get('reset');
            const timestamp = urlParams.get('timestamp');

            if (resetSummary === 'true') {
                console.log('Resetting summary due to URL parameter');
                setShowSummary(false);
                // Clear the URL parameters
                urlParams.delete('reset');
                urlParams.delete('timestamp');
                const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
                window.history.replaceState({}, '', newUrl);
            }
        };

        // Check immediately
        handleUrlChange();

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', handleUrlChange);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    // Also listen for router events to handle navigation from sidebar
    useEffect(() => {
        const resetSummary = searchParams.get('reset');

        if (resetSummary === 'true') {
            console.log('Resetting summary due to route change');
            setShowSummary(false);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setIsAccessDenied(false);
                setIsLoadingQuestions(true);

                setRiskResult("");

                setQuestionsError(null);
                const questionsData = await QuestionnaireService.GetQuestions({ language });
                setQuestions(questionsData);

                // Initialize form data with question fields
                const initialFormData: FormData = {
                    clientName: "",
                    ssn: initialSsn,
                };

                questionsData.forEach(question => {
                    initialFormData[question.question] = "";
                });

                setFormData(initialFormData);
                setLoading(false);
            } catch (error) {
                console.log(error)
                console.error("Error loading questions:", error);
                const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
                const isAccessError = errorMessage.includes('access denied') ||
                    errorMessage.includes('unauthorized') ||
                    errorMessage.includes('403') ||
                    errorMessage.includes('forbidden');
                setRiskResult("");
                setIsAccessDenied(isAccessError);
                setQuestionsError(t("error.loading.questions"));
                setLoading(false);
            } finally {
                setIsLoadingQuestions(false);
            }
        };

        loadQuestions();
    }, [language, initialSsn, t]);

    // Update SSN when initialSsn changes
    useEffect(() => {
        setFormData((prev) => ({ ...prev, ssn: initialSsn }));
    }, [initialSsn]);

    const isFormValid = useMemo(() => {
        const requiredFields = ['ssn', ...questions.map(q => q.question)];
        const allRequiredFields = [...requiredFields];

        const allFieldsFilled = allRequiredFields.every(field => formData[field] && formData[field].trim() !== "");
        const ssnValid = formData.ssn && formData.ssn.trim().length >= 8;

        return allFieldsFilled && ssnValid;
    }, [formData, questions]);

    const isSsnValid = useMemo(() => {
        return !formData.ssn || formData.ssn.trim().length >= 8;
    }, [formData.ssn]);

    const showSsnError = ssnTouched && !isSsnValid && formData.ssn;

    useEffect(() => {
        const hasAnsweredQuestions = questions.some(question => {
            const answer = formData[question.question];
            return answer && answer.trim() !== "";
        });
        const hasSsn = formData.ssn && formData.ssn.trim().length >= 8;

        if (isFormValid && hasAnsweredQuestions && hasSsn) {
            const calculateRisk = async () => {
                try {
                    setIsCalculatingRisk(true);

                    const selections: Array<{ questionId: number; answerId: number }> = [];

                    questions.forEach(question => {
                        const selectedAnswer = formData[question.question];
                        if (selectedAnswer) {
                            const answerOption = question.answers.find(answer => answer.answer === selectedAnswer);
                            if (answerOption) {
                                selections.push({
                                    questionId: question.id,
                                    answerId: answerOption.id
                                });
                            }
                        }
                    });

                    const result = await QuestionnaireService.CalculateRisk({
                        ssn: formData.ssn,
                        selections
                    });

                    const translatedResult = language === 'al'
                        ? TranslateRiskResult(result)
                        : result;

                    setRiskResult(translatedResult);
                    setShowSummary(false);
                } catch (error) {
                    console.error("Error calculating risk:", error);
                    setRiskResult("");

                } finally {
                    setIsCalculatingRisk(false);
                }
            };

            calculateRisk();
        } else {
            setRiskResult("");
        }
    }, [formData, questions, isFormValid]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Reset touched state when user starts typing in SSN field
        if (field === 'ssn') {
            setSsnTouched(false);
        }
    };

    const handleSsnBlur = () => {
        setSsnTouched(true);
    };

    const handleContinue = async () => {
        if (!isFormValid) return;

        try {
            setIsSubmitting(true);
            await QuestionnaireService.SubmitRiskResult(formData.ssn, riskResult);
            setShowSummary(true);
        } catch (error) {
            console.error("Error submitting risk result:", error);
            // Still show summary even if submission fails
            setShowSummary(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setLoading(true);

        try {
            setQuestionsError(null);
            const questionsData = await QuestionnaireService.GetQuestions({ language });
            setQuestions(questionsData);

            // Re-initialize form data
            const initialFormData: FormData = {
                clientName: "",
                ssn: initialSsn,
            };

            questionsData.forEach(question => {
                initialFormData[question.question] = "";
            });

            setFormData(initialFormData);
        } catch (error) {
            console.error("Error refreshing questions:", error);
            setQuestionsError(t("error.loading.questions"));
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const getQuestionLabel = (question: QuestionResponse): string => {
        return question.question;
    };

    const getOptionLabel = (question: QuestionResponse, optionValue: string): string => {
        const option = question.answers.find(opt => opt.answer === optionValue);
        return option ? option.answer : optionValue;
    };

    const handleBackToForm = () => {
        setShowSummary(false);
    };

    // Header bulletin info
    const bulletinInfo = {
        date: new Date().toLocaleDateString(),
        number: "Q-001"
    };

    if (loading) {
        return <LoadingSpinner text={t("loading.questionnaire")} />;
    }

    if (questionsError) {
        return (
            <MainLayout hideSidebar={standalone}>
                <div className="min-h-screen bg-white flex flex-col">
                    {/* Content */}
                    <div className="flex-1 max-w-2xl mx-auto p-6 pb-20 mb-8">
                        {/* Header Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="bg-red-100 p-8 rounded-full">
                                <AlertCircle className="w-16 h-16 text-red-500" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
                            {t("error.loading.questions")}
                        </h2>

                        <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow">
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">
                                    {isAccessDenied
                                        ? "You don't have permission to access the questionnaire. Please contact your administrator."
                                        : "There was a problem loading the questionnaire. Please try again."
                                    }
                                </p>

                                {!isAccessDenied && (
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="bg-[#FFD700] text-black px-6 py-3 rounded-lg hover:bg-[#FFD700]/90 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                                    >
                                        {isRefreshing ? "Loading..." : "Try Again"}
                                    </button>
                                )}

                                {isAccessDenied && (
                                    <div className="text-sm text-gray-500 mt-4">
                                        Required permission: menu_invest_questionnaire_view
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Show summary screen
    if (showSummary) {
        // Create handlers for PDF and print
        const handleDownloadPDF = () => {
            console.log('Download PDF clicked');

            // Create a formatted content for PDF
            const content = `
<!DOCTYPE html>
<html>
<head>
    <title>Investment Risk Questionnaire Summary</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
        }
        .section { 
            margin-bottom: 25px; 
        }
        .question { 
            font-weight: bold; 
            margin-bottom: 8px; 
            color: #2c3e50;
        }
        .answer { 
            margin-left: 20px; 
            margin-bottom: 15px; 
            color: #555;
        }
        .result { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-left: 4px solid #007bff; 
            margin-top: 30px;
        }
        .personal-info { 
            background-color: #fff; 
            padding: 15px; 
            border: 1px solid #ddd; 
            margin-bottom: 30px;
        }
        @media print {
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Investment Risk Questionnaire Summary</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="personal-info">
        <h2>Personal Information</h2>
        <p><strong>Name:</strong> ${formData.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
        ${formData.ssn ? `<p><strong>SSN:</strong> ${formData.ssn}</p>` : ''}
    </div>
    
    <div class="section">
        <h2>Questionnaire Responses</h2>
        ${questions.map((question, index) => {
                const selectedAnswer = formData[question.question];
                if (selectedAnswer !== undefined && selectedAnswer !== '') {
                    const option = question.answers.find(opt => opt.answer === selectedAnswer);
                    return `
                    <div style="margin-bottom: 20px;">
                        <div class="question">${index + 1}. ${question.question}</div>
                        <div class="answer">${option ? option.answer : selectedAnswer}</div>
                    </div>
                `;
                }
                return '';
            }).join('')}
    </div>
    
    <div class="result">
        <h2>Risk Assessment Result</h2>
        <p style="font-size: 18px; font-weight: bold; color: #007bff;">${riskResult}</p>
    </div>
    
    <script>
        window.onload = function() {
            // Automatically trigger print dialog for PDF save
            window.print();
        }
    </script>
</body>
</html>
            `;

            // Create blob and download
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `investment-questionnaire-summary-${new Date().getTime()}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Also open in new window for immediate PDF save
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(content);
                newWindow.document.close();
            }
        };

        const handlePrint = () => {
            console.log('Print clicked'); // Debug log
            window.print();
        };

        const summaryContent = (
            <SummaryScreen
                formData={formData}
                questions={questions}
                riskResult={riskResult}
                onBack={handleBackToForm}
                hideBackButton={false} // Always show back button now
                hideHeader={!standalone} // Hide header for regular questionnaire (not standalone)
                onDownloadPDF={handleDownloadPDF}
                onPrint={handlePrint}
            />
        );

        // If not standalone (regular questionnaire), wrap with MainLayout to show sidebar
        if (!standalone) {
            return (
                <MainLayout
                    showSummaryActions={true}
                    onDownloadPDF={handleDownloadPDF}
                    onPrint={handlePrint}
                >
                    {summaryContent}
                </MainLayout>
            );
        }

        // If standalone (SSN-based), return without MainLayout
        return summaryContent;
    }

    const questionnaire = (
        <div className="min-h-screen bg-white flex flex-col">

            <div className={`flex-1 max-w-2xl mx-auto p-6 ${showSummary ? "pb-4 mb-2" : "pb-20 mb-8"}`}>

                <form className="space-y-6 bg-gray-50 p-6 rounded-xl shadow" onSubmit={(e) => e.preventDefault()}>
                    {/* SSN Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("ssn")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.ssn}
                            onChange={(e) => handleInputChange("ssn", e.target.value)}
                            onBlur={handleSsnBlur}
                            readOnly={hasSsnInRoute}
                            minLength={8}
                            maxLength={14}
                            className={`w-full p-3 border rounded-lg transition-colors ${hasSsnInRoute
                                ? "bg-gray-50 cursor-not-allowed border-gray-300"
                                : `bg-white ${showSsnError
                                    ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                                }`
                                }`}
                            placeholder={hasSsnInRoute ? "" : t("ssn.placeholder")}
                            required
                        />
                        {showSsnError && (
                            <p className="mt-1 text-sm text-red-600">
                                {t("ssn.min.length")}
                            </p>
                        )}
                    </div>

                    {/* Dynamic Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {questions.map((question) => (
                            <div key={question.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {getQuestionLabel(question)} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData[question.question] || ""}
                                    onChange={(e) => handleInputChange(question.question, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors"
                                    required
                                >
                                    <option value="">{t("select")}</option>
                                    {question.answers.map((option) => (
                                        <option key={option.id} value={option.answer}>
                                            {option.answer}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Result Field */}
                    <div className="mt-8">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("result")}:
                        </label>
                        <input
                            type="text"
                            value={riskResult}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-medium"
                        />
                    </div>

                    {!showSummary && <div className="pb-4"></div>}

                    {/* Submit Button */}
                    {!showSummary && (
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
                            <div className={`transition-all duration-300 p-4 ${standalone
                                ? "ml-0"
                                : hasSsnInRoute
                                    ? "ml-0"
                                    : hideSidebar
                                        ? "ml-0"
                                        : sidebarCollapsed
                                            ? "ml-16"
                                            : "ml-60"
                                }`}>
                                <div className="max-w-2xl mx-auto">
                                    <div className="relative group">
                                        <button
                                            type="button"
                                            disabled={!isFormValid || isCalculatingRisk || isSubmitting}
                                            onClick={handleContinue}
                                            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors
                          ${isFormValid && !isCalculatingRisk && !isSubmitting
                                                    ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/90 shadow-md hover:shadow-lg"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            {isSubmitting ? "Submitting..." : t("submit.data")}
                                        </button>
                                        {(!isFormValid || !isSsnValid) && (
                                            <div
                                                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                                <div
                                                    className="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                                                    {!isSsnValid && formData.ssn
                                                        ? t("ssn.min.length")
                                                        : t("please.complete.form")
                                                    }
                                                    <div
                                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

            </div>

        </div>
    );

    // Return with or without sidebar based on standalone prop
    return <MainLayout hideSidebar={standalone}>{questionnaire}</MainLayout>;
}

function TranslateRiskResult(result: string): string {
    switch (result) {
        case "Risk Averse":
            return "Tolerancë e ulët ndaj riskut";
        case "Neutral":
            return "Tolerancë mesatare ndaj riskut";
        case "Risk Taker":
            return "Tolerancë e lartë ndaj riskut";
        default:
            return "";
    }
}
