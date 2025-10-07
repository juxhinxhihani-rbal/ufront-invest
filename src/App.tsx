import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/languageContext'
import MainLayout from './components/layout/MainLayout'
import DashboardScreen from './components/DashboardScreen'
import ExchangeRateScreen from './components/ExchangeRateScreen'
import UploadFileScreen from './components/UploadFileScreen'
import ReportTableScreen from './components/ReportTableScreen'
import InvestmentQuestionnaireScreen from './components/InvestmentQuestionnaireScreen'
import FundConfigurationTable from './components/FundConfigurationTable'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/exchangeRate" element={<ExchangeRateScreen />} />
            <Route path="/uploadFile" element={<UploadFileScreen />} />
            <Route path="/reportsTable" element={<ReportTableScreen />} />
            <Route path="/questionnaire" element={<InvestmentQuestionnaireScreen />} />
            <Route path="/fundConfiguration" element={<FundConfigurationTable />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
