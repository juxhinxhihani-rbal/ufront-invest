import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Return the same hardcoded roles that are used in useUserRoles hook
  const roleConfig = {
    UPLOAD_FILE_ROLE: 'menu_invest_fx_rate_upload',
    EXCHANGE_SCREEN_ROLE: 'menu_invest_fx_rate_dashboard',
    QUESTIONNAIRE_SCREEN_ROLE: 'menu_invest_risk_questionnaire',
  };
  
  return NextResponse.json(roleConfig);
}
