"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "al" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Questionnaire
    "risk.questionnaire": "Risk Questionnaire",
    ssn: "SSN",
    select: "Select",
    result: "Result",
    "submit.data": "Submit Data",
    "please.complete.form": "Please complete all fields",
    "error.loading.questions": "Error loading questions",
    "investment.summary": "Investment Summary",
    
  // Sidebar navigation
  "sidebar.exchange.rate": "Exchange Rate",
  "sidebar.upload.file": "Upload File",
  "sidebar.reports.table": "Reports Table",
  "sidebar.investment.questionnaire": "Investment Questionnaire",
  "sidebar.fund.configuration": "Fund Configuration",
    
    // User profile
    "profile.logout": "Logout",
    
    // Summary screen
    "back": "Back",
    "back.to.form": "Back to Form",
    "download.pdf": "Download PDF",
    "print": "Print",
    "client.information": "Client Information",
    "risk.assessment": "Risk Assessment",
    "detailed.responses": "Detailed Responses",
    "results": "Results",
    "investment.summary.print": "Investment Summary",
    "question": "Question",
    "response": "Response",
    "generated.on": "Generated on",
    "time": "Time",
    "firma": "Firma",
    "signature": "Signature",
    "summary.generated": "This summary was generated on",
    "at": "at",
    "platform.subtitle": "Investment Risk Assessment",
    
    // Form placeholders
    "invest.summary": "Invest Summary",
    "ssn.placeholder": "Enter SSN (A12345678B)",
    "ssn.min.length": "SSN must be at least 8 characters",
    
    // Language switch
    "switch.language": "AL",
    // ... existing translations
    "ssn.required": "SSN Required",
    "ssn.required.description": "Please provide your SSN in the URL to access the investment questionnaire",
    "required.url.format": "Required URL Format:",
    "invalid.ssn.format": "Invalid SSN Format",
    "invalid.ssn.description": "The provided SSN does not match the required format for the investment questionnaire",
    "current.ssn": "Current SSN:",
    "required.format": "Required Format:",
    "format.description": "Letter + 8 digits + Letter",
    "loading.questionnaire": "Loading questionnaire...",
    "loading.default": "Loading...",
    
    // Exchange Rate translations
    "exchange.rates.title": "Exchange Rates",
    "loading.exchange.rates": "Loading exchange rates...",
    "connection.error": "Connection Error",
    "try.again": "Try Again",
    "retrying": "Retrying...",
    "last.update.successful": "Last Update Successful",
    "auto.update.info": "Exchange rates are automatically updated every 30 minutes",
    "push.notifications": "Push Notifications",
    "activate.notifications": "Activate notifications for rate changes",
    "activate": "Activate",
    "individual": "Individual",
    "corporate": "Corporate",
    "individual.description": "For amounts up to 50,000 EUR equivalent",
    "corporate.description": "For corporate clients and amounts above 50,000 EUR equivalent",
    "currency.type": "Currency Type",
    "code": "Code",
    "buy.rate": "Buy Rate",
    "sell.rate": "Sell Rate",
    "average": "Average",
    "trend": "Trend",
    "nr": "Nr.",
    "important.notes": "Important Notes",
    "individual.note": "Exchange rates for individual clients with amounts up to 50,000 EUR equivalent",
    "corporate.note": "Exchange rates for corporate clients and amounts above 50,000 EUR equivalent",
    "auto.refresh.info": "Exchange rates are automatically refreshed every 30 minutes during business hours",
    "last.updated.at": "Last updated at",
    "refresh": "Refresh",
    "error.occurred": "An error occurred",
    "offline.message": "You appear to be offline. Please check your internet connection.",
    "auto.retry.message": "Auto-retry in progress... (Attempt {count}/3)",

    // Investment Report translations
    'investment.reports': 'Investment Reports',
    'detailed.investment.data': 'Detailed investment transaction data',
    'date': 'Date',
    'status': 'Status',
    'all': 'All',
    'completed': 'Completed',
    'pending': 'Pending',
    'failed': 'Failed',
    'processing': 'Processing',
    'download.excel': 'Download Excel',
    'investment.report': 'Investment Report',
    'records.displayed': 'records displayed',
    'summary': 'Summary',
    'total.records': 'Total Records',
    'total.amount': 'Total Amount',
    'loading.reports': 'Loading reports...',
    'loading.funds': 'Loading funds...',
    "subtitle.exchangeRate": "Exchange Rate Management",
    "subtitle.uploadFile": "Upload & Process Files",
    "subtitle.reports": "Reports & Analytics",
    "fund.configuration": "Fund Configuration",
    "subtitle.fundConfiguration": "Manage fund configuration records",
    // Yellow header (short) for fund configuration card
    "fund.header.title": "Funds Overview",
    "fund.header.subtitle": "Active funds and quick actions",
    "search": "Search",
    "search.placeholder": "Search",
    "subtitle.default": "Investment Questionnaire",

    // Dashboard translations
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Welcome to your investment management platform. Select an option below to get started.",
    "dashboard.quick.access": "Quick Access",
    "dashboard.live.rates": "Live Rates",
    "dashboard.live.rates.desc": "Real-time exchange rates",
    "dashboard.reports": "Reports",
    "dashboard.reports.desc": "Investment analytics",
    "dashboard.assessment": "Assessment",
    "dashboard.assessment.desc": "Risk evaluation tool",
    "dashboard.upload": "Upload Files",
    "dashboard.upload.desc": "Process and manage files",
  "dashboard.fund.configuration.desc": "Manage fund types and settings",

    // Token refresh notifications
    "token.refreshed": "Roles Updated",
    "token.refreshed.desc": "Your user roles have been updated",

    // Access denied screen
    "access.denied.title": "Access Denied",
    "access.denied.message": "You don't have the required permissions to access this investment platform.",
    "access.denied.contact": "If you believe this is an error or need access to the investment platform, please contact our team for assistance.",
    "access.denied.refresh": "Refresh Access",
    "access.denied.refresh.desc": "Click to refresh your roles if they were recently updated",
    "access.denied.logout": "Logout",
    "access.denied.logout.desc": "Sign out and return to login page",
    "access.denied.info": "Please include your full name and employee ID when requesting access to the investment platform."

  
  },
  al: {
    // Questionnaire
    "risk.questionnaire": "Pyetësor i Riskut",
    ssn: "SSN",
    select: "Zgjidhni",
    result: "Rezultati",
    "submit.data": "Dërgo të Dhënat",
    "please.complete.form": "Ju lutemi plotësoni të gjitha fushat",
    "error.loading.questions": "Problem me marrjen e pyetjeve",
    "investment.summary": "Përmbledhja e Investimit",
    
  // Sidebar navigation
  "sidebar.exchange.rate": "Kursi i Këmbimit",
  "sidebar.upload.file": "Ngarko Skedar",
  "sidebar.reports.table": "Tabela e Raporteve",
  "sidebar.investment.questionnaire": "Pyetësori i Investimit",
  "sidebar.fund.configuration": "Konfigurimi i Fondit",
    
    // User profile
    "profile.logout": "Dil",
    
    // Summary screen
    "back": "Kthehu",
    "back.to.form": "Kthehu te Formulari",
    "download.pdf": "Shkarko PDF",
    "print": "Printo",
    "client.information": "Informacioni i Klientit",
    "risk.assessment": "Vlerësimi i Riskut",
    "detailed.responses": "Përgjigjet e Detajuara",
    "results": "Rezultatet",
    "investment.summary.print": "Përmbledhja e Investimit",
    "question": "Pyetja",
    "response": "Përgjigja",
    "generated.on": "Gjeneruar më",
    "time": "Ora",
    "firma": "Firma",
    "signature": "Firma",
    "summary.generated": "Kjo përmbledhje u gjenerua më",
    "at": "në",
    "platform.subtitle": "Vlerësimi i Riskut të Investimit",
    
    // Form placeholders
    "invest.summary": "Përmbledhja e Investimit",
    "ssn.placeholder": "Shkruani SSN (A12345678B)",
    "ssn.min.length": "SSN duhet të jetë të paktën 8 karaktere",
    
    // Language switch
    "switch.language": "EN",
    "ssn.required": "SSN është e nevojshme",
    "ssn.required.description": "Ju lutemi jepni SSN-në tuaj në URL për të hyrë në pyetësorin e investimit",
    "required.url.format": "Formati i Nevojshëm i URL-së:",
    "invalid.ssn.format": "Format i Pavlefshëm i SSN-së",
    "invalid.ssn.description": "SSN-ja e dhënë nuk përputhet me formatin e nevojshëm për pyetësorin e investimit",
    "current.ssn": "SSN Aktuale:",
    "required.format": "Formati i Nevojshëm:",
    "format.description": "Shkronjë + 8 shifra + Shkronjë",
    "loading.questionnaire": "Duke ngarkuar pyetësorin...",
    "loading.default": "Duke ngarkuar...",
    
    // Exchange Rate translations
    "exchange.rates.title": "Kursi i Këmbimit",
    "loading.exchange.rates": "Duke ngarkuar kursin e këmbimit...",
    "connection.error": "Gabim Lidhjeje",
    "try.again": "Provo Përsëri",
    "retrying": "Duke provuar përsëri...",
    "last.update.successful": "Përditësimi i Fundit i Suksesshëm",
    "auto.update.info": "Kursi i këmbimit përditësohet automatikisht çdo 30 minuta",
    "push.notifications": "Njoftimet Push",
    "activate.notifications": "Aktivizo njoftimet për ndryshimet e kursit",
    "activate": "Aktivizo",
    "individual": "Individe",
    "corporate": "Korporate",
    "individual.description": "Për shuma deri në 50,000 EUR ekuivalent",
    "corporate.description": "Për klientë korporatë dhe shuma mbi 50,000 EUR ekuivalent",
    "currency.type": "Lloji i Valutës",
    "code": "Kodi",
    "buy.rate": "Kursi i Blerjes",
    "sell.rate": "Kursi i Shitjes",
    "average": "Mesatarja",
    "trend": "Tendenca",
    "nr": "Nr.",
    "important.notes": "Shënime të Rëndësishme",
    "individual.note": "Kursi i këmbimit për klientë individë me shuma deri në 50,000 EUR ekuivalent",
    "corporate.note": "Kursi i këmbimit për biznese korporatë dhe shuma mbi 50,000 EUR ekuivalent",
    "auto.refresh.info": "Kursi i këmbimit përditësohet automatikisht çdo 30 minuta gjatë orëve të punës",
    "last.updated.at": "Përditësuar së fundmi në",
    "refresh": "Rifresko",
    "error.occurred": "Ndodhi një gabim",
    "offline.message": "Duket se jeni offline. Ju lutemi kontrolloni lidhjen tuaj të internetit.",
    "auto.retry.message": "Ri-provimi automatik në progres... (Tentativa {count}/3)",

    //Investment Report translations
    "investment.reports": "Raporti i investimeve",
    "detailed.investment.data": "Të dhëna të detajuara për investimet",
    'date': 'Data',
    'status': 'Statusi',
    'all': 'Të gjitha',
    'completed': 'Përfunduar',
    'pending': 'Në pritje',
    'failed': 'Dështuar',
    'processing': 'Duke u procesuar',
    'download.excel': 'Shkarko',
    'investment.report': 'Raporti i investimeve',
    'records.displayed': 'rekorde të shfaqura',
    'summary': 'Përmbledhja',
    'total.records': 'Rekorde totale',
    'total.amount': 'Shuma totale',
    'loading.reports': 'Duke ngarkuar raportet...',
    'loading.funds': 'Duke ngarkuar fondet...',
    "subtitle.exchangeRate": "Kursi i Këmbimit Valutor",
    "subtitle.uploadFile": "Ngarko & Proceso File",
    "subtitle.reports": "Raporte & Analiza",
    "fund.configuration": "Konfigurimi i Fondit",
    "subtitle.fundConfiguration": "Menaxho regjistrat e konfigurimit të fondeve",
    // Yellow header (short) for fund configuration card
    "fund.header.title": "Përmbledhje e Fondeve",
    "fund.header.subtitle": "Fonde aktive dhe veprime të shpejta",
    "search": "Kërko",
    "search.placeholder": "Kërko",
    "subtitle.default": "Pyetësori i investimeve",

    // Dashboard translations
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Mirë se vini në platformën tuaj të menaxhimit të investimeve. Zgjidhni një opsion më poshtë për të filluar.",
    "dashboard.quick.access": "Qasje e Shpejtë",
    "dashboard.live.rates": "Kurse të Drejtpërdrejta",
    "dashboard.live.rates.desc": "Kursi i këmbimit në kohë reale",
    "dashboard.reports": "Raporte",
    "dashboard.reports.desc": "Analiza të investimeve",
    "dashboard.assessment": "Vlerësimi",
    "dashboard.assessment.desc": "Mjeti i vlerësimit të riskut",
    "dashboard.upload": "Ngarko File",
    "dashboard.upload.desc": "Processo dhe menaxho file",
  "dashboard.fund.configuration.desc": "Menaxho llojet dhe cilësimet e fondeve",

    // Token refresh notifications
    "token.refreshed": "Rolet u Përditësuan",
    "token.refreshed.desc": "Rolet tuaja u përditësuan",

    // Access denied screen
    "access.denied.title": "Aksesi nuk është i mundur",
    "access.denied.message": "Aktualisht nuk keni autorizimin e nevojshëm për të hyrë në këtë platformë. ",
    "access.denied.contact": "Nëse mendoni se kjo është një gabim, ju lutemi kontaktoni ekipin tonë për ndihmë të mëtejshme.",
    "access.denied.refresh": "Rifresko Qasjen",
    "access.denied.refresh.desc": "Kliko për të rifreskuar rolet tuaja nëse janë përditësuar kohët e fundit",
    "access.denied.logout": "Dil",
    "access.denied.logout.desc": "Dil dhe kthehu në faqen e hyrjes",
    "access.denied.info": "Ju lutemi përfshini emrin tuaj të plotë dhe ID-në e punonjësit kur kërkoni qasje në platformën e investimeve."
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("al");

  // Add persistence
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.al] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}