"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Shield, CheckCircle, XCircle, Award, Star, Gem, FolderKanban, Globe, CreditCard, RefreshCw, FileSpreadsheet } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/helper/LoadingSpinner";
import { useLanguage } from '@/context/languageContext';
import FundService, { FundDto } from '@/service/FundService';


// Dummy data for demonstration
type Fund = {
  PrimeraFundId: number;
  Name: string;
  Code: string;
  Account: string;
  InsertDate: string;
  IsActive: boolean;
  ExitFee: number;
  MinAmountNew: number;
  MinimumInvestmentPeriodInYears: number;
  OngoingCharges: number;
  RiskLevelAL: string;
  RiskLevelEN: string;
  Currency: string;
  MinAmountExisting: number;
  MaxTransactionAmountLimit: number;
  [key: string]: string | number | boolean;
};

const readOnlyFields = [
  "PrimeraFundId",
  "Name",
  "Code",
  "Account",
  "InsertDate"
];

const editableFields = [
  "IsActive",
  "ExitFee",
  "MinAmountNew",
  "MinimumInvestmentPeriodInYears",
  "OngoingCharges",
  "RiskLevelAL",
  "RiskLevelEN",
  "Currency",
  "MinAmountExisting",
  "MaxTransactionAmountLimit"
];

const headerLabels: Record<string, string> = {
  PrimeraFundId: "Fund Id",
  Name: "Fund Name",
  Code: "Fund Code",
  Account: "Account Number",
  InsertDate: "Created On",
  IsActive: "Active",
  ExitFee: "Exit Fee (%)",
  MinAmountNew: "Min New Amount",
  MinimumInvestmentPeriodInYears: "Min Investment Years",
  OngoingCharges: "Ongoing Charges (%)",
  RiskLevelAL: "Risk Level (AL)",
  RiskLevelEN: "Risk Level (EN)",
  Currency: "Currency",
  MinAmountExisting: "Min Existing Amount",
  MaxTransactionAmountLimit: "Max Transaction Limit"
};

export default function FundConfigurationPage() {
  const [funds, setFunds] = useState<FundDto[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load funds from backend on mount
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await FundService.fetchFunds();
        if (!mounted) return;
        setFunds(data);
      } catch (error) {
        console.error('Failed to load funds:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const { t } = useLanguage();

  // Show full-screen loading spinner (loading funds) before rendering the page
  if (loading) {
    return <LoadingSpinner text={t('loading.funds') || 'Loading funds...'} />;
  }

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditForm({ ...funds[idx] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setEditForm((prev: any) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSave = () => {
    (async () => {
      if (editingIndex === null) return;
      try {
        setLoading(true);
        const fundToSave = { ...funds[editingIndex], ...editForm } as FundDto;
        if (fundToSave.id === undefined) {
          console.log('Invalid fundToSave:', fundToSave);
          throw new Error("Fund id is undefined.");
        }

        // Log the exact payload we're sending so we can debug persistence issues
        console.log('Saving fund payload to backend (id=' + fundToSave.id + '):', fundToSave);

        const updated = await FundService.updateFund(fundToSave.id, fundToSave);
        console.log('Update response:', updated);

        // Refresh full list to avoid stale data or caching issues. If this fails,
        // fallback to replacing the single item in the current list.
        try {
          const latest = await FundService.fetchFunds();
          setFunds(latest);
        } catch (err) {
          console.error('Failed to refresh funds after update, falling back to single-item update:', err);
          setFunds((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        }

        setEditingIndex(null);
        setEditForm({});
      } catch (error) {
        console.error('Failed to save fund:', error);
        // Keep the modal open so the user can inspect/fix and retry
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  return (
      <div className="w-full py-8">
        <div className="max-w-7xl w-full px-4 mx-auto">
          {/* Report-style header (title + subtitle) - matches ReportTableScreen */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('fund.configuration') || 'Fund Configuration'}</h1>
            <p className="text-gray-600">{t('subtitle.fundConfiguration') || 'Manage fund configuration records'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="relative">
              {/* Yellow header band (translatable) */}
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 flex items-center justify-between border-b border-yellow-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-yellow-100/30 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-yellow-600" aria-hidden="true" />
                    </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{t('fund.header.title') || 'Funds Overview'}</span>
                    <span className="text-xs text-yellow-900/80">{t('fund.header.subtitle') || 'Active funds and quick actions'}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-yellow-900/90">{funds.length} {t('records.displayed') || 'records displayed'}</div>
              </div>
              <div className="overflow-x-auto bg-gray-50/30">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {[...readOnlyFields, ...editableFields].map((field, index) => (
                    <th
                      key={field}
                      className={`px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200/50 ${
                        index === 0 ? 'sticky left-0 z-30 shadow-lg border-r border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100' : ''
                      }`}
                      style={{ backgroundColor: index === 0 ? undefined : undefined }}
                    >
                      {headerLabels[field] || field}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider border-r-0 bg-gradient-to-r from-gray-50 to-gray-100 sticky right-0 z-30 shadow-lg border-l border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {funds.map((fund, rowIndex) => (
                  <tr
                    key={fund.id ?? fund.PrimeraFundId}
                    className={`hover:bg-yellow-50/50 transition-all duration-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    {[...readOnlyFields, ...editableFields].map((field, colIndex) => (
                      <td
                        key={field}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100/50 ${
                          colIndex === 0 ? 'sticky left-0 z-30 font-semibold shadow-lg border-r border-gray-300 bg-white' : ''
                        }`}
                        style={{ backgroundColor: colIndex === 0 ? '#ffffff' : undefined }}
                      >
                        {editingIndex === rowIndex && editableFields.includes(field) ? (
                          field === "IsActive" ? (
                            <input
                              type="checkbox"
                              name={field}
                              checked={!!editForm[field]}
                              onChange={handleChange}
                            />
                          ) : (
                            <input
                              type="text"
                              name={field}
                              value={editForm[field]}
                              onChange={handleChange}
                              className="border rounded px-1 py-0.5 w-20 max-w-full truncate text-sm font-normal"
                              style={{ fontSize: "14px" }}
                            />
                          )
                        ) : field === "IsActive" ? (
                          fund[field] ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 font-semibold text-xs shadow-sm">
                              <CheckCircle className="w-4 h-4" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 font-semibold text-xs shadow-sm">
                              <XCircle className="w-4 h-4" /> Inactive
                            </span>
                          )
                        ) : field === "RiskLevelAL" || field === "RiskLevelEN" ? (
                          (() => {
                            const value = String(fund[field]).toLowerCase();
                            let colorClass = "bg-gray-100 text-gray-800";
                            let icon = null;
                            if (value === "high" || value === "lartë") {
                              colorClass = "bg-red-100 text-red-700";
                              icon = <span className="w-2 h-2 bg-red-500 rounded-full"></span>;
                            } else if (value === "medium" || value === "mesatar") {
                              colorClass = "bg-yellow-100 text-yellow-800";
                              icon = <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>;
                            } else if (value === "low" || value === "ulët") {
                              colorClass = "bg-green-100 text-green-700";
                              icon = <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
                            }
                            return (
                              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm ${colorClass}`}>
                                {icon}
                                {fund[field]}
                              </span>
                            );
                          })()
                        ) : field === "Name" ? (
                          <span className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm font-medium text-yellow-600 bg-yellow-50 border-yellow-200">
                            {fund[field]}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-700" title={String(fund[field])}>{fund[field]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-1 text-sm text-gray-900 border-r-0 bg-white sticky right-0 z-30 shadow-lg border-l border-gray-300">
                      <button
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-lg shadow-md transition-all duration-200 text-xs font-bold transform hover:scale-105 flex items-center gap-2"
                        onClick={() => handleEdit(rowIndex)}
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
          )}
        {/* Close overflow-x-auto div */}
        {/* Modal edit form overlay */}
        {editingIndex !== null && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleCancel} />
            {/* Modal overlay, just below header, not full screen */}
            <div className="fixed left-0 right-0 top-24 bottom-0 z-50 flex items-start justify-center pointer-events-none">
              <div className="relative max-w-2xl w-full mx-4 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 rounded-2xl shadow-2xl border border-yellow-200 p-8 max-h-[80vh] overflow-y-auto pointer-events-auto transition-all duration-300">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold transition-colors"
                  onClick={handleCancel}
                  aria-label="Close"
                  type="button"
                >
                  &times;
                </button>
                <div className="rounded-xl bg-yellow-400/90 px-4 py-3 mb-6 flex items-center gap-3 shadow-sm">
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7 text-yellow-700'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900">Edit Fund</h3>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* General Info */}
                  <div className="md:col-span-2 text-base font-semibold text-yellow-700 mb-3 mt-2 border-b border-yellow-200 pb-2 flex items-center gap-2">
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5 text-yellow-600'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' />
                    </svg>
                    General Information
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="PrimeraFundId">{headerLabels["PrimeraFundId"]}</label>
                    <input type="text" id="PrimeraFundId" name="PrimeraFundId" value={editForm["PrimeraFundId"] ?? ''} disabled className="border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-yellow-50/60 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="Name">{headerLabels["Name"]}</label>
                    <input type="text" id="Name" name="Name" value={editForm["Name"] ?? ''} disabled className="border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-yellow-50/60 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="Code">{headerLabels["Code"]}</label>
                    <input type="text" id="Code" name="Code" value={editForm["Code"] ?? ''} disabled className="border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-yellow-50/60 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="Account">{headerLabels["Account"]}</label>
                    <input type="text" id="Account" name="Account" value={editForm["Account"] ?? ''} disabled className="border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-yellow-50/60 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="InsertDate">{headerLabels["InsertDate"]}</label>
                    <input type="text" id="InsertDate" name="InsertDate" value={editForm["InsertDate"] ?? ''} disabled className="border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-yellow-50/60 text-gray-500 cursor-not-allowed" />
                  </div>

                  {/* Financial Info */}
                  <div className="md:col-span-2 text-base font-semibold text-yellow-700 mb-3 mt-6 border-b border-yellow-200 pb-2 flex items-center gap-2">
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5 text-yellow-600'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    Financial Information
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="ExitFee">{headerLabels["ExitFee"]}</label>
                    <input type="text" id="ExitFee" name="ExitFee" value={editForm["ExitFee"] ?? ''} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="MinAmountNew">{headerLabels["MinAmountNew"]}</label>
                    <input type="text" id="MinAmountNew" name="MinAmountNew" value={editForm["MinAmountNew"] ?? ''} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="MinAmountExisting">{headerLabels["MinAmountExisting"]}</label>
                    <input type="text" id="MinAmountExisting" name="MinAmountExisting" value={editForm["MinAmountExisting"] ?? ''} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="MaxTransactionAmountLimit">{headerLabels["MaxTransactionAmountLimit"]}</label>
                    <input type="text" id="MaxTransactionAmountLimit" name="MaxTransactionAmountLimit" value={editForm["MaxTransactionAmountLimit"] ?? ''} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="OngoingCharges">{headerLabels["OngoingCharges"]}</label>
                    <input type="text" id="OngoingCharges" name="OngoingCharges" value={editForm["OngoingCharges"] ?? ''} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="MinimumInvestmentPeriodInYears">{headerLabels["MinimumInvestmentPeriodInYears"]}</label>
                    <input type="text" id="MinimumInvestmentPeriodInYears" name="MinimumInvestmentPeriodInYears" value={editForm["MinimumInvestmentPeriodInYears"] ?? ''} onChange={handleChange} className="border border-yellow-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="Currency">{headerLabels["Currency"]}</label>
                    <div className="relative">
                      <select id="Currency" name="Currency" value={editForm["Currency"] ?? ''} onChange={handleChange} className="appearance-none w-full border border-yellow-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-shadow hover:shadow-sm bg-white">
                        <option value="ALL">ALL</option>
                        <option value="EUR">EUR</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Risk Info */}
                  <div className="md:col-span-2 text-base font-semibold text-yellow-700 mb-3 mt-6 border-b border-yellow-200 pb-2 flex items-center gap-2">
                    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5 text-yellow-600'>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
                    </svg>
                    Risk Information
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="RiskLevelAL">{headerLabels["RiskLevelAL"]}</label>
                    <div className="relative">
                      {(() => {
                        const v = String(editForm["RiskLevelAL"] ?? funds[editingIndex ?? 0]?.RiskLevelAL ?? '').toLowerCase();
                        let dot = 'bg-gray-400';
                        if (v === 'lartë') dot = 'bg-red-500';
                        else if (v === 'mesatar') dot = 'bg-yellow-500';
                        else if (v === 'ulët') dot = 'bg-green-500';
                        return <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${dot}`} />;
                      })()}
                      <select id="RiskLevelAL" name="RiskLevelAL" value={editForm["RiskLevelAL"] ?? ''} onChange={handleChange} className="appearance-none w-full border border-yellow-200 rounded-lg pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-shadow hover:shadow-sm bg-white">
                        <option value="Lartë">Lartë</option>
                        <option value="Mesatar">Mesatar</option>
                        <option value="Ulët">Ulët</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="RiskLevelEN">{headerLabels["RiskLevelEN"]}</label>
                    <div className="relative">
                      {(() => {
                        const v = String(editForm["RiskLevelEN"] ?? funds[editingIndex ?? 0]?.RiskLevelEN ?? '').toLowerCase();
                        let dot = 'bg-gray-400';
                        if (v === 'high') dot = 'bg-red-500';
                        else if (v === 'medium') dot = 'bg-yellow-500';
                        else if (v === 'low') dot = 'bg-green-500';
                        return <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${dot}`} />;
                      })()}
                      <select id="RiskLevelEN" name="RiskLevelEN" value={editForm["RiskLevelEN"] ?? ''} onChange={handleChange} className="appearance-none w-full border border-yellow-200 rounded-lg pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-shadow hover:shadow-sm bg-white">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-semibold text-yellow-700" htmlFor="IsActive">{headerLabels["IsActive"]}</label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="IsActive" name="IsActive" checked={!!editForm["IsActive"]} onChange={handleChange} className="h-5 w-5 accent-yellow-500 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-300" />
                      <span className="text-sm text-gray-600">Fund is active</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex gap-4 justify-end pt-6 border-t border-yellow-200 mt-6">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-lg shadow-lg font-semibold text-base transition-all duration-200 transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow font-semibold text-base border border-yellow-200 transition-all duration-200"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
